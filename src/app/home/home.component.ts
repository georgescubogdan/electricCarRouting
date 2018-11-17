import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { RestService } from '../http.service';
import { route } from '../classes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private loginService : LoginService, private router: Router, private rest: RestService) { }

  ngOnInit() {
    var routes : route[];
    routes = this.rest.getRoutesFromString('asa#da#ba%ok1#ok2#ok3');
    for(let x of routes){
      console.log("start: ", x.start, " end: ", x.end, " path: ", x.path);
    }

    var x = this.rest.getStringFromRoutes(routes);

    console.log("text is: " + x);

    this.loginService.stateObservable.subscribe(e => {
      //console.log(e);
      if (e === false)
        this.router.navigate(['login']);
    });
  }
}
