import {Component, OnInit, Input, AfterViewInit} from '@angular/core';

@Component({
  selector: 'chart',
  templateUrl: 'chart.component.html'
})
export class ChartComponent implements OnInit, AfterViewInit {

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
    console.log('Chart constructor.....');
  }

  ngOnInit() {
    console.log('Chart initializing.....');
    console.log(this.data);
    console.log(this.options);
  }

  ngAfterViewInit(): void {
    let chartsEngine = (window as any).AmCharts;
    let chartData:Object[] = this.data;
    let chart:any = chartsEngine.makeChart(this.options['id'], {
      "type": "pie",
      "titleField": "label",
      "valueField": "value",
      "labelText": "[[percents]]%",
      "allLabels": [],
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
        "markerType": "none"
      },
      "balloonFunction": ChartComponent.getGraphTooltip,
      "balloon": {
        "borderColor": "#000000",
        "borderThickness": 1,
        "color": "#FFFFFF",
        "fillColor": "#000000"
      },
      "colors": ChartComponent.getColorsArray(chartData),
      "titles": [],
      "dataProvider": chartData
    });

    chart.addListener("init", function(e) {
      console.log(e);
      // EASY ACCESS FOR MOUSEMOVE
      e.chart.legend.balloon = {
        item: false,
        wrapper: null,
        container: null,
        mousemove: e.chart.handleMouseMove,
        titles: {}
      };

      for (let d of chartData) {
        let gid = chartsEngine.getUniqueId();
        e.chart.legend.balloon.titles[gid] = d['legendTooltip'];
      }

      console.log(e.chart.legend.balloon);

      // FORCE REVALIDATION TO APPLY GRAPH IDS
      setTimeout(function() {
        e.chart.validateNow();
      }, 0);

      e.chart.legend.addListener("rollOverItem", function(e) {
        e.chart.legend.balloon.item = e.dataItem;
        var balloon = e.chart.legend.balloon;
        balloon.container.style.borderColor = balloon.item.lineColorR;
        balloon.container.innerHTML = e.dataItem.dataContext['legendTooltip'];
        balloon.wrapper.style.top = (e.clientY - balloon.container.offsetHeight - 6) + "px";
        balloon.wrapper.style.left = (e.clientX) + "px";
        balloon.wrapper.className = "amcharts-legend-balloon active";
      });

      e.chart.legend.addListener("rollOutItem", function(e) {
        e.chart.legend.balloon.item = false;
        console.log('rollOutItem');
      });

      // INVOKE HANDLE MOUSEMOVE

    });

    // CREATE, PLACE ELEMENTS
    chart.addListener("drawn", function(e) {
      e.chart.legend.balloon.wrapper = document.createElement("div");
      e.chart.legend.balloon.wrapper.className = "amcharts-legend-balloon";
      e.chart.legend.balloon.container = document.createElement("div");
      e.chart.legend.balloon.wrapper.appendChild(e.chart.legend.balloon.container);
      e.chart.legend.div.appendChild(e.chart.legend.balloon.wrapper);
    });
  }

  static getGraphTooltip(graphDataItem: any) {
    return graphDataItem.dataContext['graphTooltip'];
  }

  static getColorsArray(data) {
    let colors:string[] = [];
    for (let d of data) {
      colors.push(d['color']);
    }

    return colors;
  }
}
