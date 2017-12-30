import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { environment } from "../../../../../environments/environment";

import {
  ChoreographerService,
  GridService,
  GAME_STATES,
  TILE_TYPES
} from "../../services/";

@Component({
  selector: "dlp-level-editor",
  templateUrl: "./level-editor.component.html",
  styleUrls: ["./level-editor.component.css"]
})
export class LevelEditorComponent implements OnInit, OnDestroy {
  helperBtnText: string = "Edit";
  showHelpers: boolean;

  showLevelEditBtn: boolean = false;

  // Subscriptions
  private choreographerSubscription: Subscription;

  constructor(
    public gridService: GridService,
    public choreographerService: ChoreographerService
  ) {}

  ngOnInit() {
    this.choreographerSubscription = this.choreographerService.onGameStateChange.subscribe(
      (state: GAME_STATES) => {
        switch (state) {
          case GAME_STATES.START:
            this.showHelpers = false;
            this.helperBtnText = "Edit";
            this.showLevelEditBtn = true;
            break;
          case GAME_STATES.RUN:
            this.showLevelEditBtn = false;
            break;
          case GAME_STATES.RUNNING:
          case GAME_STATES.GAME_OVER:
          case GAME_STATES.EDIT_MODE:
            this.helperBtnText = "Exit";
            this.showLevelEditBtn = true;
            break;
          default:
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.choreographerSubscription) {
      this.choreographerSubscription.unsubscribe();
    }
  }
  editOrExitLevel() {
    if (
      this.choreographerService.currentGameState === GAME_STATES.RUN ||
      this.choreographerService.currentGameState === GAME_STATES.LOAD
    ) {
      return;
    }
    if (this.choreographerService.currentGameState !== GAME_STATES.RUNNING) {
      this.showHelpers = true;
    }
    this.choreographerService.currentGameState = GAME_STATES.EDIT_MODE;
  }
}
