import { Component, OnInit } from '@angular/core';
import { 
  trigger,
  state,
  style,
  animate,
  transition 
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('resultsButtonState', [
      state('results', style({
        background: '#007bff',
        borderBottomLeftRadius: '0.25rem',
        borderBottomRightRadius: '0.25rem',
        borderTopLeftRadius: '0.25rem',
        borderTopRightRadius: '0.25rem'
      })),
      state('favorites', style({
        background: 'transparent'
      })),
      transition('results => favorites', animate('300ms ease-out')),
      transition('favorites => results', animate('300ms ease-in')),
    ]), 
    trigger('favoritesButtonState', [
      state('results', style({
        background: 'transparent'
      })),
      state('favorites', style({
        background: '#007bff',
        borderBottomLeftRadius: '0.25rem',
        borderBottomRightRadius: '0.25rem',
        borderTopLeftRadius: '0.25rem',
        borderTopRightRadius: '0.25rem'
      })),
      transition('results => favorites', animate('300ms ease-in')),
      transition('favorites => results', animate('300ms ease-out')),
    ])
  ]
})
export class AppComponent {
  title = 'angular-app';
  tomorrow_response: any;

  constructor() { }

  get stateName() {
    if (document.getElementById("resultsLink")?.classList.contains("activeState")) {
      return 'results';
    }
    else if (document.getElementById("favoritesLink")?.classList.contains("activeState")) {
      return 'favorites';
    }
    return "";
  }
}
