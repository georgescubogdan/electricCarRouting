import { Component, OnInit, Input } from '@angular/core';
import { result } from '../classes';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() results: result[];

  constructor() { }

  ngOnInit() {
  }

}
