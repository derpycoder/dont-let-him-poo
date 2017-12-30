import {
  Component,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject
} from "@angular/core";
import { Router } from "@angular/router";

import { isPlatformBrowser, isPlatformServer } from "@angular/common";

import { environment } from "../../../environments/environment";

import { ChoreographerService } from "./services/choreographer/choreographer.service";
import { GAME_STATES } from "./services/choreographer/choreographer.model";

@Component({
  selector: "dlp-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent {
  tweetIntent: string = "https://twitter.com/intent/tweet/";
  whatsAppMsg: string = "whatsapp://send?text=";
  facebookMsg: string = "https://www.facebook.com/sharer/sharer.php?u=";

  game_states = GAME_STATES;
  env = environment;

  constructor(
    public choreographerService: ChoreographerService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.constructTweetIntent();
    this.constructWhatsAppMsg();
    this.constructFacebookMsg();
  }

  private constructTweetIntent() {
    const attributes = {
      "?original_referer": "http://www.abhijit-kar.com",
      "&text":
        "Prevent the pesky emoji from going to loo. Coz, it's a game revolving around poo!",
      "&hashtags": "dontletim",
      "&url": "http://www.abhijit-kar.com/dont-let-him-poo/",
      "&via": "ak24284"
    };

    Object.keys(attributes).forEach(key => {
      this.tweetIntent += key + "=" + encodeURIComponent(attributes[key]);
    });
  }

  private constructWhatsAppMsg() {
    this.whatsAppMsg += encodeURIComponent(
      `http://www.abhijit-kar.com/dont-let-him-poo/`
    );
  }
  private constructFacebookMsg() {
    this.facebookMsg += encodeURIComponent(`http://www.abhijit-kar.com/dont-let-him-poo/`);
  }

  showRankingsPage() {
    this.choreographerService.currentGameState = GAME_STATES.LOAD;
    this.router.navigate(["./rankings"]);
  }
}
