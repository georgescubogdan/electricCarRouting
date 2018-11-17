import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-nav',
  templateUrl: './history-nav.component.html',
  styleUrls: ['./history-nav.component.css']
})
export class HistoryNavComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goHome() {
    this.router.navigate(['home']);
  }
}
