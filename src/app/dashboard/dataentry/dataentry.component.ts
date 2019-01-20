import { Component, OnInit } from '@angular/core';
import { PurchaseEntry } from './../../interfaces/purchase-entry';

@Component({
  selector: 'app-dataentry',
  templateUrl: './dataentry.component.html',
  styleUrls: ['./dataentry.component.css']
})
export class DataentryComponent implements OnInit {

  purchases: PurchaseEntry[];
  constructor() {
    this.purchases = new Array(15);
   }

  ngOnInit() {
  }

}
