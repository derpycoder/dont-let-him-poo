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
      .get(`${window.location.href.slice(0, -1)}/assets/levels/1.json`)
      .subscribe((data: any) => {
        this.gameGrid = data.gameGrid.map(row => {
          return row.map(cell => {
            return { tileType: cell };
          });
        });

        this.gameGridBackup = _.cloneDeep(this.gameGrid);
      });
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
    let serializedGrid = JSON.stringify({
      gameGrid: this.gameGrid.map(row => {
        return row.map((cell: any) => {
          return cell.tileType;
        });
      })
    });

    console.log(serializedGrid);
  }
}
