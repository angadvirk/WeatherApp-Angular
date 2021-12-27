import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [
    trigger("fadeInOut", [
      transition("void => *", [
        style({opacity: 0}),
        animate('250ms', style({opacity: 1}))
      ]),
      transition('* => void', [
        animate('250ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class ListComponent implements OnInit {
  activeView: string = "table"; // activeView can be 'table', 'chart' or 'meteogram'
  @Output() detailsRequested = new EventEmitter();

  constructor() { }

  updateView(viewName: string) {
    this.activeView = viewName;
  }

  showDetails(event: any) {
    this.detailsRequested.emit(event);
  }

  ngOnInit(): void {
  }
}
