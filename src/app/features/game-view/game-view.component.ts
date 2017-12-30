import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { environment } from "../../../environments/environment";

import { ChoreographerService } from "./services/choreographer/choreographer.service";
import { GAME_STATES } from "./services/choreographer/choreographer.model";

@Component({
  selector: "dlp-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent {
  game_states = GAME_STATES;
  env = environment;

  constructor(
    public choreographerService: ChoreographerService,
    private router: Router
  ) {}

  showRankingsPage() {
    this.choreographerService.currentGameState = GAME_STATES.LOAD;
    this.router.navigate(["./rankings"]);
  }
}
