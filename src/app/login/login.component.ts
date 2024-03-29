import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService : LoginService, private router: Router) { 
    
  }

  ngOnInit() {
    this.loginService.stateObservable.subscribe(e => {
      //console.log(e);
      if (e === true)
        this.router.navigate(['home']);
    });
  }
}

