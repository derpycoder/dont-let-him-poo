import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TileFactoryDirective } from "./tile-factory/tile-factory.directive";

import {
  LooComponent,
  MoneyComponent,
  PizzaComponent,
  NoneComponent,
  WallComponent,
  PoopComponent
} from "./tile-factory";

@NgModule({
  imports: [CommonModule],
  declarations: [
    TileFactoryDirective,
    LooComponent,
    MoneyComponent,
    NoneComponent,
    PizzaComponent,
    PoopComponent,
    WallComponent
  ],
  exports: [
    TileFactoryDirective
  ],
  entryComponents: [
    LooComponent,
    MoneyComponent,
    NoneComponent,
    PizzaComponent,
    PoopComponent,
    WallComponent
  ]
})
export class SharedModule {}
