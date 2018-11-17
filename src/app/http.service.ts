import { Injectable } from '@angular/core';
import { route } from './classes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http : HttpClient) { }

  get(id = '') {
    //routes: route[];
    this.http.get('https://3voxctner5.execute-api.eu-west-1.amazonaws.com/hack' + id).subscribe(
          e => {
            console.log(e);
            return e;
          });
  }
  put(body: any, id = '') {
    let requestOptions = new RequestOptions({ headers:null, withCredentials: 
      true });

      
    return this.http.put('https://3voxctner5.execute-api.eu-west-1.amazonaws.com/hack' + id, body, {headers: new HttpHeaders({'Access-Control-Allow-Methods' : '*'})
    }).subscribe(e => {
      console.log(e);
    });
  }
}
