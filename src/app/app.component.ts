import { Component, HostListener } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { GoogleAnalyticsService } from "./shared/";

declare var ga;

@Component({
  selector: "dlp-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  @HostListener("window:focus", ["$event"])
  onFocus(event) {
    this.googleAnalyticsService.emitEvent("Focus", "Acquired");
  }

  @HostListener("window:blur", ["$event"])
  onBlur(event) {
    this.googleAnalyticsService.emitEvent("Focus", "Lost");
  }

  constructor(
    public router: Router,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga("set", "page", event.urlAfterRedirects);
        // ga("set", "transport", "beacon");
        ga("send", "pageview");
      }
    });
  }
}
