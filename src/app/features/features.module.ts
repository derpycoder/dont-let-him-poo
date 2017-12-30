import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

// Routing Module
import { FeaturesRoutingModule } from "./features-routing.module";
import {} from "./rankings/rankings-routing.module";

import { SharedModule } from "../shared/shared.module";

// Components & Services
import {
  GameViewComponent,
  GridContainerComponent,
  CellContainerComponent,
  TrashCanComponent,
  SalaryGaugeComponent,
  PlayerComponent,
  MeasuringStickComponent,
  LineRendererComponent,
  GameOverComponent,
  LevelEditorComponent,
  GridService,
  InteractionService,
  SalaryService,
  PathFindingService,
  HeuristicService,
  ChoreographerService,
  UtilsService
} from "./game-view";

@NgModule({
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: [
    GameViewComponent,
    GridContainerComponent,
    CellContainerComponent,
    TrashCanComponent,
    SalaryGaugeComponent,
    PlayerComponent,
    MeasuringStickComponent,
    LineRendererComponent,
    GameOverComponent,
    LevelEditorComponent
  ],
  providers: [
    GridService,
    InteractionService,
    SalaryService,
    PathFindingService,
    HeuristicService,
    ChoreographerService,
    UtilsService
  ]
})
export class FeaturesModule {}
