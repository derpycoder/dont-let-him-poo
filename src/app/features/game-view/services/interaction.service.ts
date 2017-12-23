import { Injectable } from "@angular/core";

import { TILE_TYPES } from "./grid/grid.model";

@Injectable()
export class InteractionService {
  remainingQuantity = {
    pizza: 5,
    money: 5
  };

  // Selected tile type
  selectedTileType: string = TILE_TYPES.NONE;

  updateQuantity(tileType) {
    if (this.remainingQuantity[tileType] > 0) {
      this.remainingQuantity[tileType]--;
    }
  }
}
