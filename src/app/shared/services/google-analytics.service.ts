import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformServer } from "@angular/common";

declare var ga;

@Injectable()
export class GoogleAnalyticsService {
  private googleAnalyticsKey: string = "UA-111701793-1";

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initGoogleAnalytics();
  }

  initGoogleAnalytics() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    try {
      window["ga"] =
        window["ga"] ||
        function() {
          (ga.q = ga.q || []).push(arguments);
        };
      ga.l = +new Date();
      ga("create", this.googleAnalyticsKey, "auto");
    } catch (e) {
      console.log(e);
    }
  }

  emitPageEvent(event) {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    
    try {
      ga("set", "page", event.urlAfterRedirects);
      ga("send", "pageview");
    } catch (e) {
      console.log(e);
    }
  }

  emitEvent(
    eventCategory: string,
    eventAction: string,
    callback?: Function,
    eventValue?: number,
    eventLabel?: string
  ) {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    try {
      ga("send", "event", {
        eventCategory: eventCategory,
        eventLabel: eventLabel,
        eventValue: eventValue,
        eventAction: eventAction,
        hitCallback: $ => {
          if (callback) {
            callback();
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}
