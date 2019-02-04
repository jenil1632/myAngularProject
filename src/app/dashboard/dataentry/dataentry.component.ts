import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PurchaseEntry } from './../../interfaces/purchase-entry';

@Component({
  selector: 'app-dataentry',
  templateUrl: './dataentry.component.html',
  styleUrls: ['./dataentry.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DataentryComponent implements OnInit {

  purchases: PurchaseEntry[];
  constructor() {
    this.purchases = new Array(15);
   }

  ngOnInit() {
  }

}
