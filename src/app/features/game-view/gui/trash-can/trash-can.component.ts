import { Component } from "@angular/core";

import { TILE_TYPES } from "../../services/";
import { InteractionService } from "../../services/interaction.service";

@Component({
  selector: "dlp-trash-can",
  templateUrl: "./trash-can.component.html",
  styleUrls: ["./trash-can.component.css"]
})
export class TrashCanComponent {
  tile_types = TILE_TYPES;

  constructor(public interactionService: InteractionService) {}

  selectMoney() {
    if (this.interactionService.remainingQuantity[TILE_TYPES.MONEY] > 0) {
      this.interactionService.selectedTileType = TILE_TYPES.MONEY;
    }
  }

  selectPizza() {
    if (this.interactionService.remainingQuantity[TILE_TYPES.PIZZA] > 0) {
      this.interactionService.selectedTileType = TILE_TYPES.PIZZA;
    }
  }
}
