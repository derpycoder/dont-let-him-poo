import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { environment } from "../../../environments/environment";

import { ChoreographerService } from "./services/choreographer/choreographer.service";
import { GAME_STATES } from "./services/choreographer/choreographer.model";
import { GoogleAnalyticsService } from "../../shared/";

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
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  showRankingsPage() {
    this.choreographerService.currentGameState = GAME_STATES.LOAD;
    this.router.navigate(["./rankings"]);
  }

  directToPayPal(event: Event) {
    event.preventDefault();
    this.googleAnalyticsService.emitEvent("Donation", "PayPal", $ => {
      window.open("http://paypal.me/abhijitkar", "_blank");
    });
  }
  directToPortfolio(event: Event, site: string, url: string) {
    event.preventDefault();
    this.googleAnalyticsService.emitEvent("Portfolio", site, $ => {
      window.open(url, "_blank");
    });
  }
}
