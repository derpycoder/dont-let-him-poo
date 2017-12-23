import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaderboardComponent } from './leaderboard/leaderboard.component';

const leaderboardRoutes: Routes = [
  { path: '', component: LeaderboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(leaderboardRoutes)],
  exports: [RouterModule]
})
export class RankingsRoutingModule { }
