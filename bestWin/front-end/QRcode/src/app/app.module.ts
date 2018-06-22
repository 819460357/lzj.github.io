import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';

import { ShareModule } from './utils/share/share.module';
// import { AlertModule } from './utils/alert/alert.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ShareModule,
    // AlertModule,
  ],
  providers: [ { provide: LocationStrategy, useClass: HashLocationStrategy, } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
