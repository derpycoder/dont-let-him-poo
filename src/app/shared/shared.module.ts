import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import {
  CardComponent,
  GlobalErrorHandlerService,
  GoogleAnalyticsService
} from "./";

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    GoogleAnalyticsService
  ],
  exports: [CardComponent]
})
export class SharedModule {}
