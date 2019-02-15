import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Data_insert } from './../../services/dataInsert.service';

@Component({
  selector: 'app-new-customer-entry',
  templateUrl: './new-customer-entry.component.html',
  styleUrls: ['./new-customer-entry.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewCustomerEntryComponent implements OnInit {

  customerForm: FormGroup;
  constructor(public data_insert: Data_insert) { }

  ngOnInit() {
    this.customerForm = new FormGroup({
      'customerName': new FormControl(null, Validators.required),
      'address': new FormControl(null),
      'gstNo': new FormControl(null, Validators.required),
      'contactNo': new FormControl(null, Validators.required),
      'email': new FormControl(null),
      'contactPerson': new FormControl(null)
    });
  }

  onSubmit(){
    this.data_insert.insertCustomer(this.customerForm.value).subscribe(function(res){
      if(res.message=='success')
      {
        alert('Customer inserted successfully');
        this.customerForm.reset();
      }
      else{
        alert('Error inserting data');
      }
    });
  }

}
