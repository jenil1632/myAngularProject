import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Data_insert } from './../../services/dataInsert.service';

@Component({
  selector: 'app-new-product-entry',
  templateUrl: './new-product-entry.component.html',
  styleUrls: ['./new-product-entry.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewProductEntryComponent implements OnInit {

  productForm: FormGroup;
  constructor(public data_insert: Data_insert) { }

  ngOnInit() {
    this.productForm = new FormGroup({
      productName: new FormControl(null, Validators.required),
      rate: new FormControl(null, Validators.required),
      hsn: new FormControl(null)
    });
  }

  onSubmit(){
    this.data_insert.insertProduct(this.productForm).subscribe(function(res){
      if(res.message=='success')
      {
        alert('Product inserted successfully');
        this.productForm.reset();
      }
      else{
        alert('Error inserting Data');
      }
    });
  }

}
