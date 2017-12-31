import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { CardComponent, GoogleAnalyticsService } from "./";

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent],
  providers: [GoogleAnalyticsService],
  exports: [CardComponent]
})
export class SharedModule {}
