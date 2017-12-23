import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { TimelineMax } from "gsap";

import { TILE_TYPES } from "./grid.model";

@Injectable()
export class GridService {
  gameGrid: string[][];

  // Depicts, if the user has mouse down, or touch down on a cell
  pointerDown: boolean;

  // Selected tile type
  selectedTileType: string = TILE_TYPES.player;

  timeLineHandle: TimelineMax;

  constructor(private httpClient: HttpClient) {
    this.timeLineHandle = new TimelineMax();
  }

  initGrid() {
    this.httpClient.get(`${window.location.href.slice(0, -1)}/assets/levels/1.json`).subscribe((data: any) => {
      console.log(data.gameGrid);
      this.gameGrid = data.gameGrid;
    });
  }
}
