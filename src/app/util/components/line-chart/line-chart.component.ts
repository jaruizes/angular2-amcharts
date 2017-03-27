import {Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrls: ['line-chart.component.css']
})
export class LineChartComponent implements OnInit, AfterViewInit {

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

  private graphs: Object[];

  constructor() {
  }

  ngOnInit() {
    console.log('Line Chart initializing.....');
    console.log(this.data);
  }

  ngAfterViewInit(): void {
    let chartsEngine = (window as any).AmCharts;
    let chartData: Object[] = this.data;

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
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "MM/YYYY",
      "categoryAxis": {
        "position" : "bottom",
        //"parseDates": true,
        "gridThickness": 0,
        "minPeriod": "YYYY"
      },
      "dataProvider": chartData,
      "graphs": LineChartComponent.getGraphsArray(chartData),
      "legend": {
        "align": "left",
        "valueAlign": "left",
        "title": "COMPARA"
      },
      "allLabels": [
        {
          "text": "RENTABILIDAD AÑO A AÑO",
          "size": "14",
          "bold": true
        },
        {
          "text": "HABRIA GANADO XXX €",
          "x": "!30",
          "align": "right",
          "size": "14",
          "bold": true,
          "id": "000023"
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
          "method": LineChartComponent.revenueCalculate
        }
      ]
    });
  }

  static revenueCalculate(e) {
    // TODO: Set right function in order to calculate amount
    let value:number = e.item.values.value;
    let revenue:number = (50000 * value) / 100;

    let tag:any = document.getElementsByClassName('amcharts-label-000023');
    tag[0].innerHTML = 'HABRIA GANADO ' + revenue + ' €';
  }

  static getGraphsArray(data: Object[]) {
    let item: Object = data[0];
    let graphs: Object[] = [];
    let index:number = 1;
    for (let property in item) {
      if (item.hasOwnProperty(property) && property != 'date') {
        console.log('Property: ' + property);
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
