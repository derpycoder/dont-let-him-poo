import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { CardComponent } from "./";

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent],
  exports: [CardComponent]
})
export class SharedModule {}
