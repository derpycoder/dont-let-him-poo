import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogViewComponent } from './log-view/log-view.component';

const devLogRoutes: Routes = [
  { path: '', component: LogViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(devLogRoutes)],
  exports: [RouterModule]
})
export class DevLogRoutingModule { }
