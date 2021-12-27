import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
more(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  showChart: boolean = false;
  // Highcharts variables
  isHighcharts: boolean = (typeof Highcharts === 'object');
  Highcharts: typeof Highcharts = Highcharts;
  // Chart Data
  chartOptions: Highcharts.Options = {};

  constructor(private dataService: DataService) { }

  updateChartOptions(chartData: any): void {
    this.chartOptions = {
      chart: {
          type: 'arearange',
          scrollablePlotArea: {
            minWidth: 600
        }
      },
      exporting: {
          chartOptions: { // specific options for the exported image
              plotOptions: {
                  series: {
                      dataLabels: {
                          enabled: true
                      }
                  }
              }
          },
          fallbackToExportServer: false
      },
      title: {
          text: 'Temperature Ranges (Min, Max)'
      },
      xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
              day: '%e %b' // eg: 1 Jan
          },
          tickInterval: (24 * 3600 * 1000),
          crosshair: true
      },
      yAxis: {
          tickInterval: 5,
          title: {
              text: null
          }
      },
      tooltip: {
          shared: true,
          valueSuffix: '°F',
          xDateFormat: '%A, %b %e'
      },
      legend: {
          enabled: false
      },
      series: [{
          type: 'arearange',
          lineColor: "rgba(250, 149, 18, 1)",
          name: 'Temperatures',
          data: chartData,
          fillColor: {
              linearGradient: { 
                  x1: 0,
                  x2: 0,
                  y1: 0,
                  y2: 1
              },
              stops: [[0, "rgba(252, 180, 22, 1)"], [1, "rgba(106, 164, 231, 0.4)"]]
          }
      }]
    }
  }
  ngOnInit(): void {
    this.dataService.tomorrowObject.subscribe(
      data => {
        if (Object.keys(data).length > 0) {
          // Update Chart Options Data
          let chartData: any = [];
          for (let i = 0; i < data.data.timelines[1].intervals.length; i++) {
            chartData.push([new Date(data.data.timelines[1].intervals[i].startTime).getTime(),
            data.data.timelines[1].intervals[i].values.temperatureMin,
            data.data.timelines[1].intervals[i].values.temperatureMax]);
          }
          this.updateChartOptions(chartData);
          // Show Chart
          this.showChart = true;
        }
      }
    );
  }
}
