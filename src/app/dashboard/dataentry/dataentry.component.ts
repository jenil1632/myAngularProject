import { Component, OnInit, ViewEncapsulation, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { PurchaseEntry } from './../../interfaces/purchase-entry';
import { Product_info } from './../../services/product_info.service';
import { Pdt } from './../../interfaces/pdt';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductAutocompleteComponent} from './../../utils/product-autocomplete/product-autocomplete.component';
import { distinctUntilChanged } from 'rxjs/operators';

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
        'rate': new FormControl(null, Validators.required),
        'taxRate': new FormControl({value: null, disabled: true}, Validators.required),
        'taxAmt': new FormControl({value: null, disabled: true}, Validators.required),
        'value': new FormControl({value: null, disabled: true}, Validators.required),
        'gross': new FormControl({value: null, disabled: true}, Validators.required)
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
      control.get('childForm').valueChanges.pipe(distinctUntilChanged()).subscribe(()=>{
        //console.log(this.someArray.controls.indexOf(control));
        console.log(control.get('childForm').value.product_name);
          let taxRate = this.getTaxRate(control.get('childForm').value.product_name);
          if(taxRate)
          {console.log(taxRate);
            control.patchValue({"taxRate": taxRate.rate});
          }
          else{
            control.patchValue({"taxRate": null});
          }
      });
      control.get('qty').valueChanges.pipe(distinctUntilChanged()).subscribe((e)=>{
        control.patchValue({"value": e*control.get('rate').value});
        let taxAmt = control.get('taxRate').value*control.get('value').value/100;
        control.patchValue({"taxAmt": taxAmt})
        control.patchValue({"gross": taxAmt+control.get('value').value});
      });
      control.get('rate').valueChanges.pipe(distinctUntilChanged()).subscribe((e)=>{
        control.patchValue({"value": e*control.get('qty').value});
        let taxAmt = control.get('taxRate').value*control.get('value').value/100;
        control.patchValue({"taxAmt": taxAmt})
        control.patchValue({"gross": taxAmt+control.get('value').value});
      });
    });
  //   for(let j=0; j<15; j++)
  //   {
  //   (<FormGroup>this.someArray.at(j)).addControl('childForm', this.child.productName);
  //   this.child.productName.setParent((<FormGroup>this.someArray.at(j)));
  //   this.someArray.controls[j].valueChanges.subscribe((value) => console.log(value) );
  // }
}

public getTaxRate(x: string){
  let ans = this.pdts.find(function(elem){
    return elem.product_name == x;
  });
  return ans;
}
}
