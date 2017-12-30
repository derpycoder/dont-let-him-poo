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

  game_states = GAME_STATES;
  env = environment;

  constructor(
    public choreographerService: ChoreographerService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.constructTweetIntent();
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

  tweet() {
    if (isPlatformBrowser) {
      this.popUpCenter(this.tweetIntent, "Share a link on Twitter", 500, 500);
    }
  }

  private popUpCenter(url, title, w, h) {
    if (isPlatformBrowser(this.platformId)) {
      var dualScreenLeft =
        window.screenLeft != undefined ? window.screenLeft : screen.left;
      var dualScreenTop =
        window.screenTop != undefined ? window.screenTop : screen.top;

      var width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
          ? document.documentElement.clientWidth
          : screen.width;
      var height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
          ? document.documentElement.clientHeight
          : screen.height;

      var left = width / 2 - w / 2 + dualScreenLeft;
      var top = height / 2 - h / 2 + dualScreenTop;
      var newWindow = window.open(
        url,
        title,
        "scrollbars=yes, width=" +
          w +
          ", height=" +
          h +
          ", top=" +
          top +
          ", left=" +
          left
      );

      if (window.focus) {
        newWindow.focus();
      }
    }
  }

  showRankingsPage() {
    this.choreographerService.currentGameState = GAME_STATES.LOAD;
    this.router.navigate(["./rankings"]);
  }
}
