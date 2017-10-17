import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesModule } from '../features/features.module';

@NgModule({
  imports: [
    CommonModule,
    FeaturesModule
  ]
})
export class SharedModule { }
