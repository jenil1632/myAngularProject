import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-delete',
  templateUrl: './invoice-delete.component.html',
  styleUrls: ['./invoice-delete.component.css']
})
export class InvoiceDeleteComponent implements OnInit {

  invoiceDeleteForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.invoiceDeleteForm = new FormGroup({
      invoiceNo: new FormControl(null, Validators.required),
      invoiceDate: new FormControl({value: null, disabled: true}),
      customerName: new FormControl({value: null, disabled: true}),
      billAmt: new FormControl({value: null, disabled: true})
    });
  }

}
