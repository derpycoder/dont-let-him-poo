import { Injectable } from "@angular/core";

import { TILE_TYPES } from "./grid/grid.model";

@Injectable()
export class InteractionService {
  // Selected tile type
  selectedTileType: string = TILE_TYPES.PIZZA;
}
