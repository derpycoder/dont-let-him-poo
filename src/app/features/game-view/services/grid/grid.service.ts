import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Node, TILE_TYPES } from "./grid.model";

import * as _ from "lodash";
import { InteractionService } from "../interaction.service";

@Injectable()
export class GridService {
  gameGridBackup: Node[][];
  gameGrid: Node[][];

  constructor(
    private httpClient: HttpClient,
    private interactionService: InteractionService
  ) {}

  initGrid() {
    this.httpClient
      .get(`./assets/levels/${this.getRandomNumber(1, 6)}.json`)
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

        this.randomlyPlacePlayerAndLoo();

        this.gameGridBackup = _.cloneDeep(this.gameGrid);

        console.log(this.getNeighbors({ x: 5, y: 5, tileType: "meh" }));
      });
  }

  private randomlyPlacePlayerAndLoo() {
    let playerPlaced: boolean;
    let looPlaced: boolean;
    let i, j, x, y;

    let count = 0;

    while (true) {
      console.log(count++);

      if (!playerPlaced) {
        i = this.getRandomNumber(0, 10);
        j = this.getRandomNumber(0, 10);
      }
      if (!looPlaced) {
        x = this.getRandomNumber(0, 10);
        y = this.getRandomNumber(0, 10);
      }

      if (!playerPlaced && this.gameGrid[i][j].tileType === TILE_TYPES.NONE) {
        this.gameGrid[i][j].tileType = TILE_TYPES.PLAYER;
        playerPlaced = true;
      }

      if (!looPlaced && this.gameGrid[x][y].tileType === TILE_TYPES.NONE) {
        this.gameGrid[x][y].tileType = TILE_TYPES.LOO;
        looPlaced = true;
      }

      if (playerPlaced && looPlaced) {
        break;
      }
    }
  }

  private getRandomNumber(min: number, max: number): number {
    // Inclusive of both min and max
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    if (!this.gameGrid && !this.checkBounds(target.x, target.y)) {
      return;
    }

    let dirs: any[][] = [[-1, 0], [0, 1], [1, 0], [-1, 0]];
    let i, j;

    if (this.interactionService.diagonalMovementAllowed) {
      dirs.push([-1, 1], [1, 1], [1, -1], [-1, -1]);
    }

    let neighbors: Node[] = [];

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
