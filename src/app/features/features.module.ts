import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

// Routing Module
import { FeaturesRoutingModule } from "./features-routing.module";
import { DevLogRoutingModule } from "./dev-log/dev-log-routing.module";

import { SharedModule } from "../shared/shared.module";

// Components & Services
import {
  GameViewComponent,
  GridContainerComponent,
  CellContainerComponent,
  GridCreationService,
  InteractionService
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
    CellContainerComponent
  ],
  providers: [GridCreationService, InteractionService]
})
export class FeaturesModule {}
