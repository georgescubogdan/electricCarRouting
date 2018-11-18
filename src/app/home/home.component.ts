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
    
  }
}
