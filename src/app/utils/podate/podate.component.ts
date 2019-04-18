import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-podate',
  templateUrl: './podate.component.html',
  styleUrls: ['./podate.component.css']
})
export class PodateComponent implements OnInit {

  poDate = new FormControl();
  @Input() placeholderValue: string;
  @Input() reqDate: boolean;
  constructor() { }

  ngOnInit() {
  }

}
