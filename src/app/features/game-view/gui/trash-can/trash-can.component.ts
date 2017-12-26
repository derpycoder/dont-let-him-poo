import { Component, OnInit } from "@angular/core";

import { TILE_TYPES } from "../../services/";
import { InteractionService } from "../../services/interaction.service";
import { ChoreographerService } from "../../services/choreographer/choreographer.service";
import { GAME_STATES } from "../../services/choreographer/choreographer.model";

@Component({
  selector: "dlp-trash-can",
  templateUrl: "./trash-can.component.html",
  styleUrls: ["./trash-can.component.css"]
})
export class TrashCanComponent implements OnInit {
  tile_types = TILE_TYPES;

  deactivateImage: boolean = true;

  constructor(
    public interactionService: InteractionService,
    public choreographerService: ChoreographerService
  ) {}

  ngOnInit() {
    this.choreographerService.onGameStateChange.subscribe(
      (state: GAME_STATES) => {
        this.deactivateImage = state !== GAME_STATES.RUNNING;

        if (state === GAME_STATES.LOAD) {
          this.interactionService.remainingQuantity.money = this.interactionService.remainingQuantity.pizza = 5;
          this.interactionService.selectedTileType = TILE_TYPES.NONE;
        }
      }
    );
  }

  selectMoney() {
    if (
      this.choreographerService.currentGameState === GAME_STATES.RUNNING &&
      this.interactionService.remainingQuantity[TILE_TYPES.MONEY] > 0
    ) {
      this.interactionService.selectedTileType = TILE_TYPES.MONEY;
    }
  }

  selectPizza() {
    if (
      this.choreographerService.currentGameState === GAME_STATES.RUNNING &&
      this.interactionService.remainingQuantity[TILE_TYPES.PIZZA] > 0
    ) {
      this.interactionService.selectedTileType = TILE_TYPES.PIZZA;
    }
  }
}
