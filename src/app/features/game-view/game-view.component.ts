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

  constructor(
    public gridService: GridService,
    public choreographerService: ChoreographerService,
    private salaryService: SalaryService
  ) {}

  ngOnInit() {
    this.choreographerService.onGameStateChange.subscribe(state => {
      switch (state) {
        case GAME_STATES.START:
          this.gridService.initGrid();
          break;
        default:
      }
    });
  }

  restartGame() {
    if(this.choreographerService.currentGameState === GAME_STATES.RUNNING || this.choreographerService.currentGameState === GAME_STATES.GAME_OVER) {
      this.choreographerService.currentGameState = GAME_STATES.START;
      this.salaryService.salary = 0;
    }
  }
}
