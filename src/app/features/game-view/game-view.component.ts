import { Component, OnInit } from "@angular/core";

import { environment } from "../../../environments/environment";
import { TILE_TYPES } from "./services/grid/grid.model";
import { GridService } from "./services/";

import { ChoreographerService } from "./services/choreographer/choreographer.service";
import { GAME_STATES } from "./services/choreographer/choreographer.model";
import { SalaryService } from "./services/salary.service";

@Component({
  selector: "dlp-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent implements OnInit {
  title = "Don't Let Him Poo";
  tile_types = TILE_TYPES;
  game_states = GAME_STATES;
  env = environment;

  helperBtnText: string = "Edit";
  showHelpers: boolean;

  powerOffBtnActive: boolean = false;

  constructor(
    public gridService: GridService,
    public choreographerService: ChoreographerService,
    private salaryService: SalaryService
  ) {}

  ngOnInit() {
    this.choreographerService.onGameStateChange.subscribe(
      (state: GAME_STATES) => {
        switch (state) {
          case GAME_STATES.START:
            this.showHelpers = false;
            this.powerOffBtnActive = false;
            this.helperBtnText = "Edit";
            break;
          case GAME_STATES.RUN:
          case GAME_STATES.RUNNING:
          case GAME_STATES.GAME_OVER:
          case GAME_STATES.EDIT_MODE:
            this.powerOffBtnActive = true;
            this.helperBtnText = "Exit";
            break;
          default:
            this.powerOffBtnActive = false;
        }
      }
    );
  }

  restartGame() {
    if (this.powerOffBtnActive) {
      this.choreographerService.currentGameState = GAME_STATES.LOAD;
    }
  }

  editLevel() {
    if (this.choreographerService.currentGameState !== GAME_STATES.RUNNING) {
      this.showHelpers = true;
    }
    this.choreographerService.currentGameState = GAME_STATES.EDIT_MODE;
  }
}
