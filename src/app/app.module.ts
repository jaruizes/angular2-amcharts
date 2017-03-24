import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {DonutChartComponent} from "./util/components/donut-chart/donut-chart.component";
import {FundsService} from "./services/funds.service";
import {LineChartComponent} from "./util/components/line-chart/line-chart.component";


@NgModule({
  declarations: [
    AppComponent,
    DonutChartComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [FundsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
