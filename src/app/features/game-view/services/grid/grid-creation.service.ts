import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CellData, TILE_TYPES } from "./grid.model";

import * as _ from "lodash";

@Injectable()
export class GridCreationService {
  gameGridBackup: CellData[][];
  gameGrid: CellData[][];

  constructor(private httpClient: HttpClient) {}

  initGrid() {
    this.httpClient
      .get(`./assets/levels/${this.getRandomNumber(1, 6)}.json`)
      .subscribe((data: any) => {
        this.gameGrid = data.gameGrid.map(row => {
          return row.map(cell => {
            return { tileType: cell };
          });
        });

        this.randomlyPlacePlayerAndLoo();

        this.gameGridBackup = _.cloneDeep(this.gameGrid);
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
        return { tileType: TILE_TYPES.NONE };
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
}
