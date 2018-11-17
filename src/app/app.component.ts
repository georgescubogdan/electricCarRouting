import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { RestService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hackITall2018';
   constructor (private rest: RestService) {
    //  rest.get('/mihai');
    //  let j = {
    //    "routes": "asdfeas"
    //  };
    //  //let sj = JSON.stringify(j);
    //  //console.log(sj);
    //  rest.put( j, '/cosmin');
   }
}
