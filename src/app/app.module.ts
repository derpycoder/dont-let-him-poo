import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AppComponent } from "./app.component";

import { FeaturesModule } from "./features/features.module";
import { AppRoutingModule } from "./app.routing";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "dont-let-him-pou" }),
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    FeaturesModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
