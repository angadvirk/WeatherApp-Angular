import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit 
{
  favoritesList: any = [];
  favAddedSubbed: boolean = false;
  removeFavSubbed: boolean = false;

  constructor(private dataService: DataService, private router: Router) { }

  searchCity(event: any) {
    let city = event.target.innerHTML;
    let state = event.target.parentElement.parentElement.children[2].children[0].innerHTML;
    this.dataService.updateFreshSearch({ city: city, state: state });
    this.router.navigateByUrl("/results");
  }
  searchState(event: any) {
    let city = event.target.parentElement.parentElement.children[1].children[0].innerHTML;
    let state = event.target.innerHTML;
    this.dataService.updateFreshSearch({ city: city, state: state });
    this.router.navigateByUrl("/results");
  }
  removeFav(event: any) { // when 'trashcan' is clicked
    // Get city and state from the trashcan's table row
    let city = "";
    let state = "";
    if (event.target.tagName === "path") {
      city = event.target.parentElement.parentElement.parentElement.children[1].children[0].innerHTML;
      state = event.target.parentElement.parentElement.parentElement.children[2].children[0].innerHTML;
    }
    else {
      city = event.target.parentElement.parentElement.children[1].children[0].innerHTML;
      state = event.target.parentElement.parentElement.children[2].children[0].innerHTML;
    }
    // Remove it from favoritesList
    const removalIndex = this.favoritesList.findIndex((favorite: any) => favorite.city===city&&favorite.state===state);
    if (removalIndex !== -1) {
      this.favoritesList.splice(removalIndex, 1);
    }
    // Remove it from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      if (state === localStorage.getItem(city)) {
        localStorage.removeItem(city);
        break;
      }
    }
  }
  constructFavList() {
    // Loop through localStorage and add all items to favoritesList
    for (let i = 0; i < localStorage.length; i++) {
      let favData = { city: "", state: "" };
      favData.city = localStorage.key(i)!;
      favData.state = localStorage.getItem(favData.city)!;

      if (!this.favoritesList.includes(favData)) {
        this.favoritesList.push(favData);
      }
    }
  }
  ngOnInit(): void 
  {
    this.constructFavList();
  }
}
