import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'donut-chart',
  templateUrl: 'donut-chart.component.html'
})
export class DonutChartComponent implements OnInit {
  @Input() chartData: Object;
  @Input() chartid: string;

  private options;

  constructor() {

  }

  ngOnInit() {
    // TODO: This would be "default options". It's better to slice in different attributes: colors, legend, label, ballons, ...
    this.options = {
      "type": "pie",
      "balloonFunction": this._formatContent,
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
      "valueField": "total",
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
        "position": "absolute",
        "color":"#595959",
        "fontSize": 13,
        "top": 10,
        "markerLabelGap": 0,
        "data": [
          {"title": "RENTA FIJA", "value": "60% |", "markerType": "none", "color":"#595959"},
          {"title": "RENTA VARIABLE", "value": "30% |", "markerType": "none", "color":"#595959"},
          {"title": "OTROS", "value": "10%", "markerType": "none", "color":"#595959"},
        ]
      },
      "titles": [],
      "dataProvider": this.chartData
    };
  }

  private _formatContent(graphDataItem:any) {
    let funds:Object[] = graphDataItem.dataContext['composition'];
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

}
