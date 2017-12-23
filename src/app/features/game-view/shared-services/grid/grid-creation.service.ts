import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CellData } from "./grid.model";

@Injectable()
export class GridCreationService {
  gameGrid: string[][];

  constructor(private httpClient: HttpClient) {}

  initGrid() {
    this.httpClient
      .get(`${window.location.href.slice(0, -1)}/assets/levels/1.json`)
      .subscribe((data: any) => {
        this.gameGrid = data.gameGrid.map(row => {
          return row.map(cell => {
            return {tileType: cell};
          });
        });
      });
  }

  serializeGrid() {
    return JSON.stringify({
      gameGrid: this.gameGrid.map(row => {
      return row.map((cell: any) => {
        return cell.tileType;
      });
    })
  });
  }
}
