import {Component} from '@angular/core';
import {FundsService} from "./services/funds.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  donutChartData: Object[];
  chartData: Object[];
  options: Object;

  constructor(private fundsService: FundsService) {
    this.donutChartData = fundsService.getSimulationFunds();
    this.options = {
      'id': 'chart-0001'
    };
    this.chartData = [];
    let colors:string[] = ["#ffd600", "#13cec4", "#db9e01"];
    let i:number = 0;
    for (let d of this.donutChartData) {
      let dataItem = {};
      dataItem['label'] = d['category'];
      dataItem['value'] = d['total'];
      dataItem['graphTooltip'] = AppComponent.buildTooltipGraph(d['composition']);
      dataItem['legendTooltip'] = 'Esto es el tooltip de ' + d['category'];
      dataItem['color'] = colors[i++];
      this.chartData.push(dataItem);
    }
  }

  static buildTooltipGraph(funds: Object[]) {
    let fundHTML: any = document.createElement('table');

    for (let fund of funds) {
      let fundTR = document.createElement('tr');
      let fundNameTD = document.createElement('td');
      fundNameTD.setAttribute('align', 'left');
      let fundValueTD = document.createElement('td');
      fundValueTD.setAttribute('align', 'right');

      fundNameTD.innerHTML = fund['name'];
      fundValueTD.innerHTML = fund['value'];
      fundTR.appendChild(fundNameTD);
      fundTR.appendChild(fundValueTD);
      fundHTML.appendChild(fundTR);
    }
    return fundHTML.outerHTML;

  }
}
