import { Component, OnInit } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public selectedAddress: PlaceResult;

  constructor() {
  }

  ngOnInit() {

    this.zoom = 10;
    this.latitude = 52.520008;
    this.longitude = 13.404954;

    this.setCurrentPosition();

  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  onAddressSelected(result: PlaceResult) {
    console.log('onAddressSelected: ', result);
  }

  onLocationSelected(location: Location) {
    console.log('onLocationSelected: ', location);
    this.latitude = location.latitude;
    this.longitude = location.longitude;
  }
}