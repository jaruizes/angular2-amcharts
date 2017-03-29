import {Component} from '@angular/core';
import {FundsService} from "./services/funds.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fundsChartData: Object[];
  lineChartData: Object[];
  donutChartData: Object[];
  idDonut:string;
  idLine:string;
  customerInvestmentPortfolio:string;

  constructor(private fundsService: FundsService) {
    this.donutChartData = fundsService.getSimulationFunds();
    this.lineChartData = fundsService.getProfitability();
    this.idDonut = 'chart001';
    this.idLine = 'chart002';
  }

  rollOverSlice(e) {
    console.log('rollOverSlice recived!!!!');
    console.log(e.data);
  }
}
