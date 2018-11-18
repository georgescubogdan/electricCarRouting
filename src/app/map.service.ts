import { Injectable } from '@angular/core';
import * as mapboxgl from '../../node_modules/mapbox-gl/dist/mapbox-gl.js';
import { Map } from '../../node_modules/mapbox-gl/dist/mapbox-gl.js';
import { HttpClient } from '@angular/common/http';
import * as turf from '@turf/turf';

@Injectable()
export class MapService {
  map: Map<any, any>;
  nothing = turf.featureCollection([]);
  
  constructor(private http: HttpClient) {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYnVoYWhhIiwiYSI6ImNqb21tbGtxNzAzYmkzd3BvODFwdm8wY2oifQ.LcB-U1S4kSrNg6PwZkRppA';
  }
  
  
  // Here you'll specify all the parameters necessary for requesting a response from the Optimization API
  assembleQueryURL(points: any[]) {
    
    // Store the location of the truck in a variable called coordinates
    var coordinates: any = points;
    
    // Set the profile to `driving`
    // Coordinates will include the current location of the truck,
    return 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + coordinates.join(';') + '?overview=full&roundtrip=false&source=first&destination=last&steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
  }
  
  //primeste array de latitude, longitude (nu stiu daca asta e ordinea)
  async getCharginStationsCloseToPoint(point: number[]) {
    return await this.http.get('https://api.openchargemap.io/v2/poi/?latitude=' + point[1] + '&longitude=' + point[0] + '&distance=300&maxresults=10').toPromise();
  }
  
  //primeste array de array de coordonate => geojson
  async getRouteWithPoints(points) {
    let data = await this.http.get(this.assembleQueryURL(points)).toPromise();
    // Create a GeoJSON feature collection
    var routeGeoJSON = turf.featureCollection([turf.feature(data['trips'][0].geometry)]);
    
    // If there is no route provided, reset
    if (!data['trips'][0]) {
      routeGeoJSON = this.nothing;
    }
    // Update the `route` source by getting the route source
    // and setting the data equal to routeGeoJSON
    // var chunk = turf.lineChunk(routeGeoJSON, 15, {units: 'miles'});
    
    return routeGeoJSON;
  }
  
  
  async makeRoad(from, to) {
    let data = await this.http.get(this.assembleQueryURL([from, to])).toPromise();

    let geoJson: any;
    var routeGeoJSON = turf.featureCollection([turf.feature(data['trips'][0].geometry)]);

    let stations = [];
    let usedStations = [];

    // If there is no route provided, reset
    if (!data['trips'][0]) {
      routeGeoJSON = this.nothing;
    } else {
      var chunks = turf.lineChunk(routeGeoJSON, 300, {units: 'kilometers'});
      var waypoints = [from];
      for (let i = 0; i < chunks.features.length; i ++) {
        let chunk = chunks.features[i].geometry['coordinates'];
        let stationsFarEnd: any = await this.getCharginStationsCloseToPoint(chunk[chunk.length - 1]);
        let maxLen = 0;
        let maxCoordinates: any;
        let maxIndex = 0;
        let finalDistance = 0;

        if (i == chunks.features.length - 1) {
          finalDistance = turf.length(await this.getRouteWithPoints([chunk[0], chunk[chunk.length - 1]]));
        }

        for (let j = 0; j < stationsFarEnd.length; j++) {
          let station = stationsFarEnd[j]['AddressInfo'];
          var pt = turf.point(
            [station['Longitude'], station['Latitude']],
            {
              orderTime: Date.now(),
              key: Math.random()
            }
          );
          stations.push(pt);
          
          let geoJsonForLength = await this.getRouteWithPoints([chunk[0], [station['Longitude'], station['Latitude']]]);
          let len = turf.length(geoJsonForLength);
          
          if (len < 500  && len > maxLen) {
            maxLen = len;
            maxCoordinates = [station['Longitude'], station['Latitude']];
            maxIndex = j;
          }
        }
        if (finalDistance >= maxLen || i != chunks.features.length - 1) {
          var pt = turf.point(
            
            maxCoordinates,
            {
              orderTime: Date.now(),
              key: Math.random()
            }
          );
          stations.splice(maxIndex, 1);
          usedStations.push(pt);
          waypoints.push(maxCoordinates);
        }
        
      }
      waypoints.push(to);
      console.log(waypoints);
      geoJson = await this.getRouteWithPoints(waypoints);
    }

    return [geoJson, stations, usedStations];
  }
}