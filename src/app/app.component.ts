import { Component } from '@angular/core';
import {FundsService} from "./services/funds.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  donutChartData:Object[];

  constructor (private fundsService:FundsService) {
    this.donutChartData = fundsService.getSimulationFunds();
  }
}
