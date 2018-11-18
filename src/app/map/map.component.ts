import { Component, OnInit, Renderer, AfterViewInit } from '@angular/core';
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
export class MapComponent implements AfterViewInit {
  truckLocation = new mapboxgl.LngLat(26.052601, 44.440989);
  constructor(private mapService: MapService, private http: HttpClient) { }
  
  // Create an empty GeoJSON feature collection, which will be used as the data source for the route before users add any new data
  nothing = turf.featureCollection([]);
  
  
  warehouseLocation = [26.047156, 44.445303];
  warehouse = turf.featureCollection([turf.point(this.warehouseLocation)]);
  currentRoute = null;
  speedFactor = 50;
  
  dropoffs = turf.featureCollection([]);
  chargers = turf.featureCollection([]);
  usedChargers = turf.featureCollection([]);
  detour = turf.featureCollection([]);
  
  
  
  ngAfterViewInit() {
    let map = new Map({
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
    map
    map.on('load', () => {
      var marker = document.createElement('div');
      marker.classList.add('truck');
      // Create a new marker
      let truckMarker = new mapboxgl.Marker(marker)
      .setLngLat(this.truckLocation)
      .addTo(map)
      
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
  
  //primeste array de latitude, longitude (nu stiu daca asta e ordinea)
  async getCharginStationsCloseToPoint(point: number[]) {
    return await this.http.get('https://api.openchargemap.io/v2/poi/?latitude=' + point[1] + '&longitude=' + point[0] + '&distance=300&maxresults=10').toPromise();
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
    
    let data = await this.mapService.makeRoad([this.truckLocation.lng, this.truckLocation.lat], [coords.lng, coords.lat]);

    console.log(data);
    this.chargers.features = data[1];
    this.usedChargers.features = data[2];
    this.updateChargers(this.chargers);
    this.updateUsedChargers(this.usedChargers);
    this.mapService.map.getSource('route2').setData(data[0]);
    
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
  
  
}
