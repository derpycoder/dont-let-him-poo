import { Component } from "@angular/core";
import {
  ChoreographerService,
  SalaryService,
  GAME_STATES,
  GridService
} from "../../services";

import { GoogleAnalyticsService } from "../../../../shared/";

@Component({
  selector: "dlp-game-over",
  templateUrl: "./game-over.component.html",
  styleUrls: ["./game-over.component.css"]
})
export class GameOverComponent {
  game_states = GAME_STATES;

  constructor(
    public choreographerService: ChoreographerService,
    public salaryService: SalaryService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private gridService: GridService
  ) {}

  restartGame() {
    this.choreographerService.currentGameState = GAME_STATES.LOAD;
    this.googleAnalyticsService.emitEvent(
      "Gameplay",
      "Reload",
      null,
      this.gridService.fileNumber
    );
  }
}
