import {
  Component, OnInit, Input, AfterViewInit, NgZone, OnDestroy
} from '@angular/core';

@Component({
  selector: 'base-chart',
  templateUrl: 'base-chart.component.html'
})
export class BaseChartComponent implements OnInit, AfterViewInit, OnDestroy {

  // This is the unique id of the chart.
  @Input() chartId: string;

  // This object could be used to use default options
  @Input() chartOptions: Object;

  // This is the reference to the chart object.
  private chart: any;
  private paramsOk:boolean;

  constructor(private _ngZone: NgZone) {  }

  ngOnInit(): void {
    this.paramsOk = this.chartId != null && this.chartOptions != null;
  }

  ngAfterViewInit(): void {
    if (!this.paramsOk) {
      console.log('[Chart error]: An unique chart [chartId] id and an options object [chartOptions] is needed to create the chart !!');
      return;
    }
    // Builds the chart outside the Angular's zone
    this.chart = this._ngZone.runOutsideAngular(() => {
      let _chart: any = (window as any).AmCharts.makeChart(this.chartId, this.chartOptions);
      this._ngZone.run(() => {
        return _chart;
      });
    });
  }

  ngOnDestroy(): void {
    let chart = this.chart;
    this._ngZone.runOutsideAngular(() => {
      chart.clear();
    });
  }
}
