import { Injectable } from '@angular/core';
import * as mapboxgl from '../../node_modules/mapbox-gl/dist/mapbox-gl.js';
import { Map } from '../../node_modules/mapbox-gl/dist/mapbox-gl.js';

@Injectable()
export class MapService {
  map: Map<any, any>;

  constructor() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYWlweSIsImEiOiJjam9samRwMGMwaGkzM3FvNGM1MTRua2FyIn0.oPAZeJD7PZ4t9nd8Hjl39g';
  }
}