import { Injectable } from '@angular/core';
import { route } from './classes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';
import { first } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http : HttpClient) { }
  routes: route[];
  get(id = '') {
    //routes: route[];
    return this.http.get('https://3voxctner5.execute-api.eu-west-1.amazonaws.com/hack/' + id);
  }
  put(body: any, id = '') {
    let requestOptions = new RequestOptions({ headers:null, withCredentials: 
      true });

      
    return this.http.put('https://3voxctner5.execute-api.eu-west-1.amazonaws.com/hack' + id, body, {headers: new HttpHeaders({'Access-Control-Allow-Methods' : '*'})
    }).subscribe(e => {
      console.log(e);
    });
  }

  getRoutesFromString(text: string) {
    let splitArray = text.split("%");
    var routes : route[] = [];

    for(let word of splitArray) {
      let splitWord = word.split("#");
      //console.log(splitWord[0], ' ', splitWord[1], ' ', splitWord[2]);
      var x = new route();
      x.start = splitWord[0];
      x.end = splitWord[1];
      x.path = splitWord[2];
      routes.push(x);
    }
    return routes;
  }

  getStringFromRoutes(routes: route[]) {
    let val : string = "";
    let first: boolean = true;
    first  = true;
    for(let route of routes) {
      if(first == false) {
        val += "%";
      }
      else
      {
        first = false;
      }
      val += route.start + "#" + route.end + "#" + route.path;
    }
    return val;
  }
}
