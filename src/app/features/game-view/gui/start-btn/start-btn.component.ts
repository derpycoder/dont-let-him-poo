import { Component } from "@angular/core";

import { GAME_STATES } from "../../services/choreographer/choreographer.model";

import { GoogleAnalyticsService } from "../../../../shared/";
import { ChoreographerService } from "../../services/";

@Component({
  selector: "dlp-start-btn",
  templateUrl: "./start-btn.component.html",
  styleUrls: ["./start-btn.component.css"]
})
export class StartBtnComponent {
  constructor(
    public choreographerService: ChoreographerService,
    public googleAnalyticsService: GoogleAnalyticsService
  ) {}
  startGame() {
    this.choreographerService.currentGameState = GAME_STATES.RUN;

    this.googleAnalyticsService.emitEvent("Gameplay", "Play");
  }
}
