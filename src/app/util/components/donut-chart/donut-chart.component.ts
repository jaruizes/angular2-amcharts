import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'donut-chart',
  templateUrl: 'donut-chart.component.html'
})
export class DonutChartComponent implements OnInit {
  @Input() chartData: Object;
  private id: string;

  private options;

  constructor() {
    this.id = 'id';
  }

  ngOnInit() {
    this.options = {
      "type": "pie",
      "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
      "innerRadius": "30%",
      "labelText": "[[percents]]%",
      "labelRadius": -50,
      "addClassNames": true,
      "color": "#FFFFFF",
      "colors": [
        "#ffd600",
        "#13cec4",
        "#db9e01"
      ],
      "titleField": "category",
      "valueField": "column-1",
      "allLabels": [],
      "balloon": {
        "borderColor": "#000000",
        "borderThickness": 1,
        "color": "#FFFFFF",
        "fillColor": "#000000"
      },
      "legend": {
        "enabled": true,
        "align": "center",
        "markerType": "circle",
        "position": "top"
      },
      "titles": [],
      "dataProvider": [
        {
          "category": "category 1",
          "column-1": 8
        },
        {
          "category": "category 2",
          "column-1": 6
        },
        {
          "category": "category 3",
          "column-1": 2
        }
      ]
    };
  }

}
