import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // api urls (for direct calls)
  ipinfo_url: string = "https://ipinfo.io/json?token=1d7082a2c0d29f";
  // api urls (for calls through backend proxy)
  tomorrow_url: string = "https://cs571-hw-project.wl.r.appspot.com/weather";
  geocoding_url: string = "https://cs571-hw-project.wl.r.appspot.com/geocoding"; 
  autocomplete_url: string = "https://cs571-hw-project.wl.r.appspot.com/autocomplete";
  // form
  form = new FormGroup({
    streetInput: new FormControl('', Validators.required),
    cityInput: new FormControl('', Validators.required),
    stateSelect: new FormControl('', Validators.required),
    autodetectCheckbox: new FormControl('', Validators.required)
  })
  // variables
  options: string[] = [];
  filteredOptions!: string[];
  autocomplete_response: { city: string, state: string }[] = [];
  autodetect_checked: boolean = false;
  states: any = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
  }

  constructor(private dataService: DataService, private httpService: HttpService, private router: Router) { }

  ngOnInit(): void {
    // Fetching place as user types
    this.form.get('cityInput')?.valueChanges
      .pipe(
        debounceTime(500),
        startWith(''),
      ).subscribe(inputVal => {
        if (inputVal && inputVal.length && inputVal.replace(/\s/g, '').length) {
          this.httpService.fetchData(this.autocomplete_url + '?input=' + inputVal).subscribe(
            (data: any) => {
              if (data.status === "OK") {
                for (var i = 0; i < data.predictions.length; i++) {
                  this.autocomplete_response.push({ city: data.predictions[i].terms[0].value, state: data.predictions[i].terms[1].value });
                }
                this.options = data.predictions.map((prediction: { terms: any; }) => prediction.terms[0].value)
                this.filteredOptions = this._filter(inputVal);
              }
            }
          )
        } else {
          this.filteredOptions = [];
        }
      });
    // Instant filtering as user types
    this.form.get('cityInput')?.valueChanges.subscribe(
      inputVal => {
        this.filteredOptions = this._filter(inputVal)
      }
    );
    this.dataService.freshSearch.subscribe(
      data => {
        if (Object.keys(data).length > 0) {
          let stateAbbrev = Object.keys(this.states).find((key: string) => this.states[key] === data.state)
          this.onAutoDetectClick({target: {checked: false}}); // simulate autoDetect being unchecked
          this.form.get("cityInput")?.setValue(data.city);
          this.form.get("stateSelect")?.setValue(stateAbbrev?.toString());
          this.dataService.updateFreshSearch({});
          this.onSubmit(this.form.value);
        }  
      }
    );
  }
  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    var stateResult: string = "";
    for (var i = 0; i < this.autocomplete_response.length; i++) {
      if (this.autocomplete_response[i].city === event.option.value) {
        stateResult = this.autocomplete_response[i].state; 
        break;
      }
    }
    this.form.get('stateSelect')?.setValue(stateResult);
  }
  onAutoDetectClick(event: any) {
    if (event.target.checked) {
      // Clear & disable form fields
      this.form.get('streetInput')?.setValue("");
      this.form.get('cityInput')?.setValue("");
      this.form.get('stateSelect')?.setValue("");
      this.form.get('streetInput')?.disable();
      this.form.get('cityInput')?.disable();
      this.form.get('stateSelect')?.disable();
      this.autodetect_checked = true;
      // ipinfo gets called when search button is clicked
    }
    else {
      this.form.get('streetInput')?.setValue("");
      this.form.get('cityInput')?.setValue("");
      this.form.get('stateSelect')?.setValue("");
      this.form.get('streetInput')?.enable();
      this.form.get('cityInput')?.enable();
      this.form.get('stateSelect')?.enable();
      this.form.get('streetInput')?.markAsUntouched();
      this.form.get('cityInput')?.markAsUntouched();
      this.form.get('stateSelect')?.markAsUntouched();
      this.autodetect_checked = false;
      this.form.get('autodetectCheckbox')?.setValue(false);
      this.form.get('autodetectCheckbox')?.markAsUntouched();
    }
  }
  resetForm() {
    this.form.get('streetInput')?.setValue("");
    this.form.get('cityInput')?.setValue("");
    this.form.get('stateSelect')?.setValue("");
    this.form.get('streetInput')?.enable();
    this.form.get('cityInput')?.enable();
    this.form.get('stateSelect')?.enable();
    this.form.get('streetInput')?.markAsUntouched();
    this.form.get('cityInput')?.markAsUntouched();
    this.form.get('stateSelect')?.markAsUntouched();
    this.autodetect_checked = false;
    this.form.get('autodetectCheckbox')?.setValue(false);
    this.form.get('autodetectCheckbox')?.markAsUntouched();
    this.clearFunction();
  }
  onSubmit(event: any) {
    this.clearFunction(); // clean things up before a new search...
    this.dataService.setSearching(true); // to display progress bar
    var api_url = '';
    if (this.autodetect_checked) {
      // select ipinfo_api
      api_url = this.ipinfo_url;
    }
    else {
      // select geocoding_api
      var street = this.form.get("streetInput")?.value.trim().replace(/,/g, '').replace(/\s+/g, '%20');
      var city = this.form.get("cityInput")?.value.trim().replace(/,/g, '').replace(/\s+/g, '%20');
      var state = this.form.get("stateSelect")?.value;
      if (!state) { state = "CA" }
      api_url = this.geocoding_url + "?address=" + street + city + state;
    }
    // call ipinfo/geocoding and then tomorrow.io api
    this.httpService.fetchData(api_url).subscribe(
      (data: any) => {
        // console.log(api_url);
        // console.log(data);
        var lat = '';
        var lng = '';
        if (api_url === this.ipinfo_url) {
          // use ipinfo
          lat = data.loc.split(',')[0];
          lng = data.loc.split(',')[1];
          // update searchData observable in dataService
          this.dataService.updateSearchData({
            lat: lat,
            lng: lng,
            forecastLocation: data.city + ", " + data.region
          });
        }
        else {
          // use geocoding
          if (data.status === "OK") {
            lat = String(data.results[0].geometry.location.lat);
            lng = String(data.results[0].geometry.location.lng);
            let forecastCity = this.form.get("cityInput")?.value.toString();
            let forecastState = this.states[this.form.get("stateSelect")?.value.toString()] // get state name from abbreviation
            if (!forecastState) { 
              forecastState = "California" 
            }
            // update searchData observable in dataService
            this.dataService.updateSearchData({
              lat: lat,
              lng: lng,
              forecastLocation: forecastCity + ", " + forecastState
            });
          }
          // else { 
          //   console.log("Geocoding API Error has occurred.");
          //   console.log(data);
          // }
        }
        //  call tomorrow.io
        this.httpService.fetchData(this.tomorrow_url + '?' + 'lat=' + lat + '&' + 'lng=' + lng).subscribe(
          tomorrow_response => {
            // do error-checking of tomorrow_response... if it's wrong, show error message and don't do anything else. 
            this.dataService.updateTomorrowObject(tomorrow_response);
          }
        );
      }
    );
  }
  clearFunction() {
    this.dataService.setSearching(false);
    this.dataService.updateSearchData({});
    this.dataService.updateTomorrowObject({}); // clear tomorrowObject 
    if (this.router.url !== "/results") {
      this.router.navigateByUrl("/results"); // change route to results 
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().trim();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
