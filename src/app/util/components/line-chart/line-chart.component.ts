import {
  Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, HostListener,
  NgZone
} from '@angular/core';

@Component({
  selector: 'line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrls: ['line-chart.component.css']
})
export class LineChartComponent implements OnInit, AfterViewInit {
  @ViewChild('shouldHaveEarnedDiv') shouldHaveEarnedDiv: ElementRef;

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

  constructor(private _ngZone: NgZone) {  }

  @HostListener('document:showWouldHaveEarned', ['$event']) onShowWouldHaveEarned(ev) {
    this.revenueAmount = this.revenues[ev.detail.date].toFixed(2);
    this.shouldHaveEarnedDiv.nativeElement.style.display = 'block';
  }

  @HostListener('document:hideWouldHaveEarned') onHideWouldHaveEarned() {
    this.shouldHaveEarnedDiv.nativeElement.style.display = 'none';
  }

  ngOnInit() {
    console.log('Line Chart initializing.....');
    console.log(this.data);
    this.revenues = LineChartComponent.calculateGlobalRevenue(this.data, 1000);

  }

  ngAfterViewInit(): void {
    let chartsEngine = (window as any).AmCharts;
    let chartData: Object[] = this.data;
    // TODO: Check if it's possible to move to <onShowWouldHaveEarned>
    let shouldHaveEarnedDiv: any = this.shouldHaveEarnedDiv.nativeElement;

    this._ngZone.runOutsideAngular(() => {
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
          "cursorAlpha": 0,
          "valueLineEnabled": true,
          //"valueLineBalloonEnabled": true,
          "valueLineAlpha": 0.5,
          "fullWidth": true
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
        "allLabels": [
          {
            "text": "RENTABILIDAD AÑO A AÑO",
            "size": "14",
            "bold": true
          }
        ],
        "valueAxes": [{
          "axisAlpha": 0,
          "position": "left",
          "fontSize": 11,
          "color": "#a9a9a9",
          "gridThickness": 1,
          "dashLength": 5,
          "zeroGridAlpha": 0
        }],
        "listeners": [
          {
            "event": "rollOverGraphItem",
            "method": function (e) {
              if (e.item.graph.valueField == 'Tu cartera') {
                let event = new CustomEvent("showWouldHaveEarned", {
                  "detail": {
                    "date": e.item.dataContext.date
                  }
                });
                document.dispatchEvent(event);
              }
            }
          },
          {
            "event": "rollOutGraphItem",
            "method": function () {
              document.dispatchEvent(new CustomEvent("hideWouldHaveEarned"));
            }
          }
        ]
      });

      chart.addListener('drawn', function (e) {
        // TODO: This is done to positioning the div inside the chart div. Check if it's better do the same just with CSS
        // TODO: and putting the div over the chart div
        e.chart.chartDiv.insertBefore(shouldHaveEarnedDiv, e.chart.chartDiv.firstChild);
      });
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
