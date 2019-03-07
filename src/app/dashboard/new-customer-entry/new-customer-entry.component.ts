import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Data_insert } from './../../services/dataInsert.service';

export interface State {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-new-customer-entry',
  templateUrl: './new-customer-entry.component.html',
  styleUrls: ['./new-customer-entry.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewCustomerEntryComponent implements OnInit {

  customerForm: FormGroup;
  states: State[] = [
  {value: 1, viewValue: 'Jammu and Kashmir'},
  {value: 2, viewValue: 'Himachal Pradesh'},
  {value: 3, viewValue: 'Punjab'},
  {value: 4, viewValue: 'Chandigarh'},
  {value: 5, viewValue: 'Uttarakhand'},
  {value: 6, viewValue: 'Haryana'},
  {value: 7, viewValue: 'Delhi'},
  {value: 8, viewValue: 'Rajasthan'},
  {value: 9, viewValue: 'Uttar Pradesh'},
  {value: 10, viewValue: 'Bihar'},
  {value: 11, viewValue: 'Sikkim'},
  {value: 12, viewValue: 'Arunachal Pradesh'},
  {value: 13, viewValue: 'Nagaland'},
  {value: 14, viewValue: 'Manipur'},
  {value: 15, viewValue: 'Mizoram'},
  {value: 16, viewValue: 'Tripura'},
  {value: 17, viewValue: 'Meghalaya'},
  {value: 18, viewValue: 'Assam'},
  {value: 19, viewValue: 'West Bengal'},
  {value: 20, viewValue: 'Jharkhand'},
  {value: 21, viewValue: 'Odisha'},
  {value: 22, viewValue: 'Chattisgarh'},
  {value: 23, viewValue: 'Madhya Pradesh'},
  {value: 24, viewValue: 'Gujarat'},
  {value: 25, viewValue: 'Daman and Diu'},
  {value: 26, viewValue: 'Dadra and Nagar Haveli'},
  {value: 27, viewValue: 'Maharashtra'},
  {value: 28, viewValue: 'Andhra Pradesh (old)'},
  {value: 29, viewValue: 'Karnataka'},
  {value: 30, viewValue: 'Goa'},
  {value: 31, viewValue: 'Lakshadweep'},
  {value: 32, viewValue: 'Kerala'},
  {value: 33, viewValue: 'Tamil Nadu'},
  {value: 34, viewValue: 'Puducherry'},
  {value: 35, viewValue: 'Andaman and Nicobar islands'},
  {value: 36, viewValue: 'Telangana'},
  {value: 37, viewValue: 'Andhra Pradesh (new)'}
];
  constructor(public data_insert: Data_insert) { }

  ngOnInit() {
    this.customerForm = new FormGroup({
      'customerName': new FormControl(null, Validators.required),
      'address': new FormControl(null),
      'gstNo': new FormControl(null, [Validators.required, this.ValidateGSTNO.bind(this)]),
      'contactNo': new FormControl(null, [Validators.required, this.ValidateContactNO.bind(this)]),
      'email': new FormControl(null),
      'contactPerson': new FormControl(null),
      'state': new FormControl(null)
    });
  }

  onSubmit(){
    if(this.customerForm.invalid)
    {
      return;
    }
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

  ValidateGSTNO(control: FormControl) {
    if(control.value!=null)
    {
    if (control.value.length != 16 || control.value != 'URD'){
      return { validGSTNO: true };
    }
    return null;
  }
    return null;
  }

  ValidateContactNO(control: FormControl) {
    if(control.value!=null)
    {
    if (control.value.length != 10 || control.value.length != 8){
      return { validContactNO: true };
    }
    return null;
  }
    return null;
  }


}
