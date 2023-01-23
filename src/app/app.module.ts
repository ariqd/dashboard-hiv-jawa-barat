import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { PieComponent } from './pie/pie.component';
import { BarCitiesComponent } from './barCities/barCities.component';
import { LineComponent } from './line/line.component';

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    PieComponent,
    BarCitiesComponent,
    LineComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
