import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import {
  CardComponent,
  GoogleAnalyticsService,
  GlobalErrorHandlerService
} from "./";

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent],
  providers: [GoogleAnalyticsService, GlobalErrorHandlerService],
  exports: [CardComponent]
})
export class SharedModule {}
