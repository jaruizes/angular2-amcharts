import {Component, OnInit, Input, AfterViewInit, ViewChild} from '@angular/core';

@Component({
  selector: 'donut-chart',
  templateUrl: 'donut-chart.component.html'
})
export class DonutChartComponent implements OnInit {
  // TODO Maybe it's better just create an object with all the configuration
  @Input() chartData: Object;
  @Input() chartid: string;
  @Input() textField: string;
  @Input() valueField: string;

  @ViewChild('chart') chart;

  private options;

  constructor() {
    //this.chartObj = {};
  }

  ngOnInit() {
    // TODO: This would be "default options". It's better to slice in different attributes: colors, legend, label, ballons, ...
    // Legend data maybe has to be an input
    this.options = {
      "type": "pie",
      "balloonFunction": this._formatTooltipContent,
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
      "titleField": this.textField,
      "valueField": this.valueField,
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
        "color": "#595959",
        "fontSize": 13,
        "top": 10,
        "markerLabelGap": 0,
        "markerType": "none",
        "switchable": false
        /*"data": [
         {"title": "RENTA FIJA", "value": "60% |", "markerType": "none", "color":"#595959"},
         {"title": "RENTA VARIABLE", "value": "30% |", "markerType": "none", "color":"#595959"},
         {"title": "OTROS", "value": "10%", "markerType": "none", "color":"#595959"},
         ]*/
      },
      "titles": [],
      "dataProvider": this.chartData
    };
  }


  private _formatTooltipContent(graphDataItem: any) {
    // TODO set a better name for this field. For instantce: slice tooltip
    let funds: Object[] = graphDataItem.dataContext['composition'];
    let fundHTML: any = document.createElement('table');

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
