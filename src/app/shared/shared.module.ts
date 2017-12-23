import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TileFactoryDirective } from "./tile-factory/tile-factory.directive";

import {
  LooComponent,
  MoneyComponent,
  PizzaComponent,
  NoneComponent,
  SleepingComponent,
  PlayerComponent,
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
    WallComponent,
    PlayerComponent,
    SleepingComponent
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
    WallComponent,
    PlayerComponent,
    SleepingComponent
  ]
})
export class SharedModule {}
