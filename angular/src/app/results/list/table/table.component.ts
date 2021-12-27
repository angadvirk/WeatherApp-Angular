import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  showTable: boolean = false;
  headers: string[] = ['#', 'date', 'status', 'tempHigh', 'tempLow', 'windSpeed'];
  rows: any = [];
  imageString: string = "";
  tomorrowObject: any = {};

  @Output() detailsRequested = new EventEmitter();

  constructor(private dataService: DataService, private router: Router) { }

  constructDate(dateInfo: any) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let yrMnthDay = dateInfo.split('T')[0].split('-');
    let date = new Date(yrMnthDay[0], yrMnthDay[1] - 1, yrMnthDay[2]);
    let dayOfWeek_index = date.getDay();
    let dayOfWeek = daysOfWeek[dayOfWeek_index];
    let month_index = date.getMonth();
    let month = months[month_index];
    return dayOfWeek + ", " + yrMnthDay[2].toString() + ' ' + month + ", " + yrMnthDay[0].toString();
  }
  constructStatus(weatherCode: number){
    const weatherCodes = {
        0: "Unknown",
        3000: "Light Wind",
        3001: "Wind",
        3002: "Strong Wind",
        4201: "Heavy Rain",
        4001: "Rain",
        4200: "Light Rain",
        6201: "Heavy Freezing Rain",
        6001: "Freezing Rain",
        6200: "Light Freezing Rain",
        6000: "Freezing Drizzle",
        4000: "Drizzle",
        7101: "Heavy Ice Pellets",
        7000: "Ice Pellets",
        7102: "Light Ice Pellets",
        5101: "Heavy Snow",
        5000: "Snow",
        5100: "Light Snow",
        5001: "Flurries",
        8000: "Thunderstorm",
        2100: "Light Fog",
        2000: "Fog",
        1001: "Cloudy",
        1102: "Mostly Cloudy",
        1101: "Partly Cloudy",
        1100: "Mostly Clear",
        1000: "Clear"
    };
    return Object(weatherCodes)[weatherCode];
  }
  showDetails(day: any) {
    let detailsObject = {};
    if (day) {
      for (let i = 0; i < 15; i++) {
        if (day === this.constructDate(this.tomorrowObject.data.timelines[1].intervals[i].startTime)) {
          detailsObject = {
            date: day,
            status: this.constructStatus(this.tomorrowObject.data.timelines[1].intervals[i].values.weatherCode),
            maxTemp: this.tomorrowObject.data.timelines[1].intervals[i].values.temperatureMax.toString() + ' °F',
            minTemp: this.tomorrowObject.data.timelines[1].intervals[i].values.temperatureMin.toString() + ' °F',
            appTemp: this.tomorrowObject.data.timelines[1].intervals[i].values.temperatureApparent.toString() + ' °F',
            sunrise: new Date(this.tomorrowObject.data.timelines[1].intervals[i].values.sunriseTime).toTimeString().split(' ')[0],
            sunset: new Date(this.tomorrowObject.data.timelines[1].intervals[i].values.sunsetTime).toTimeString().split(' ')[0],
            humidity: this.tomorrowObject.data.timelines[1].intervals[i].values.humidity.toString() + ' %',
            windSpeed: this.tomorrowObject.data.timelines[1].intervals[i].values.windSpeed.toString() + ' mph',
            visibility: this.tomorrowObject.data.timelines[1].intervals[i].values.visibility.toString() + ' mi',
            cloudCover: this.tomorrowObject.data.timelines[1].intervals[i].values.cloudCover.toString() + ' %',
          }
        }
      }
    }
    this.detailsRequested.emit(detailsObject);
  }
  ngOnInit(): void {
    this.dataService.tomorrowObject.subscribe(
      data => {
        if (Object.keys(data).length > 0) {
          this.tomorrowObject = data;
          this.showTable = true;
          // Populate table rows
          for (let i = 0; i < 15; i++) {
            let date_string = this.constructDate(data.data.timelines[1].intervals[i].startTime);
            let status_string = this.constructStatus(data.data.timelines[1].intervals[i].values.weatherCode);
            let status_img_string = this.constructStatus(data.data.timelines[1].intervals[i].values.weatherCode).toLowerCase().replace(/ /g, '_') + ".svg";
            let tempHigh_string = data.data.timelines[1].intervals[i].values.temperatureMax.toString();
            let tempLow_string = data.data.timelines[1].intervals[i].values.temperatureMin.toString();
            let windSpeed_string = data.data.timelines[1].intervals[i].values.windSpeed.toString();
            this.rows.push(
              {
                '#': (i + 1).toString(),
                'date': date_string,
                'status_img': status_img_string,
                'status': status_string,
                'tempHigh': tempHigh_string,
                'tempLow': tempLow_string,
                'windSpeed': windSpeed_string
              }
            );
          }
        }
      }
    );
  }
}
