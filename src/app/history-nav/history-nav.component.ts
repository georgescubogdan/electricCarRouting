import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { route } from '../classes';

@Component({
  selector: 'app-history-nav',
  templateUrl: './history-nav.component.html',
  styleUrls: ['./history-nav.component.css']
})
export class HistoryNavComponent implements OnInit {
  routes : route[] = [
    {
      start: "Pitesti",
      end: "Bucuresti",
      path: ""
    },
    {
      start: "Pitesti",
      end: "Bucuresti",
      path: ""
    },
    {
      start: "Pitesti",
      end: "Bucuresti",
      path: ""
    }
]
  constructor(private router: Router) { }

  ngOnInit() {
  }

  goHome() {
    this.router.navigate(['home']);
  }
}
