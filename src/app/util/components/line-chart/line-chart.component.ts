import {
  Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, HostListener,
  NgZone, OnDestroy
} from '@angular/core';

@Component({
  selector: 'line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrls: ['line-chart.component.css']
})
export class LineChartComponent implements OnInit, AfterViewInit, OnDestroy {

  /*
   Each object of the array has the following structure:
   - label: string
   - value: number
   - graphTooltip: string
   - legendTooltip: string
   - color: string
   */
  @Input() data: Object[];
  /*
   This object has the following structure:
   - id
   - height
   - width
   - title
   */
  @Input() options: Object;

  private revenueAmount: number;
  private revenues:Object;
  private chart:any;
  private showShouldHaveEarned:boolean;

  constructor(private _ngZone: NgZone) {
    this.showShouldHaveEarned = false;
  }

  @HostListener('document:showWouldHaveEarned', ['$event']) onShowWouldHaveEarned(ev) {
    this.revenueAmount = this.revenues[ev.detail.date].toFixed(2);
    this.showShouldHaveEarned = true;
  }

  @HostListener('document:hideWouldHaveEarned') onHideWouldHaveEarned() {
    //this.shouldHaveEarnedDiv.nativeElement.style.display = 'none';
  }

  ngOnInit() {
    console.log('Line Chart initializing.....');
    console.log(this.data);
    this.revenues = LineChartComponent.calculateGlobalRevenue(this.data, 1000);

  }

  ngOnDestroy(): void {
    let chart = this.chart;
    this._ngZone.runOutsideAngular(() => {
      chart.clear();
    });
  }

  ngAfterViewInit(): void {
    let chartsEngine = (window as any).AmCharts;
    let chartData: Object[] = this.data;

    this.chart = this._ngZone.runOutsideAngular(() => {
      // TODO: Extract chart build to service or parent class / component
      let chart: any = chartsEngine.makeChart(this.options['id2'], {
        "type": "serial",
        "theme": "none",
        "addClassNames": true,
        "categoryField": "date",
        "chartScrollbar": {
          "gridAlpha": 0,
          "color": "#888888",
          "scrollbarHeight": 55,
          "backgroundAlpha": 0,
          "selectedBackgroundAlpha": 0.1,
          "selectedBackgroundColor": "#888888",
          "graphFillAlpha": 0,
          "selectedGraphFillAlpha": 0,
          "graphLineAlpha": 0.2,
          "graphLineColor": "#c2c2c2",
          "selectedGraphLineColor": "#888888",
          "selectedGraphLineAlpha": 1
        },
        "chartCursor": {
          "cursorAlpha": 1,
          "valueLineAlpha": 0.5,
          "listeners": [
            {
              "event": "changed",
              "method": function (e) {
                let index:number = e.chart.categoryAxis.xToIndex(e.x);
                let date:string = e.chart.categoryAxis.data[index].category;
                fireShowWouldHaveEarned(date);
              }
            }
          ]
        },
        "dataDateFormat": "MM/YYYY", // TODO: To be deleted
        "categoryAxis": {
          "position": "bottom",
          "gridThickness": 0,
          "minPeriod": "YYYY"        // TODO: To be deleted
        },
        "dataProvider": chartData,
        "graphs": LineChartComponent.getGraphsArray(chartData),
        "legend": {
          "align": "left",
          "valueAlign": "left",
          "title": "COMPARA",
          "valueText":"",
          "valueWidth":0
        },
        /*"allLabels": [
          {
            "text": "RENTABILIDAD AÑO A AÑO",
            "size": "14",
            "bold": true
          }
        ],*/
        "valueAxes": [{
          "axisAlpha": 0,
          "position": "left",
          "fontSize": 11,
          "color": "#a9a9a9",
          "gridThickness": 1,
          "dashLength": 5,
          "zeroGridAlpha": 0
        }]
        /*
        This listener is not necessary because we're using chart cursor and capturing its change event
        "listeners": [
          {
            "event": "rollOverGraphItem",
            "method": function (e) {
              if (e.item.graph.valueField == 'Tu cartera') {
                fireShowWouldHaveEarned(e.item.dataContext.date);
              }
            }
          }
        ]*/
      });

      return chart;

      function fireShowWouldHaveEarned(value) {
        let event = new CustomEvent("showWouldHaveEarned", {
          "detail": {
            "date": value
          }
        });
        document.dispatchEvent(event);
      }
    });

  }

  static calculateGlobalRevenue(data, initialInvestment): Object {
    let revenues: Object = {};
    let updatedInvestment: number = initialInvestment;
    let investmentWithRevenue: number;
    let yearProfitability: number;
    for (let year of data) {
      yearProfitability = year['Tu cartera'];
      investmentWithRevenue = updatedInvestment * (1 + yearProfitability / 100);
      revenues[year['date']] = investmentWithRevenue;
      updatedInvestment = investmentWithRevenue;
    }

    return revenues;
  }

  static getGraphsArray(data: Object[]): Object[] {
    let item: Object = data[0];
    let graphs: Object[] = [];
    let index: number = 1;
    for (let property in item) {
      if (item.hasOwnProperty(property) && property != 'date') {
        let graph: Object = {
          "bullet": "round",
          "id": "AmGraph-" + index++,
          "type": "smoothedLine",
          "valueField": property,
          "title": property,
          "hidden": true
        };

        if (property == 'Tu cartera') {
          graph['lineColor'] = '#00dbd0';
          graph['fillColors'] = '#00dbd0';
          graph['hidden'] = false;
        }

        graphs.push(graph);
      }
    }

    return graphs;

  }

}
