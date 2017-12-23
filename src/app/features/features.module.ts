import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

// Routing Module
import { FeaturesRoutingModule } from "./features-routing.module";
import { DevLogRoutingModule } from "./dev-log/dev-log-routing.module";

// Components & Services
import {
  GameViewComponent,
  GridContainerComponent,
  CellContainerComponent,
  TileFactoryComponent,
  GridService
} from "./game-view";

import {
  LooComponent,
  MoneyComponent,
  PizzaComponent,
  NoneComponent,

  SleepingComponent,
  PlayerComponent,

  WallComponent,
  PoopComponent
} from "./game-view/cell-container/tile-factory/";

@NgModule({
  imports: [CommonModule, FeaturesRoutingModule, HttpClientModule],
  declarations: [
    GameViewComponent,
    GridContainerComponent,
    CellContainerComponent,
    TileFactoryComponent,

    LooComponent,
    MoneyComponent,
    NoneComponent,
    PizzaComponent,

    SleepingComponent,
    PlayerComponent,
    
    PoopComponent,
    WallComponent
  ],
  entryComponents: [
    LooComponent,
    MoneyComponent,
    NoneComponent,
    PizzaComponent,

    SleepingComponent,
    PlayerComponent,
    
    PoopComponent,
    WallComponent
  ],
  providers: [GridService]
})
export class FeaturesModule {}
