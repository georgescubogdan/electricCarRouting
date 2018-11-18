import { Component, OnInit } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import { AmplifyService } from 'aws-amplify-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { route } from '../classes';
import { ChattingService } from '../chatting.service';
import { RestService } from '../http.service';
import { HttpClient } from '@angular/common/http';

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
  toPlace: string;
  routes : route[];
  events: string[] = [];
  opened: boolean = true;
  first: String;
  second: String;
  constructor(fb: FormBuilder, private amplifyService: AmplifyService, private loginService: LoginService, private router: Router, private rest: RestService, private _chattingService: ChattingService, private http : HttpClient ) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
  }

  ngOnInit() {
    this._chattingService.talkLoud('Bună bogdan');
    this.rest.get('bogdan').subscribe(e => {
      this.routes = this.rest.getRoutesFromString(e['routes']);
      console.log(this.routes);
    });

    this.zoom = 10;
    this.latitude = 52.520008;
    this.longitude = 13.404954;
    
    this._chattingService.finishedCommand.subscribe(cmd => {
      switch (cmd.intentName) {
        case 'maps.navigate_to':
          let from = cmd.from.split(' ').join('+');
          this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + from + '&key=AIzaSyAyfjHiYM9wOoWxCHaTVv5nabpxoAqaLhM').subscribe(
            e => {
              console.log(e['results'][0]['formatted_address']);
              this.fromPlace = e['results'][0]['formatted_address'];
              this.first = this.fromPlace;
              this.firstCity = e['results'][0]['geometry']['location'];
            });
            let to = cmd.to.split(' ').join('+');
          this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + to + '&key=AIzaSyAyfjHiYM9wOoWxCHaTVv5nabpxoAqaLhM').subscribe(
            e => {
              console.log(e['results'][0]['formatted_address']);
              this.toPlace = e['results'][0]['formatted_address'];
              this.second = this.toPlace;
              this.secondCity = e['results'][0]['geometry']['location'];
            });
          //this.fromPlace = cmd.from + '\n';
          // console.log(cmd.to);
          break;
        case 'logout':
          this.signOut();
          break;
        case 'salvare':
          this.save();
          break;
        case 'acasa':
          this.goHome();
          break;
        case 'istoric':
          this.goHistory();
          break;
          // case "maps.hotels_nearby":
          // if(cmd.params['raza'] === '') {
          //   cmd.params['raza'] = 1000;
          // } else {
          //   cmd.params['raza'] = cmd.params['raza'] * 1000;
          // }
          // console.log(cmd.params['raza']);
          // this.getPlaces(cmd.params['raza'], "lodging");
          // this._chattingService.talkLoud(`Se încarcă hotelurile pe o rază de ${cmd.params['raza']} de metri.`);
          // break;
      }
    });
    //this.setCurrentPosition();

  }

  // markers: marker[] = [];
  // places: Array<any> = [];
  
  // getPlacesX(lat, lng, radius, type){
  //   return this._http.get(this.baseUrl + 'GetNearbyPlaces/' + lat + "/" + lng + "/" + radius + "/" + type)
  //   .map((response: Response) =>response.json())
  //   .catch(this._errorHandler);
  // }

  // getPlaces(radius, type) {
  //   this.markers = [];
  //   this.getPlacesX(this.latitude, this.longitude, radius, type).subscribe(
  //     data => { 
  //       this.places = data;
  //       this.places.forEach(elem => {
  //         console.log(elem);
  //         this.markers.push({
  //           lat: elem.lat,
  //           lng: elem.lng
  //         });
  //       });
  //     },
  //     error => { debugger;
  //      console.log(error);
  //     }
      
  //   )
  // }

  goHome() {
    this.home = true;
  }

  goHistory() {
    this.home = false;
  }

  onAddressSelected(result: PlaceResult, x: boolean) {
    if(x == true) {
      this.first = result.formatted_address;
      console.log(result.formatted_address);
    }
    else {
      this.second = result.formatted_address;
    }
  }

  onLocationSelected(location: Location, x : boolean) {
    if(x == true) {
      this.firstCity = location;
    }
    else {
      this.secondCity = location;
    }
  }

  search() {
    if (this.first == undefined || this.second == undefined) {
      this._chattingService.talkLoud('Adrese introduse incorect! Ai grijă ce faci');
      return;
    }
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
    this.router.navigate(["login"]);
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
    console.log('intra');

    if (this.first == undefined || this.second == undefined) {
      console.log('iese');
      return;
    }

    console.log(this.first);
    let route: route = {
      start : this.first,
      end : this.second,
      path : "",
    }
    this.routes.push(route);
    let stringifiedRoutes = this.rest.getStringFromRoutes(this.routes);
    // this.loginService.userObservable.subscribe(e => {
    //   console.log(e);
    // });
    console.log(stringifiedRoutes);
    this.rest.put({"routes":stringifiedRoutes}, 'bogdan');
  }
}

interface marker {
	lat: any;
	lng: any;
	label?: string;
}
