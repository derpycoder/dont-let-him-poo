import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core";
import { GoogleAnalyticsService } from "./google-analytics.service";

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private injector: Injector,
    private googleAnalyticsService: GoogleAnalyticsService,
    private ngZone: NgZone
  ) {
    this.ngZone.onError.subscribe(error => {
      this.emitPrintAndLogError(error);
    });
  }

  handleError(error) {
    this.emitPrintAndLogError(error);
  }

  emitPrintAndLogError(error) {
    const errMsg = error.message || error.toString();
    this.googleAnalyticsService.emitEvent("Error", errMsg);
    console.log(errMsg);
  }
}
