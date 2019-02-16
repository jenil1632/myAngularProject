import { Component, OnInit, ViewEncapsulation, ViewChildren, AfterViewInit, QueryList, OnDestroy, ViewChild } from '@angular/core';
import { PurchaseEntry } from './../../interfaces/purchase-entry';
import { Product_info } from './../../services/product_info.service';
import { Bill_no } from './../../services/bill_no.service';
import { Invoice_submit } from './../../services/invoice_submit.service';
import { Data_insert } from './../../services/dataInsert.service';
import { Pdt } from './../../interfaces/pdt';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductAutocompleteComponent} from './../../utils/product-autocomplete/product-autocomplete.component';
import { NameAutocompleteComponent } from './../../utils/name-autocomplete/name-autocomplete.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { Bill } from './../../interfaces/billNo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dataentry',
  templateUrl: './dataentry.component.html',
  styleUrls: ['./dataentry.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DataentryComponent implements OnInit, AfterViewInit, OnDestroy {

  purchases: PurchaseEntry[];
  pdts: Pdt[];
  totalProducts: number;
  bill: number;
  subscription: Subscription;
  productForm: FormGroup;
  @ViewChildren(ProductAutocompleteComponent) child: QueryList<ProductAutocompleteComponent>;
  @ViewChild(NameAutocompleteComponent) nChild: NameAutocompleteComponent;
  constructor(private product_list: Product_info, private bill_no: Bill_no, private invoice_submit: Invoice_submit, private data_insert: Data_insert) {
    this.purchases = new Array(15);
    this.totalProducts = 0;
    this.subscription = this.invoice_submit.getState().subscribe(function(res){
      if(res)
      {
        this.data_insert.insertInvoice(this.productForm).subscribe(function(s){
          if(s=='success')
          {
            alert('Invoice entered successfully');
            this.productForm.reset();
          }
          else{
            alert('Error inserting invoice');
          }
        });
      }
    });
   }

   public get someArray(): FormArray {
          return this.productForm.get('products') as FormArray
     }

  ngOnInit() {
    this.bill_no.getBillNo().subscribe(res => this.bill = res[0].invoice_no);
    this.productForm = new FormGroup({
      'invoiceNo': new FormControl(this.bill, Validators.required),
      'invoiceDate': new FormControl(null, Validators.required),
      'paymentMode': new FormControl(null, Validators.required),
      'poNo': new FormControl(null),
      'ewayNo': new FormControl(null),
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
    this.productForm.addControl('customerName', this.nChild.customerName);
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
}

public getTaxRate(x: string){
  let ans = this.pdts.find(function(elem){
    return elem.product_name == x;
  });
  return ans;
}

ngOnDestroy(){
  this.subscription.unsubscribe();
  this.invoice_submit.setState(false);
}
}
