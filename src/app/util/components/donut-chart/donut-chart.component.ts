import {Component, EventEmitter, HostListener, Input, OnInit, Output} from "@angular/core";

@Component({
  selector: 'donut-chart',
  templateUrl: 'donut-chart.component.html',
  styleUrls: ['donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {

  // This is the unique id of the chart.
  @Input() chartId: string;

  // This is the data
  @Input() chartData: Object[];

  // This component will emit 'rollOverSlice' with the data of the slice attached
  @Output('rollOverSlice') rollOverSlice = new EventEmitter<Object>();

  // Listen to rollOverSlice local event
  @HostListener('document:rollOverSlice',['$event']) onRollOverSlice(e) {
    console.log('rollOverSlice emitedd!!!!');
    this.rollOverSlice.emit(e.detail);
  }

  private chartOptions: Object;
  constructor() {  }

  ngOnInit() {
    this.chartOptions = {
      'type': 'pie',
      'titleField': 'category',
      'valueField': 'total',
      'labelText': '[[percents]]%',
      'addClassNames': true,
      'labelRadius': -50,
      'innerRadius': '30%',
      'color': '#FFFFFF',
      'legend': {
        'enabled': false
      },
      'balloonFunction': DonutChartComponent.buildTooltipGraph,
      'balloon': {
        'borderColor': '#000000',
        'borderThickness': 1,
        'color': '#FFFFFF',
        'fillColor': '#000000'
      },
      'colors': ['#ffd600', '#13cec4', '#db9e01'],
      'dataProvider': this.chartData,
      "listeners": [{
        "event": "rollOverSlice",
        "method": DonutChartComponent._fireRollOverSlice
      }]
    };
  }

  /**
   * Builds the HTML code to show in the balloon
   * @param graphDataItem
   * @returns {string}
   */
  static buildTooltipGraph(graphDataItem:Object) {
    let funds:Object[] = graphDataItem['dataContext']['composition'];
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

  /**
   * Creates and fires the showWouldHaveEarned event
   * This function will be invoked by Amcharts library when the internal 'change event' is fired
   * @param e
   * @private
   */
  static _fireRollOverSlice(e) {
    let event = new CustomEvent('rollOverSlice', {
      'detail': {
        'data': e.dataItem['dataContext']
      }
    });
    document.dispatchEvent(event);
  }

}
