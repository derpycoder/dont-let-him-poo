import { EventEmitter, Injectable } from '@angular/core';

import { TimelineMax } from 'gsap';

import { CellData, TILE_TYPES } from './grid.model';

@Injectable()
export class GridService {
  // The main grid
  gameGrid: CellData[][];

  // Depicts, if the user has mouse down, or touch down on a cell
  pointerDown: boolean;

  // Selected tile type
  selectedTileType: TILE_TYPES = TILE_TYPES.PLAYER;

  timeLineHandle: TimelineMax;

  constructor() {
    this.timeLineHandle = new TimelineMax();
  }

  initGrid() {
    this.gameGrid = [];

    for (let i = 0; i < 11; i++) {
      this.gameGrid.push([]);
      for (let j = 0; j < 11; j++) {
        this.gameGrid[i].push({
          x: i,
          y: j,
          tileType: TILE_TYPES.NONE
        });
      }
    }
  }
  private checkViewPort() {

  }
}
