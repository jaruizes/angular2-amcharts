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

  private formatContent(graphDataItem:any) {
    let funds:Object[] = graphDataItem.dataContext['column-2'];
    let fundHTML:any = document.createElement('table');

    for (let fund of funds) {
      let fundTR = document.createElement('tr');
      let fundNameTD = document.createElement('td');
      fundNameTD.setAttribute('align', 'left');
      let fundValueTD = document.createElement('td');
      fundValueTD.setAttribute('align', 'right');

      fundNameTD.innerHTML = fund['name'];
      fundValueTD.innerHTML = fund['value'];
      fundTR.appendChild(fundNameTD);
      fundTR.appendChild(fundValueTD);
      fundHTML.appendChild(fundTR);
    }
    return fundHTML.outerHTML;
  }

  ngOnInit() {
    this.options = {
      "type": "pie",
      "balloonText": "[[column-2]]",
      "balloonFunction": this.formatContent,
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
          "column-1": 8,
          "column-2": [
            { "name": "RENTA FIJA MONETARIOS", "value": "10%" },
            { "name": "RENTA FIJA CORTO PLAZO", "value": "10%" },
            { "name": "RENTA FIJA LARGO PLAZO", "value": "30%" },
            { "name": "RENTA FIJA FLEXIBLE", "value": "10%" },
          ]
        },
        {
          "category": "category 2",
          "column-1": 6,
          "column-2": [
            { "name": "RENTA FIJA MONETARIOS", "value": "30%" },
            { "name": "RENTA FIJA CORTO PLAZO", "value": "10%" },
            { "name": "RENTA FIJA LARGO PLAZO", "value": "30%" },
            { "name": "RENTA FIJA FLEXIBLE", "value": "10%" },
          ]
        },
        {
          "category": "category 3",
          "column-1": 2,
          "column-2": [
            { "name": "RENTA FIJA MONETARIOS", "value": "40%" },
            { "name": "RENTA FIJA CORTO PLAZO", "value": "10%" },
            { "name": "RENTA FIJA LARGO PLAZO", "value": "30%" },
            { "name": "RENTA FIJA FLEXIBLE", "value": "10%" },
          ]
        }
      ]
    };
  }

}
