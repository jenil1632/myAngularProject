import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {

  products: any[];

  constructor() {
    this.products = new Array(15);
   }

  ngOnInit() {
  }

}
