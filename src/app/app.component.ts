import { Component, HostListener, NgZone } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { GoogleAnalyticsService } from "./shared/";

declare var ga;

@Component({
  selector: "dlp-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  // @HostListener("window:focus", ["$event"])
  // onFocus(event) {
  //   // TODO: UNPAUSE GAME
  // }

  @HostListener("window:onerror", ["$event"])
  onAnyError(event) {
    // TODO: PAUSE GAME
    console.log(event);
  }

  constructor(
    public router: Router,
    private googleAnalyticsService: GoogleAnalyticsService,
    private ngZone: NgZone
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga("set", "page", event.urlAfterRedirects);
        ga("send", "pageview");
      }
    });
    
    this.ngZone.onError.subscribe(err => {
      this.googleAnalyticsService.emitEvent("Error", err.message);
    });
  }
}
