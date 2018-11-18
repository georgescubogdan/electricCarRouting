import { Component, OnInit } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import { AmplifyService } from 'aws-amplify-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { route } from '../classes';
import { ChattingService } from '../chatting.service';

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

  fromPlace: string;

  events: string[] = [];
  opened: boolean = true;
  constructor(fb: FormBuilder, private amplifyService: AmplifyService, private loginService: LoginService, private router: Router, private _chattingService: ChattingService ) {
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
    
    this._chattingService.finishedCommand.subscribe(cmd => {
      switch (cmd.intentName) {
        case 'maps.navigate_to':
          this.fromPlace = cmd.from + '\n';
          console.log(cmd.to);
          break;
      }
    });
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

  onAddressSelectedFirst(result: PlaceResult) {
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

  

  save() {
    
  }
}
