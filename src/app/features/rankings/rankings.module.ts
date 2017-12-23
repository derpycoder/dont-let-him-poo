import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing Module
import { RankingsRoutingModule } from './rankings-routing.module';

// Components
import { LeaderboardComponent } from './';

@NgModule({
  imports: [
    CommonModule,
    RankingsRoutingModule
  ],
  declarations: [
    LeaderboardComponent
  ]
})
export class RankingsModule { }
