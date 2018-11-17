import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http : HttpClient) { }

  get(url : string, id = '') {
    return this.http.get(url + id);
  }
  post(url: string, body: any, id = '') {
    return this.http.post(url + id, body);
  }
}
