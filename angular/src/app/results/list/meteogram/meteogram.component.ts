import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
import windbarb from 'highcharts/modules/windbarb';
// import exporting from 'highcharts/modules/exporting';
// import offline-exporting from 'highcharts/modules/offline-exporting';
more(Highcharts);
windbarb(Highcharts);

@Component({
  selector: 'app-meteogram',
  templateUrl: './meteogram.component.html',
  styleUrls: ['./meteogram.component.css']
})
export class MeteogramComponent implements OnInit {
  showMeteogram: boolean = false;
  // Highcharts variables
  isHighcharts: boolean = (typeof Highcharts === 'object');
  Highcharts: typeof Highcharts = Highcharts;
  // Meteogram Data Variables
  hourlyHourData: any = []; 
  hourlyTempData: any = []; 
  hourlyHumidityData: any = []; 
  hourlyPressureData: any = []; 
  hourlyWindData: any = []; 

  // chartConstructor: string = 'chart';
  meteogramOptions: Highcharts.Options = {};
  chartCallback: Highcharts.ChartCallbackFunction = function(arg) {};
  // updateFlag: boolean = false;
  // oneToOneFlag: boolean = true;
  // runOutsideAngular: boolean = false;

  constructor(private dataService: DataService) { }

  smoothLine(data: any) {
    var i = data.length,
        sum,
        value;
    while (i--) {
        data[i].value = value = data[i].y; // preserve value for tooltip
        // Set the smoothed value to the average of the closest points, but don't allow
        // it to differ more than 0.5 degrees from the given value
        sum = (data[i - 1] || data[i]).y + value + (data[i + 1] || data[i]).y;
        data[i].y = Math.max(value - 0.5, Math.min(sum / 3, value + 0.5));
    }
  }

  drawBlocksForWindArrows(chart: any) {
    var xAxis = chart.xAxis[0],
        x,
        pos,
        max,
        isLong,
        isLast,
        i;

    for (pos = xAxis.min, max = xAxis.max, i = 0; pos <= max + 36e5; pos += 36e5, i += 1) {
        // Get the X position
        isLast = pos === max + 36e5;
        x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

        // Draw the vertical dividers and ticks
        isLong = true;
        // if (this.resolution > 36e5) {
        //     isLong = pos % this.resolution === 0;
        // } else {
        //     isLong = i % 2 === 0;
        // }
        chart.renderer.path(['M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
            'L', x, chart.plotTop + chart.plotHeight + 32, 'Z'])
            .attr({
                stroke: chart.options.chart.plotBorderColor,
                'stroke-width': 1
            })
            .add();
    }
    // Center items in block
    chart.get('windbarbs').markerGroup.attr({
        translateX: chart.get('windbarbs').markerGroup.translateX + 3
    });
  }

  onChartLoad(chart: any) {
    // this.drawBlocksForWindArrows(chart);
  }

