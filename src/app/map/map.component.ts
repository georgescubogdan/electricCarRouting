import { Component, OnInit, Renderer } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { MapService } from '../map.service';

import { Map } from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  truckLocation = new mapboxgl.LngLat(26.052601, 44.440989);
  constructor(private mapService: MapService, private http: HttpClient) { }
  
  // Create an empty GeoJSON feature collection, which will be used as the data source for the route before users add any new data
  nothing = turf.featureCollection([]);
  
  
  warehouseLocation = [26.047156, 44.445303];
  warehouse = turf.featureCollection([turf.point(this.warehouseLocation)]);
  lastQueryTime = 0;
  lastAtRestaurant = 0;
  keepTrack = [];
  currentSchedule = [];
  currentRoute = null;
  pointHopper: { [id: string] : any; } = {}
  pause = true;
  speedFactor = 50;

  dropoffs = turf.featureCollection([]);



  ngOnInit() {
    let map = new Map({
      container: 'map',
      // style: 'mapbox://styles/mapbox/traffic-night-v2',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [26.052601, 44.440989],
      zoom: 16
    });
    
    this.mapService.map = map;
    
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    map
    map.on('load', () => {
      var marker = document.createElement('div');
      marker.classList.add('truck');
      // Create a new marker
      console.log(this.truckLocation);
      let truckMarker = new mapboxgl.Marker(marker)
      .setLngLat(this.truckLocation)
      .addTo(map)
      
      map.addSource('route', {
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

      // Create a circle layer
map.addLayer({
  id: 'warehouse',
  type: 'circle',
  source: {
    data: this.warehouse,
    type: 'geojson'
  },
  paint: {
    'circle-radius': 20,
    'circle-color': 'white',
    'circle-stroke-color': '#3887be',
    'circle-stroke-width': 3
  }
});

// Create a symbol layer on top of circle layer
map.addLayer({
  id: 'warehouse-symbol',
  type: 'symbol',
  source: {
    data: this.warehouse,
    type: 'geojson'
  },
  layout: {
    'icon-image': 'grocery-15',
    'icon-size': 1
  },
  paint: {
    'text-color': '#3887be'
  }
});

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
  newDropoff(coords) {
    // Store the clicked point as a new GeoJSON feature with
    // two properties: `orderTime` and `key`
    var pt = turf.point(
      [coords.lng, coords.lat],
      {
        orderTime: Date.now(),
        key: Math.random()
      }
    );
    this.dropoffs.features.push(pt);

    this.http.get(this.assembleQueryURL()).subscribe((data) => {
      // Create a GeoJSON feature collection

      console.log(data);
      var routeGeoJSON = turf.featureCollection([turf.feature(data['trips'][0].geometry)]);
  
      // If there is no route provided, reset
      if (!data['trips'][0]) {
        routeGeoJSON = this.nothing;
      } else {
        // Update the `route` source by getting the route source
        // and setting the data equal to routeGeoJSON
        this.mapService.map.getSource('route')
          .setData(routeGeoJSON);
      }
  
      if (data['waypoints'].length === 12) {
        window.alert('Maximum number of points reached. Read more at mapbox.com/api-documentation/#optimization.');
      }
    });
  }
  
  updateDropoffs(geojson) {
    this.mapService.map.getSource('dropoffs-symbol')
      .setData(geojson);
  }
  
  
  
  // Here you'll specify all the parameters necessary for requesting a response from the Optimization API
  assembleQueryURL() {
    
    // Store the location of the truck in a variable called coordinates
    var coordinates: any = [[this.truckLocation.lng, this.truckLocation.lat]];
    var distributions = [];
    this.keepTrack = [this.truckLocation];
    
    console.log(this.dropoffs);
    console.log(this.dropoffs.features);
    // Create an array of GeoJSON feature collections for each point
    var restJobs = this.dropoffs.features;
    
    // If there are actually orders from this restaurant
    if (restJobs.length > 0) {
      
      
      // If the request was made after picking up from the restaurant,
      // Add the restaurant as an additional stop
      
      restJobs.forEach((d, i) => {
        // Add dropoff to list
        let k = d.geometry.coordinates;
        coordinates.push(k);
      });
    }
    
    // Set the profile to `driving`
    // Coordinates will include the current location of the truck,
    return 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + coordinates.join(';') + '?overview=full&roundtrip=false&source=first&destination=last&steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
  }
  
  objectToArray(obj) {
    var keys = Object.keys(obj);
    var routeGeoJSON = keys.map(function(key) {
      return obj[key];
    });
    return routeGeoJSON;
  }
}
