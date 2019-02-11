import { Component, OnInit, ViewEncapsulation, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { PurchaseEntry } from './../../interfaces/purchase-entry';
import { Product_info } from './../../services/product_info.service';
import { Pdt } from './../../interfaces/pdt';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductAutocompleteComponent} from './../../utils/product-autocomplete/product-autocomplete.component';

@Component({
  selector: 'app-dataentry',
  templateUrl: './dataentry.component.html',
  styleUrls: ['./dataentry.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DataentryComponent implements OnInit, AfterViewInit {

  purchases: PurchaseEntry[];
  pdts: Pdt[];
  totalProducts: number;
  product_rate: number;
  productForm: FormGroup;
  @ViewChildren(ProductAutocompleteComponent) child: QueryList<ProductAutocompleteComponent>;
  constructor(private product_list: Product_info) {
    this.purchases = new Array(15);
    this.totalProducts = 0;
   }

   public get someArray(): FormArray {
          return this.productForm.get('products') as FormArray
     }

  ngOnInit() {
    this.productForm = new FormGroup({
      'products': new FormArray([])
    });
    for(let j=0;j<15;j++)
    {
      this.someArray.push(new FormGroup({
        'qty': new FormControl(null, Validators.required),
        'mrp': new FormControl(null, Validators.required),
        'rate': new FormControl(null, Validators.required)
      }));
    }
    this.product_list.getProducts().subscribe(res => this.pdts = res);
  }

  ngAfterViewInit(){
    let arr: ProductAutocompleteComponent[] = this.child.toArray();
    let j = 0;
    this.someArray.controls.forEach(control =>{
      (<FormGroup>control).addControl('childForm', arr[j].productName);
      arr[j].productName.setParent(<FormGroup>control);
      j++;
      control.valueChanges.subscribe(()=>{
        console.log(this.someArray.controls.indexOf(control));
      });
    });
  //   for(let j=0; j<15; j++)
  //   {
  //   (<FormGroup>this.someArray.at(j)).addControl('childForm', this.child.productName);
  //   this.child.productName.setParent((<FormGroup>this.someArray.at(j)));
  //   this.someArray.controls[j].valueChanges.subscribe((value) => console.log(value) );
  // }
}
}