  getMeteogramOptions() {
    var meteogram = this;

    meteogram.meteogramOptions =  {
        chart: {
            // renderTo: this.container,
            marginBottom: 70,
            marginRight: 40,
            marginTop: 50,
            plotBorderWidth: 1,
            height: 400,
            alignTicks: false,
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
            text: "Hourly Weather (Fot Next 5 Days)",
        },

        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat:
                '<small>{point.x:%A, %b %e, %H:%M}</small><br>' +
                '<b>{point.point.symbolName}</b><br>'

        },

        xAxis: [{ // Bottom X axis
            type: 'datetime',
            tickInterval: 4 * 36e5, // two hours
            minorTickInterval: 36e5, // one hour
            tickLength: 0,
            gridLineWidth: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: 30,
            showLastLabel: true,
            labels: {
                format: '{value:%H}'
            },
            crosshair: true
        }, { // Top X axis
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                align: 'left',
                x: 3,
                y: -5
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1
        }],

        yAxis: [{ // temperature axis
            title: {
                text: null
            },
            labels: {
                format: '{value}°',
                style: {
                    fontSize: '10px'
                },
                x: -3
            },
            plotLines: [{ // zero plane
                value: 0,
                color: '#BBBBBB',
                width: 1,
                zIndex: 2
            }],
            maxPadding: 0.3,
            minRange: 8,
            tickInterval: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)'

        }, { // humidity axis
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 0,
            tickLength: 0,
            minRange: 10,
            min: 0

        }, { // Air pressure
            allowDecimals: false,
            title: { // Title on top of axis
                text: 'inHg',
                offset: 0,
                align: 'high',
                rotation: 0,
                style: {
                    fontSize: '10px',
                    color: "rgba(250, 149, 18, 1)"
                },
                textAlign: 'left',
                x: 3
            },
            // tickInterval: 1,
            labels: {
                style: {
                    fontSize: '8px',
                    color: "rgba(250, 149, 18, 1)"
                },
                y: 2,
                x: 3
            },
            // tickPositions: [0, 29, 60],
            gridLineWidth: 0,
            opposite: true,
            showLastLabel: false
        }],

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                // pointStart: this.hourlyHourData[0], // start at the appropriate hour
                pointPlacement: 'between'
            }
        },
        series: [{
            name: 'Temperature',
            data: this.hourlyTempData,
            type: 'spline',
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                valueSuffix: "°F",
                
            },
            clip: false,
            zIndex: 1,
            // tickInterval: 6,
            color: '#FF3333',
            negativeColor: '#48AFE8'
        }, {
            name: 'Humidity',
            data: this.hourlyHumidityData,
            // data: this.precipitations,
            type: 'column',
            color: '#76C2FE',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            grouping: false,
            dataLabels: {
              enabled: true,
              formatter: function () {
                  if (this.y! > 0) {
                      return Math.round(this.y!); // no decimals
                  }
                  return 0;
              },
              style: {
                  fontSize: '8px',
                  color: 'gray'
              }
            },
            tooltip: {
                valueSuffix: ' %'
            }
        }, {
            name: 'Air pressure',
            type: 'spline',
            color: "rgba(250, 149, 18, 1)",
            data: this.hourlyPressureData,
            dashStyle: "ShortDot",
            marker: {
                enabled: false
            },
            shadow: false,
            tooltip: {
                valueSuffix: ' inHg'
            },
            yAxis: 2
        }, {
            name: 'Wind',
            type: 'windbarb',
            id: 'windbarbs',
            color: 'red',
            lineWidth: 1.5,
            data: this.hourlyWindData,
            vectorLength: 9,
            yOffset: -15,
            tooltip: {
                valueSuffix: ' mph'
            }
        }]
    };
  }

  createChart() {
    var meteogram = this;
    this.getMeteogramOptions();
    // Draw wind arrows
    this.chartCallback = function (chart: any) {
      meteogram.onChartLoad(chart);
    };
  }

  parseYrData() {
    // Smooth the line
    this.smoothLine(this.hourlyTempData);
    // Create the chart when the data is loaded
    this.createChart();
  }

  ngOnInit(): void {
    this.dataService.tomorrowObject.subscribe(
      data => {
        if (Object.keys(data).length > 0) {
          // Update Meteogram Options Data
          let hourlyHourData = [];
          let hourlyTempData = [];
          let hourlyHumidityData = [];
          let hourlyPressureData = [];
          let hourlyWindData = [];
          for (let i = 0; i < data.data.timelines[0].intervals.length; i++) {
            hourlyHourData.push(new Date(data.data.timelines[0].intervals[i].startTime).getTime());
            hourlyTempData.push([hourlyHourData[i], data.data.timelines[0].intervals[i].values.temperature]);
            hourlyHumidityData.push([hourlyHourData[i], data.data.timelines[0].intervals[i].values.humidity]);
            hourlyPressureData.push([hourlyHourData[i], data.data.timelines[0].intervals[i].values.pressureSeaLevel]);
            if (i % 2 === 0) { // get wind data for every even-numbered hour
                hourlyWindData.push([hourlyHourData[i], data.data.timelines[0].intervals[i].values.windSpeed,
                                                        data.data.timelines[0].intervals[i].values.windDirection]);
            }
          }
          let meteoData: any = [hourlyHourData, hourlyTempData, hourlyHumidityData, hourlyPressureData, hourlyWindData];
          this.hourlyHourData = hourlyHourData;
          this.hourlyTempData = hourlyTempData;
          this.hourlyHumidityData = hourlyHumidityData;
          this.hourlyPressureData = hourlyPressureData;
          this.hourlyWindData = hourlyWindData;
          this.parseYrData();
          // Show Meteogram
          this.showMeteogram = true;
        }
      }

    );
  }

}
