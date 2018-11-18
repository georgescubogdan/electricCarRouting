import { Component, OnInit } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import { AmplifyService } from 'aws-amplify-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { route } from '../classes';

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
  options: FormGroup;
  firstCity: Location;
  secondCity: Location;
  home: boolean = true;

  events: string[] = [];
  opened: boolean = true;
  constructor(fb: FormBuilder, private amplifyService: AmplifyService, private loginService: LoginService, private router: Router ) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
  }

  ngOnInit() {

    this.zoom = 10;
    this.latitude = 52.520008;
    this.longitude = 13.404954;
    
    //this.setCurrentPosition();

  }

  routes : route[] = [
    {
      start: "Pitesti",
      end: "Bucuresti",
      path: ""
    },
    {
      start: "Pitesti",
      end: "Bucuresti",
      path: ""
    },
    {
      start: "Pitesti",
      end: "Bucuresti",
      path: ""
    }
]
  goHome() {
    this.home = true;
  }

  goHistory() {
    this.home = false;
  }

  onAddressSelected(result: PlaceResult) {
    console.log('onAddressSelected: ', result);
  }

  onLocationSelectedFirst(location: Location) {
    console.log('onLocationSelectedFirst: ', location);
    this.firstCity = location;
  }

  onLocationSelectedSecond(location: Location) {
    console.log('onLocationSelectedSecond: ', location);
    this.secondCity = location;
  }

  onLocationSelected(location: Location, x : boolean) {
    if(x == true)
      this.firstCity = location;
    else
    this.secondCity = location;
  }

  search() {
    console.log('first: ', this.firstCity.latitude, this.firstCity.longitude);
    console.log('second: ', this.secondCity.latitude, this.secondCity.longitude);
    console.log('hours: ', this.valueHours)
    console.log('hops: ', this.valueHops)
    console.log('maxdist: ', this.valueMaxdist)
    console.log('maxdet: ', this.valueMaxdet)
  }

  signOut(){
    this.amplifyService.auth().signOut();
    this.loginService.signedIn = false;
    this.loginService.user = null;
  }

  valueHours = '';
  valueHops = '';
  valueMaxdist = '';
  valueMaxdet = '';

  onKeyHours(data: string) { // without type info
    if(isNaN(Number(data))) {
      this.valueHours = "0";
    }
    else {
      this.valueHours = data;
    }
  }
  
  onKeyHops(data: string) { // without type info
    if(isNaN(Number(data))) {
      this.valueHops = "0";
    }
    else {
      this.valueHops = data;
    }
  }

  onKeyMaxdist(data: string) { // without type info
    if(isNaN(Number(data))) {
      this.valueMaxdist = "0";
    }
    else {
      this.valueMaxdist = data;
    }
  }

  onKeyMaxdet(data: string) {
    if(isNaN(Number(data))) {
      this.valueMaxdet = "0";
    }
    else {
      this.valueMaxdet = data;
    }
  }

  save() {
    
  }
}
