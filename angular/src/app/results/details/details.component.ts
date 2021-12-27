import { Component, OnInit, Input } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() detailsObject: any;
  mapLocation: any = {};

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.searchData.subscribe(
      data => {
        this.mapLocation.lat = parseFloat(data.lat);
        this.mapLocation.lng = parseFloat(data.lng);
      }
    );
    let mapLoader = new Loader({
      apiKey: 'AIzaSyDe-gIMRLcnp3uVz9l4ZOrCoy9zwXLRohI'
    });
    mapLoader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: this.mapLocation,
        zoom: 16
      });
      // The marker, positioned at Uluru
      const marker = new google.maps.Marker({
        position: this.mapLocation,
        map: map,
      });
    })
  }
}