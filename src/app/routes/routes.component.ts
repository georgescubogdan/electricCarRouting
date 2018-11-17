import { Component, OnInit, Input } from '@angular/core';
import { route } from '../classes';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {
  @Input() routes: route[];
  constructor() { }

  ngOnInit() {
  }

}
