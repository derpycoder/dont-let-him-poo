import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Node, TILE_TYPES } from "./grid.model";

import * as _ from "lodash";
import { InteractionService } from "../interaction.service";

import { UtilsService } from "../utils.service";

@Injectable()
export class GridService {
  gameGridBackup: Node[][];
  gameGrid: Node[][];

  onGridReady: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private httpClient: HttpClient,
    private interactionService: InteractionService,
    private utilsService: UtilsService
  ) {}

  initGrid() {
    this.httpClient
      .get(`./assets/levels/${this.utilsService.getRandomNumber(1, 6)}.json`)
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

        this.gameGridBackup = _.cloneDeep(this.gameGrid);

        console.log(this.getNeighbors({ x: 5, y: 5, tileType: "meh" }));

        this.onGridReady.emit(true);
      });
  }

  resetGrid() {
    this.gameGrid = _.cloneDeep(this.gameGridBackup);
  }

  clearGrid() {
    this.gameGrid = this.gameGrid.map(row => {
      return row.map(cell => {
        cell.tileType = TILE_TYPES.NONE;
        return cell;
      });
    });
  }

  serializeGrid() {
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

    const dirs: any[][] = [[-1, 0], [0, 1], [1, 0], [-1, 0]];
    let i, j;

    if (this.interactionService.diagonalMovementAllowed) {
      dirs.push([-1, 1], [1, 1], [1, -1], [-1, -1]);
    }

    const neighbors: Node[] = [];

    dirs.forEach(dir => {
      i = target.x + dir[0];
      j = target.y + dir[1];

      if (
        this.checkBounds(i, j) &&
        this.gameGrid[i][j].tileType !== TILE_TYPES.WALL
      ) {
        neighbors.push(this.gameGrid[i][j]);
      }
    });

    return neighbors;
  }

  getCost(source: Node, destination: Node): number {
    return destination.x - source.x === 0 || destination.y - source.x === 0
      ? 1
      : Math.SQRT2;
  }

  private checkBounds(x, y): boolean {
    if (x >= 0 && x < 11 && (y >= 0 && y < 11)) {
      return true;
    }

    return false;
  }
}
