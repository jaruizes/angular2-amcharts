import {Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, HostListener} from '@angular/core';

@Component({
  selector: 'line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrls: ['line-chart.component.css']
})
export class LineChartComponent implements OnInit, AfterViewInit {
  @ViewChild('habriaGanadoDiv') habriaGanadoDiv:ElementRef;

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

  private revenueAmount:number;

  @HostListener('document:updateRevenue', ['$event'])
  onupdateRevenue(ev) {
    console.log('Update revenue!!' + ev.detail);
    this.revenueAmount = ev.detail.toFixed(2);
  }

  constructor() {
  }

  ngOnInit() {
    console.log('Line Chart initializing.....');
    console.log(this.data);

  }

  private updateRevenue(value) {
    console.log(value);
  }

  ngAfterViewInit(): void {
    let chartsEngine = (window as any).AmCharts;
    let chartData: Object[] = this.data;
    let habriaGanadoDiv: any = this.habriaGanadoDiv.nativeElement;
    let revenues = LineChartComponent.calculateGlobalRevenue(this.data, 1000);
    let updateRevenue = this.updateRevenue;

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
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "MM/YYYY",
      "categoryAxis": {
        "position" : "bottom",
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
          "text": "",
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
          "method": function(e) {
            LineChartComponent.revenueCalculate(e, revenues, habriaGanadoDiv, updateRevenue);
          }
        }
      ]
    });

    chart.addListener('init', function(e) {
      e.chart.chartDiv.insertBefore(habriaGanadoDiv, e.chart.chartDiv.firstChild);
    });
  }

  static calculateGlobalRevenue(data, initialInvestment):Object {
    let revenues:Object = {};
    let updatedInvestment:number = initialInvestment;
    let investmentWithRevenue:number;
    let yearProfitability:number;
    for (let year of data) {
      yearProfitability = year['Tu cartera'];
      investmentWithRevenue = updatedInvestment * (1 + yearProfitability/100);
      revenues[year['date']] = investmentWithRevenue;
      updatedInvestment = investmentWithRevenue;
    }

    return revenues;
  }

  static revenueCalculate(e, revenues, habriaGanadoDiv, updateRevenue) {
    if (e.item.graph.valueField != 'Tu cartera') {
      return;
    }

    habriaGanadoDiv.style.display = 'block';
    let revenue:number = revenues[e.item.dataContext.date];
    let event = new CustomEvent("updateRevenue", { "detail": revenue });
    document.dispatchEvent(event);
  }

  static getGraphsArray(data: Object[]):Object[] {
    let item: Object = data[0];
    let graphs: Object[] = [];
    let index:number = 1;
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
