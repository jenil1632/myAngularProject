import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation} from '@angular/core';
import { ProductAutocompleteComponent} from './../../utils/product-autocomplete/product-autocomplete.component';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { Product_info } from "./../../services/product_info.service";
import { Data_insert } from "./../../services/dataInsert.service";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductEditComponent implements OnInit, AfterViewInit {

  @ViewChild(ProductAutocompleteComponent) child: ProductAutocompleteComponent;
  productForm: FormGroup;
  constructor(private product_info: Product_info, private data_insert: Data_insert) { }

  ngOnInit() {
    this.productForm = new FormGroup({
      rate: new FormControl(null, Validators.required),
      hsn: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)])
    });
    this.productForm.addControl('productName', this.child.productName);
  }

  ngAfterViewInit(){
    this.productForm.get('productName').valueChanges.pipe(distinctUntilChanged()).subscribe((e)=>{console.log(e);
      this.product_info.getProductData(e).subscribe((res)=>{
        if(res[0]!=undefined)
        {
        this.productForm.patchValue({"rate": res[0].rate});
        this.productForm.patchValue({"hsn": res[0].hsn});
      }
      });
    });
  }

  onSubmit(){
    if(this.productForm.invalid)
    {
      return;
    }
    this.data_insert.editProduct(this.productForm).subscribe(function(res){
      if(res.message=='success')
      {
        alert('Product inserted successfully');
      }
      else{
        alert('Error inserting Data');
      }
    });
          //this.router.navigate(['/dataentry']);
          this.productForm.get('productName').reset({"product_name": ""});
          this.productForm.get('rate').reset();
          this.productForm.get('hsn').reset();
  }
}
