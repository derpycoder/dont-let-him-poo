import { Injectable } from "@angular/core";

declare var ga;

@Injectable()
export class GoogleAnalyticsService {
  public emitEvent(
    eventCategory: string,
    eventAction: string,
    callback?: Function,
    eventLabel?: string,
    eventValue?: number
  ) {
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
  }
}
