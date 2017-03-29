import {Component, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrls: ['line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  // This is the unique id of the chart.
  @Input() chartId: string;

  // This is the id of the customer investment portfolio.
  @Input() customerInvestmentPortfolio: string;

  // This is the initial investment
  @Input() initialInvestment: number;

  // This is the data
  @Input() chartData: Object[];

  private revenueAmount: number;
  private revenues: Object = {};
  private showShouldHaveEarned: boolean;
  private chartOptions: Object;

  constructor() {
    this.showShouldHaveEarned = false;
  }

  /**
   * Listens to 'showWouldHaveEarned' event fired by Amcharts library to update the value
   * of showWouldHaveEarned
   * @param ev
   */
  @HostListener('document:showWouldHaveEarned', ['$event']) onShowWouldHaveEarned(ev) {
    this.revenueAmount = this.revenues[ev.detail.date];
    this.showShouldHaveEarned = true;
  }

  ngOnInit() {
    // Calculates all the revenues. By this way just one calculation operation is done.
    this._calculateGlobalRevenue();

    // This is the JSON object required for AmCharts to make the line graph
    this.chartOptions = {
      'type': 'serial',
      'theme': 'none',
      'addClassNames': true,
      'categoryField': 'date',
      'chartScrollbar': {
        'gridAlpha': 0,
        'color': '#888888',
        'scrollbarHeight': 55,
        'backgroundAlpha': 0,
        'selectedBackgroundAlpha': 0.1,
        'selectedBackgroundColor': '#888888',
        'graphFillAlpha': 0,
        'selectedGraphFillAlpha': 0,
        'graphLineAlpha': 0.2,
        'graphLineColor': '#c2c2c2',
        'selectedGraphLineColor': '#888888',
        'selectedGraphLineAlpha': 1
      },
      'chartCursor': {
        'cursorAlpha': 1,
        'valueLineAlpha': 0.5,
        'listeners': [
          {
            'event': 'changed',
            'method': LineChartComponent._fireShowWouldHaveEarned
          }
        ]
      },
      'categoryAxis': {
        'position': 'bottom',
        'gridThickness': 0,
      },
      'dataProvider': this.chartData,
      'graphs': LineChartComponent._getGraphsArray(this.chartData, this.customerInvestmentPortfolio),
      'legend': {
        'align': 'left',
        'valueAlign': 'left',
        'title': 'COMPARA',  // TODO: i18n
        'valueText': '',
        'valueWidth': 0
      },
      'valueAxes': [{
        'axisAlpha': 0,
        'position': 'left',
        'fontSize': 11,
        'color': '#a9a9a9',
        'gridThickness': 1,
        'dashLength': 5,
        'zeroGridAlpha': 0
      }]
    };
  }

  /**
   * Calculates all the revenues based on profitability of each year and the initial investment.
   * Returns an Object with a key per each date in data. The value of each key is the revenue.
   * @private
   */
  _calculateGlobalRevenue(): void {
    let updatedInvestment: number = this.initialInvestment;
    let investmentWithRevenue: number;
    let yearProfitability: number;

    for (let year of this.chartData) {
      yearProfitability = year[this.customerInvestmentPortfolio];
      investmentWithRevenue = updatedInvestment * (1 + yearProfitability / 100);
      this.revenues[year['date']] = investmentWithRevenue.toFixed(2);
      updatedInvestment = investmentWithRevenue;
    }
  }

  /**
   * Creates and fires the showWouldHaveEarned event
   * This function will be invoked by Amcharts library when the internal 'change event' is fired
   * @param e
   * @private
   */
  static _fireShowWouldHaveEarned(e) {
    let index: number = e.chart.categoryAxis.xToIndex(e.x);
    let date: string = e.chart.categoryAxis.data[index].category;
    let event = new CustomEvent('showWouldHaveEarned', {
      'detail': {
        'date': date
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Creates the 'graphs' node necessary to create the serial chart
   * @param data
   * @param customerInvestmentPortfolio
   * @returns {Object[]}
   * @private
   */
  static _getGraphsArray(data: Object[], customerInvestmentPortfolio): Object[] {
    let item: Object = data[0];
    let graphs: Object[] = [];
    for (let property in item) {
      if (item.hasOwnProperty(property) && property != 'date') {
        let graph: Object = {
          'bullet': 'round',
          'type': 'smoothedLine',
          'valueField': property,
          'title': property,
          'hidden': true
        };

        if (property == customerInvestmentPortfolio) {
          graph['lineColor'] = '#00dbd0';
          graph['hidden'] = false;
          graph['switchable'] = false;
        }

        graphs.push(graph);
      }
    }

    return graphs;

  }

}
