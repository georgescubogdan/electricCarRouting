import { Component, OnInit, AfterViewInit } from '@angular/core';
import PlaceResult = google.maps.places.PlaceResult;
import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import { AmplifyService } from 'aws-amplify-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { route } from '../classes';
import { ChattingService } from '../chatting.service';
import { RestService } from '../http.service';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { MapService } from '../map.service';
import { HttpClient } from '@angular/common/http';
import { Map } from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit, AfterViewInit {
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

  routes : route[];
  events: string[] = [];
  opened: boolean = true;
  first: String;
  second: String;
  constructor(fb: FormBuilder, private amplifyService: AmplifyService, private loginService: LoginService, private router: Router, private rest: RestService, private _chattingService: ChattingService, private mapService: MapService, private http: HttpClient ) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
  }


  truckLocation = new mapboxgl.LngLat(26.052601, 44.440989);
  nothing = turf.featureCollection([]);
  
  
  warehouseLocation = [26.047156, 44.445303];
  warehouse = turf.featureCollection([turf.point(this.warehouseLocation)]);
  currentRoute = null;
  speedFactor = 50;
  
  dropoffs = turf.featureCollection([]);
  chargers = turf.featureCollection([]);
  usedChargers = turf.featureCollection([]);
  detour = turf.featureCollection([]);

  ngOnInit() {
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
          this.fromPlace = cmd.from + '\n';
          console.log(cmd.to);
          break;
      }
    });
    //this.setCurrentPosition();

  }

ngAfterViewInit() {
  let map: Map = new Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/traffic-night-v2',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [26.052601, 44.440989],
    zoom: 10
  });
  
  this.mapService.map = map;
  
  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  }));
  map.on('load', () => {
    var marker = document.createElement('div');
    marker.classList.add('truck');
    // Create a new marker
    let truckMarker = new mapboxgl.Marker(marker)
    .setLngLat(this.truckLocation)
    .addTo(map);
    
    map.addSource('route', {
      type: 'geojson',
      data: this.nothing
    });

    map.addSource('route2', {
      type: 'geojson',
      data: this.nothing
    });
    
    map.addLayer({
      id: 'routeline-active',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': {
          base: 1,
          stops: [[12, 3], [22, 12]]
        }
      }
    }, 'waterway-label');

    map.addLayer({
      id: 'routeline-active2',
      type: 'line',
      source: 'route2',        
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': {
          base: 1,
          stops: [[12, 3], [22, 12]]
        }
      }
    }, 'waterway-label');
    
    // Create a circle layer
    // map.addLayer({
    //   id: 'warehouse',
    //   type: 'circle',
    //   source: {
    //     data: this.warehouse,
    //     type: 'geojson'
    //   },
    //   paint: {
    //     'circle-radius': 20,
    //     'circle-color': 'white',
    //     'circle-stroke-color': '#3887be',
    //     'circle-stroke-width': 3
    //   }
    // });
    
    // Create a symbol layer on top of circle layer
    // map.addLayer({
    //   id: 'warehouse-symbol',
    //   type: 'symbol',
    //   source: {
    //     data: this.warehouse,
    //     type: 'geojson'
    //   },
    //   layout: {
    //     'icon-image': 'grocery-15',
    //     'icon-size': 1
    //   },
    //   paint: {
    //     'text-color': '#3887be'
    //   }
    // });
    
    map.addLayer({
      id: 'dropoffs-symbol',
      type: 'symbol',
      source: {
        data: this.dropoffs,
        type: 'geojson'
      },
      layout: {
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-image': 'marker-15',
        'icon-size': 2
      }
    });


    map.addLayer({
      id: 'chargers-symbol',
      type: 'symbol',
      source: {
        data: this.chargers,
        type: 'geojson'
      },
      paint: {
        'text-color': '#ff0000'
      },
      layout: {
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-image': 'fuel-15',
        'icon-size': 2          
      }
    });


    map.addLayer({
      id: 'used-chargers-symbol',
      type: 'symbol',
      source: {
        data: this.usedChargers,
        type: 'geojson'
      },
      layout: {
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-image': 'rocket-15',
        'icon-size': 2          
      }
    });
  });
  
  map.on('click', e => {
    // When the map is clicked, add a new drop-off point
    // and update the `dropoffs-symbol` layer
    this.newDropoff(map.unproject(e.point));
    this.updateDropoffs(this.dropoffs);
  });
}

//pune un punct pe map
async newDropoff(coords) {
  // Store the clicked point as a new GeoJSON feature with
  // two properties: `orderTime` and `key`
  console.log(coords);
    var pt = turf.point(
      [coords.lng, coords.lat],
      {
        orderTime: Date.now(),
        key: Math.random()
      }
    );
    this.dropoffs.features.push(pt);
    
    this.mapService.makeRoad([this.truckLocation.lng, this.truckLocation.lat], [coords.lng, coords.lat]).then(road => {
      console.log(road);
      this.chargers.features = road[1];
      this.usedChargers.features = road[2];
      this.updateChargers(this.chargers);
      this.updateUsedChargers(this.usedChargers);
      this.mapService.map.getSource('route2').setData(road[0]);
    });
}

updateDropoffs(geojson) {
  this.mapService.map.getSource('dropoffs-symbol')
  .setData(geojson);
}

updateChargers(geojson) {
  this.mapService.map.getSource('chargers-symbol')
  .setData(geojson);
}

updateUsedChargers(geojson) {
  this.mapService.map.getSource('used-chargers-symbol')
  .setData(geojson);
}




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
    console.log('intra');
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
