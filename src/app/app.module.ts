import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {AmChartsModule} from "amcharts3-angular2";
import {DonutChartComponent} from "./util/components/donut-chart/donut-chart.component";
import {FundsService} from "./services/funds.service";
import {ChartComponent} from "./util/components/chart/chart.component";


@NgModule({
  declarations: [
    AppComponent,
    DonutChartComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AmChartsModule
  ],
  providers: [FundsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
