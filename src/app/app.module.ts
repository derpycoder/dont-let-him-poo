import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// App Root
import { AppComponent } from './app.component';

// Feature Modules
import { FeaturesModule } from './features/features.module';

// Routing Modules
import { AppRoutingModule } from './app.routing';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'dont-let-him-pou' }),
    FeaturesModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
