import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  animations: [
    trigger("noAnimParent", [
      transition(':enter', [])
    ]),
    trigger("slideInOutLeft", [
      transition("void => *", [
        style({transform: 'translateX(-100%)'}),
        animate('250ms')
      ]),
      transition('* => void', [
        animate('125ms', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger("slideInOutRight", [
      transition("void => *", [
        style({transform: 'translateX(100%)'}),
        animate('250ms')
      ]),
      transition('* => void', [
        animate('125ms', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class ResultsComponent implements OnInit {

  forecastLocation: string = "";
  showProgressBar: boolean = false;
  showResults: boolean = false;
  favAdded: boolean = false;
  activeView: string = 'list'; // activeView can be 'list' or 'details'
  showList: boolean = true;
  showDetails: boolean = false;
  detailsObject: any = {}; 
  showError: boolean = false;
  
  constructor(private dataService: DataService, private router: Router) { }

  updateView(viewName: string) {
    this.activeView = viewName;
    if (viewName === "list") {
      this.showDetails = false;
      setTimeout(() => this.showList = true, 100);
    }
    if (viewName === "details") {
      this.showList = false;
      setTimeout(() => this.showDetails = true, 100);
    }
    document.getElementById("mainNav")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
    // this.router.navigate([], { fragment: "test" });
  }
  parseDetails(event: any) {
    this.detailsObject = event;
    // this.detailsExist = true;
    this.updateView('details');
  }
  addFavorite() {
    localStorage.setItem(this.forecastLocation.split(', ')[0], this.forecastLocation.split(', ')[1]);
    this.favAdded = true;
  }
  removeFavorite() {
    // Remove it from localStorage
    let city = this.forecastLocation.split(", ")[0]
    let state = this.forecastLocation.split(", ")[1]
    for (let i = 0; i < localStorage.length; i++) {
      if (state === localStorage.getItem(city)) {
        localStorage.removeItem(city);
        break;
      }
    }
    this.favAdded = false;
  }
  detailsButtonHandler() {
    if (Object.keys(this.detailsObject).length > 0) { // check if it corresponds to the current search somehow??
      this.updateView('details');
    }
  }
  ngOnInit(): void {

    this.dataService.searching.subscribe(
      (data) => {
        if (data === true) {
          this.showError = false;
          this.showProgressBar = true;
          this.showResults = false;
        }
      }
    );
    this.dataService.tomorrowObject.subscribe(
      (data) => {
        if (Object.keys(data).length > 0) {
          if (this.showProgressBar) {
            this.showProgressBar = false;
          }
          // Error Checking
          if (data.code > 400000) {
            this.showError = true;
            return;
          }
          this.showResults = true;
          this.favAdded = false;
          this.dataService.searchData.subscribe(
            (data) => {
              if (Object.keys(data).length > 0) {
                this.forecastLocation = data.forecastLocation;
                for (let i = 0; i < localStorage.length; i++) {
                  if (this.forecastLocation.split(', ')[0] === localStorage.key(i) && 
                      this.forecastLocation.split(', ')[1] === localStorage.getItem(localStorage.key(i)!)) {
                    this.favAdded = true;
                  }
                }
              }
            }
          );
        }
        else {
          this.showResults = false;
          this.showError = false;
        }
      }
    );
  }
}