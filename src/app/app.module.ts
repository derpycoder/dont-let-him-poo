import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

// import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';

// App Root
import { AppComponent } from "./app.component";

// Feature Modules
import { FeaturesModule } from "./features/features.module";

// Routing Modules
import { AppRoutingModule } from "./app.routing";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "dont-let-him-pou" }),
    // ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    FeaturesModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
