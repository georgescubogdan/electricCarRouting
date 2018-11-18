import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { RestService } from './http.service';
import { ChattingService } from './chatting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hackITall2018';
   constructor (private rest: RestService, private _chattingService: ChattingService) {
    this._chattingService.activate_listener();
    rest.get('/mihai');
     let j = {
       "routes": "[{string, string, string}]"
     };
     rest.put( j, '/cosmin');
   }
}
