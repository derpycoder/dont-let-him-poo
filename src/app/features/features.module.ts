import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing Module
import { FeaturesRoutingModule } from './features-routing.module';
import { DevLogRoutingModule } from './dev-log/dev-log-routing.module';

// Components & Services
import {
  GameViewComponent,
  GridContainerComponent,
  CellContainerComponent,
  EmojiFactoryComponent,
  GridService
} from './game-view';

@NgModule({
  imports: [
    CommonModule,
    FeaturesRoutingModule
  ],
  declarations: [
    GameViewComponent,
    GridContainerComponent,
    CellContainerComponent,
    EmojiFactoryComponent
  ],
  providers: [GridService]
})
export class FeaturesModule { }
