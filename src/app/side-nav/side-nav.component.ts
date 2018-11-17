import { Component, OnInit } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import { AmplifyService } from 'aws-amplify-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

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

  // private setCurrentPosition() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 12;
  //     });
  //   }
  // }

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

  search(){
    console.log('first: ', this.firstCity.latitude, this.firstCity.longitude);
    console.log('second: ', this.secondCity.latitude, this.secondCity.longitude);
  }

  signOut(){
    this.amplifyService.auth().signOut();
    this.loginService.signedIn = false;
    this.loginService.user = null;
  }

  goHistory() {
    this.router.navigate(['history']);
  }

  save() {
    
  }
}
