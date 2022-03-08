import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  // searching Observable -- boolean
  private srching = new BehaviorSubject<boolean>(false);
  searching = this.srching.asObservable();
  // searchData Observable -- coords, forecastLocation
  private srchData = new BehaviorSubject<any>({});
  searchData = this.srchData.asObservable();
  // tomorrowObject Observable -- tomorrow.io response object
  private tmrObj = new BehaviorSubject<any>({});
  tomorrowObject = this.tmrObj.asObservable();
  // freshSearch Observable
  private frSrch =  new BehaviorSubject<any>({});
  freshSearch = this.frSrch.asObservable();

  constructor() { }
  
  setSearching(data: boolean) {
    this.srching.next(data);
  }
  updateSearchData(data: any) {
    this.srchData.next(data);
  }
  updateTomorrowObject(data: any) {
    this.tmrObj.next(data);
  }
  updateFreshSearch(data: any) {
    this.frSrch.next(data);
  }
}