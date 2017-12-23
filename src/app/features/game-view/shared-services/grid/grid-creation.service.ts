import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class GridCreationService {
  gameGrid: string[][];

  constructor(private httpClient: HttpClient) {}

  initGrid() {
    this.httpClient
      .get(`${window.location.href.slice(0, -1)}/assets/levels/1.json`)
      .subscribe((data: any) => {
        console.log(data.gameGrid);
        this.gameGrid = data.gameGrid;
      });
  }
}
