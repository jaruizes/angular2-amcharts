import {Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'donut-chart',
  templateUrl: 'donut-chart.component.html',
  styleUrls: ['donut-chart.component.css']
})
export class DonutChartComponent implements OnInit, AfterViewInit {

  @ViewChild('legendTooltipDiv') legendTooltipDiv:ElementRef;
  @ViewChild('legendTooltipContainer') legendTooltipContainer:ElementRef;

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

  constructor() {
  }

  ngOnInit() {
    console.log('Chart initializing.....');
    console.log(this.data);
    console.log(this.options);
  }

  ngAfterViewInit(): void {
    let legendTooltipDiv:ElementRef = this.legendTooltipDiv;
    let legendTooltipContainer:ElementRef = this.legendTooltipContainer;
    let chartsEngine = (window as any).AmCharts;
    let chartData: Object[] = this.data;

    let chart: any = chartsEngine.makeChart(this.options['id'], {
      "type": "pie",
      "titleField": "label",
      "valueField": "value",
      "labelText": "[[percents]]%",
      "addClassNames": true,
      "labelRadius": -50,
      "innerRadius": "30%",
      "color": "#FFFFFF",
      "legend": {
        "enabled": true,
        "align": "center",
        "position": "absolute",
        "color": "#595959",
        "fontSize": 13,
        "top": 10,
        "markerLabelGap": 0,
        "markerType": "none",
        "switchable": false
      },
      "balloonFunction": DonutChartComponent.getGraphTooltip,
      "balloon": {
        "borderColor": "#000000",
        "borderThickness": 1,
        "color": "#FFFFFF",
        "fillColor": "#000000"
      },
      "colors": DonutChartComponent.getColorsArray(chartData),
      "dataProvider": chartData
    });

    chart.addListener("init", function(e) {
      e.chart.legend.balloon = {
        item: false,
        wrapper: null,
        container: null,
        mousemove: e.chart.handleMouseMove,
        titles: {}
      };

      // FORCE REVALIDATION TO APPLY GRAPH IDS
      setTimeout(function() {
        chart.validateData();
      }, 0);

      e.chart.legend.addListener("rollOverItem", function(e) {
        e.chart.legend.balloon.item = e.dataItem;
      });

      e.chart.legend.addListener("rollOutItem", function(e) {
        e.chart.legend.balloon.item = false;
      });

      // INVOKE HANDLE MOUSEMOVE
      e.chart.handleMouseMove = function(e) {
        if (e == null) {
          return;
        }

        let balloon = chart.legend.balloon;
        balloon.mousemove.apply(this, arguments);

        if (balloon.item) {
          chart.balloon.enabled = false;
          balloon.container.innerHTML = balloon.item.dataContext['legendTooltip'];
          balloon.wrapper.style.top = (e.clientY + 20) + "px";
          balloon.wrapper.style.left = (e.clientX) + "px";
          balloon.wrapper.className = "amcharts-legend-balloon active";
        } else {
          balloon.wrapper.className = "amcharts-legend-balloon";
          chart.balloon.enabled = true;
        }
      }
    });

    // CREATE, PLACE ELEMENTS
    chart.addListener("drawn", function(e) {
      e.chart.legend.balloon.wrapper = legendTooltipDiv.nativeElement;
      e.chart.legend.balloon.wrapper.className = "amcharts-legend-balloon";
      e.chart.legend.balloon.container = legendTooltipContainer.nativeElement;
      e.chart.legend.balloon.wrapper.appendChild(e.chart.legend.balloon.container);
      e.chart.legend.div.appendChild(e.chart.legend.balloon.wrapper);
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

}
