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
      "addClassNames": true,
      "categoryField": "month",
      "color": "#FFFFFF",
      "chartScrollbar": {
        "graph": "g1",
        "gridAlpha": 0,
        "color": "#888888",
        "scrollbarHeight": 55,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "graphFillAlpha": 0,
        "autoGridCount": true,
        "selectedGraphFillAlpha": 0,
        "graphLineAlpha": 0.2,
        "graphLineColor": "#c2c2c2",
        "selectedGraphLineColor": "#888888",
        "selectedGraphLineAlpha": 1

      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "valueLineAlpha": 0.5,
        "fullWidth": true
      },
      "categoryAxis": {
        "gridPosition": "start"
      },
      "dataProvider": chartData,
      "graphs": LineChartComponent.getGraphsArray(chartData),
      "legend": {
        "align": "center",
        "periodValueText": "",
        "valueAlign": "left",
        "valueText": ""
      },
    });

    chart.addListener("init", function(e) {
      e.chart.legend.balloon = {
        item: false,
        wrapper: null,
        container: null,
        mousemove: e.chart.handleMouseMove,
        titles: {}
      };
    });
  }

  static getGraphTooltip(graphDataItem: any) {
    return graphDataItem.dataContext['graphTooltip'];
  }

  static getColorsArray(data) {
    let colors: string[] = [];
    for (let d of data) {
      colors.push(d['color']);
    }

    return colors;
  }

  static getGraphsArray(data: Object[]) {
    let item: Object = data[0];
    let graphs: Object[] = [];
    for (let property in item) {
      if (item.hasOwnProperty(property) && property != 'month') {
        let graph: Object = {
          "bullet": "round",
          "bulletSize": 8,
          "lineThickness": 2,
          "type": "smoothedLine",
          "valueField": property,
          "title": property
        };

        graphs.push(graph);
      }
    }

    return graphs;

  }

}
