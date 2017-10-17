import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing Module
import { DevLogRoutingModule } from './dev-log-routing.module';

// Components
import { LogViewComponent } from './';

@NgModule({
  imports: [
    CommonModule,
    DevLogRoutingModule
  ],
  declarations: [
    LogViewComponent
  ]
})
export class DevLogModule { }
