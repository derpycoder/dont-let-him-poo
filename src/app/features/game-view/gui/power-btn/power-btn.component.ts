import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import {
  ChoreographerService,
  GAME_STATES,
  GridService
} from "../../services/";
import { GoogleAnalyticsService } from "../../../../shared/";

@Component({
  selector: "dlp-power-btn",
  templateUrl: "./power-btn.component.html",
  styleUrls: ["./power-btn.component.css"]
})
export class PowerBtnComponent implements OnInit, OnDestroy {
  powerOffBtnActive: boolean = false;

  // Subscriptions
  private choreographerSubscription: Subscription;

  constructor(
    public choreographerService: ChoreographerService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private gridService: GridService
  ) {}

  ngOnInit() {
    this.choreographerSubscription = this.choreographerService.onGameStateChange.subscribe(
      (state: GAME_STATES) => {
        switch (state) {
          case GAME_STATES.START:
            this.powerOffBtnActive = false;
            break;
          case GAME_STATES.RUN:
            this.powerOffBtnActive = false;
            break;
          case GAME_STATES.RUNNING:
          case GAME_STATES.GAME_OVER:
          case GAME_STATES.EDIT_MODE:
            this.powerOffBtnActive = true;
            break;
          default:
            this.powerOffBtnActive = false;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.choreographerSubscription) {
      this.choreographerSubscription.unsubscribe();
    }
  }

  restartGame() {
    if (this.powerOffBtnActive) {
      this.googleAnalyticsService.emitEvent(
        "Gameplay",
        this.choreographerService.currentGameState !== GAME_STATES.GAME_OVER
          ? "Restart"
          : "Reload",
        null,
        this.gridService.fileNumber
      );
      this.choreographerService.currentGameState = GAME_STATES.LOAD;
    }
  }
}
