import {Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'donut-chart',
  templateUrl: 'donut-chart.component.html',
  styleUrls: ['donut-chart.component.css']
})
export class DonutChartComponent implements OnInit, AfterViewInit {

  @ViewChild('legendDiv') legendDiv:ElementRef;
  @ViewChild('legendContainer') legendContainer:ElementRef;

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
    let legendDiv:ElementRef = this.legendDiv;
    let legendContainer:ElementRef = this.legendContainer;
    let chartsEngine = (window as any).AmCharts;
    let chartData: Object[] = this.data;
    let graphs:Object[] = [];

    for (let d of chartData) {
      let graphObj = {
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "type": "column",
        "color": "#000000"
      };

      graphObj['title'] = d['legendTooltip'];
      graphObj['valueField'] = d['category'];
      graphs.push(graphObj);
    }

    console.log(graphs);

    let chart: any = chartsEngine.makeChart(this.options['id'], {
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
        "markerType": "none",
        "switchable": false
      },
      "graphs": graphs,
      "balloonFunction": DonutChartComponent.getGraphTooltip,
      "balloon": {
        "borderColor": "#000000",
        "borderThickness": 1,
        "color": "#FFFFFF",
        "fillColor": "#000000"
      },
      "colors": DonutChartComponent.getColorsArray(chartData),
      "titles": [],
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

      // PRETTIFY AND CACHE GRAPH TITLES
      for (let i1 = 0; i1 < e.chart.graphs.length; i1++) {
        let graph = e.chart.graphs[i1];
        let gid = graph.id || chartsEngine.getUniqueId();

        e.chart.legend.balloon.titles[gid] = graph.title;
        graph.id = gid;
      }

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
          balloon.container.style.borderColor = balloon.item.lineColorR;
          balloon.container.innerHTML = balloon.item.dataContext['legendTooltip'];
          balloon.wrapper.style.top = (e.clientY - balloon.container.offsetHeight - 6) + "px";
          balloon.wrapper.style.left = (e.clientX) + "px";
          balloon.wrapper.className = "amcharts-legend-balloon active";
        } else {
          balloon.wrapper.className = "amcharts-legend-balloon";
        }
      }
    });

    // CREATE, PLACE ELEMENTS
    chart.addListener("drawn", function(e) {
      e.chart.legend.balloon.wrapper = legendDiv.nativeElement;
      e.chart.legend.balloon.wrapper.className = "amcharts-legend-balloon";
      e.chart.legend.balloon.container = legendContainer.nativeElement;
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
