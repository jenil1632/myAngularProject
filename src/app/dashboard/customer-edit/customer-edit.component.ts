import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation} from '@angular/core';
import { NameAutocompleteComponent } from './../../utils/name-autocomplete/name-autocomplete.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { Customer_list } from "./../../services/customer_list.service";
import { Data_insert } from "./../../services/dataInsert.service";

export interface State {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerEditComponent implements OnInit, AfterViewInit {

  @ViewChild(NameAutocompleteComponent) child: NameAutocompleteComponent;
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
  constructor(private customer_list: Customer_list, private data_insert: Data_insert) { }

  ngOnInit() {
    this.customerForm = new FormGroup({
      'address': new FormControl(null),
      'gstNo': new FormControl(null, [Validators.required, this.ValidateGSTNO.bind(this)]),
      'contactNo': new FormControl(null),
      'email': new FormControl(null),
      'contactPerson': new FormControl(null),
      'state': new FormControl(null, Validators.required)
    });
    this.customerForm.addControl('customerName', this.child.customerName);
  }

  ngAfterViewInit(){
    this.customerForm.get('customerName').valueChanges.pipe(distinctUntilChanged()).subscribe((e)=>{
      const val = e.cust_name? e : {cust_name: e};
      this.customer_list.getCustomerData(val).subscribe((res)=>{
        if(res[0]!=undefined){
          this.customerForm.patchValue({"gstNo": res[0].gst_no});
          this.customerForm.patchValue({"address": res[0].address});
          this.customerForm.patchValue({"contactNo": res[0].telephone});
          this.customerForm.patchValue({"email": res[0].email});
          this.customerForm.patchValue({"contactPerson": res[0].contact_name});
          this.customerForm.patchValue({"state": res[0].state});
        }
      });
    });
  }

  ValidateGSTNO(control: FormControl) {
    if(control.value!=null)
    {
    if (control.value.length == 15 || control.value == 'URD'){
      return null;
    }
      return { validGSTNO: true };
  }
    return null;
  }

  onSubmit(){
    if(this.customerForm.invalid)
    {
      return;
    }
    this.customer_list.checkGSTno(this.customerForm.get('gstNo').value).subscribe((res) =>{
      if(res[0]!=undefined){
        if(res[0].cust_name != this.customerForm.get('customerName').value.cust_name && this.customerForm.get('gstNo').value != 'URD'){console.log(this.customerForm.get('customerName').value);
          return;
        }
      }
      this.data_insert.editCustomer(this.customerForm).subscribe(function(res){
        if(res.message=='success')
        {
          alert('Customer inserted successfully');
        }
        else{
          alert('Error inserting data');
        }
      });
      this.customerForm.get('customerName').reset("");
      this.customerForm.get('gstNo').reset();
      this.customerForm.get('address').reset();
      this.customerForm.get('contactPerson').reset();
      this.customerForm.get('contactNo').reset();
      this.customerForm.get('email').reset();
      this.customerForm.get('state').reset();
    });
  }

}
