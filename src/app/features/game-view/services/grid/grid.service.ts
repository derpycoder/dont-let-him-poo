import { Injectable, EventEmitter, Optional, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { APP_BASE_HREF } from "@angular/common";

import { Node, TILE_TYPES } from "./grid.model";

import { environment } from "../../../../../environments/environment";

import * as _ from "lodash";
import { InteractionService } from "../interaction.service";

import { UtilsService } from "../utils.service";
import { PLAYER_MOVES } from "../choreographer/choreographer.model";

const MAX_LEVELS = 18;

@Injectable()
export class GridService {
  levelsRandomized: boolean = true;

  gameGridBackup: Node[][];
  gameGrid: Node[][];

  onGridReady: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * For Angular universal to work, path need to be absolute in server
   * while being relative in browser
   * Hence Origin is needed.
   */
  constructor(
    private httpClient: HttpClient,
    private interactionService: InteractionService,
    private utilsService: UtilsService,
    @Optional()
    @Inject(APP_BASE_HREF)
    private origin: string
  ) {}

  initGrid() {
    const fileName = environment.randomizeLevel
      ? this.utilsService.getRandomNumber(1, MAX_LEVELS)
      : "playground";

    this.httpClient
      .get(`${this.origin || ""}/assets/levels/${fileName}.json`)
      .subscribe((data: any) => {
        this.gameGrid = [];
        let row: Node[];

        for (let i = 0; i < data.gameGrid.length; i++) {
          row = [];
          for (let j = 0; j < data.gameGrid[i].length; j++) {
            row.push({
              x: i,
              y: j,
              tileType: data.gameGrid[i][j]
            });
          }
          this.gameGrid.push(row);
        }

        if (!environment.production) {
          this.gameGridBackup = _.cloneDeep(this.gameGrid);
        }

        this.onGridReady.emit(true);
      });
  }

  resetGrid() {
    if (this.gameGridBackup) {
      this.gameGrid = _.cloneDeep(this.gameGridBackup);
    }
  }

  clearGrid() {
    if (!this.gameGrid) {
      return;
    }

    this.gameGrid = this.gameGrid.map(row => {
      return row.map(cell => {
        cell.tileType = TILE_TYPES.NONE;
        return cell;
      });
    });
  }

  serializeGrid() {
    if (!this.gameGrid) {
      return;
    }

    const serializedGrid = JSON.stringify({
      gameGrid: this.gameGrid.map(row => {
        return row.map((cell: any) => {
          return cell.tileType;
        });
      })
    });

    console.log(serializedGrid);
  }

  getNeighbors(target: Node): Node[] {
    if (!this.gameGrid || !this.checkBounds(target.x, target.y)) {
      return;
    }

    const x = target.x,
      y = target.y,
      neighbors: Node[] = [];
    let s0 = false,
      d0 = false,
      s1 = false,
      d1 = false,
      s2 = false,
      d2 = false,
      s3 = false,
      d3 = false;

    // ↑
    if (this.isWalkable(x - 1, y)) {
      neighbors.push(this.gameGrid[x - 1][y]);
      s0 = true;
    }
    // →
    if (this.isWalkable(x, y + 1)) {
      neighbors.push(this.gameGrid[x][y + 1]);
      s1 = true;
    }
    // ↓
    if (this.isWalkable(x + 1, y)) {
      neighbors.push(this.gameGrid[x + 1][y]);
      s2 = true;
    }
    // ←
    if (this.isWalkable(x, y - 1)) {
      neighbors.push(this.gameGrid[x][y - 1]);
      s3 = true;
    }

    if (this.interactionService.playerMoves === PLAYER_MOVES.NORMAL) {
      return neighbors;
    }

    if (this.interactionService.playerMoves === PLAYER_MOVES.DIAGONAL) {
      d0 = s3 && s0;
      d1 = s0 && s1;
      d2 = s1 && s2;
      d3 = s2 && s3;
    } else if (
      this.interactionService.playerMoves === PLAYER_MOVES.DIAGONAL_HOP
    ) {
      d0 = d1 = d2 = d3 = true;
    }

    // ↖
    if (d0 && this.isWalkable(x - 1, y - 1)) {
      neighbors.push(this.gameGrid[x - 1][y - 1]);
    }
    // ↗
    if (d1 && this.isWalkable(x - 1, y + 1)) {
      neighbors.push(this.gameGrid[x - 1][y + 1]);
    }
    // ↘
    if (d2 && this.isWalkable(x + 1, y + 1)) {
      neighbors.push(this.gameGrid[x + 1][y + 1]);
    }
    // ↙
    if (d3 && this.isWalkable(x + 1, y - 1)) {
      neighbors.push(this.gameGrid[x + 1][y - 1]);
    }

    return neighbors;
  }

  getCost(source: Node, destination: Node): number {
    return destination.x - source.x === 0 || destination.y - source.x === 0
      ? 10
      : 14;
  }

  private isWalkable(x, y): boolean {
    if (
      this.checkBounds(x, y) &&
      this.gameGrid[x][y].tileType !== TILE_TYPES.WALL
    ) {
      return true;
    }

    return false;
  }

  private checkBounds(x, y): boolean {
    if (x >= 0 && x < 11 && (y >= 0 && y < 11)) {
      return true;
    }

    return false;
  }
}
