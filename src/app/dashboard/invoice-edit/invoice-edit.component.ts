import { Component, OnInit, ViewEncapsulation, ViewChildren, AfterViewInit, QueryList, OnDestroy, ViewChild } from '@angular/core';
import { PurchaseEntry } from './../../interfaces/purchase-entry';
import { Product_info } from './../../services/product_info.service';
import { Bill_no } from './../../services/bill_no.service';
import { Invoice_submit } from './../../services/invoice_submit.service';
import { Data_insert } from './../../services/dataInsert.service';
import { Invoice_info } from './../../services/invoice_info.service';
import { Pdt } from './../../interfaces/pdt';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductAutocompleteComponent} from './../../utils/product-autocomplete/product-autocomplete.component';
import { NameAutocompleteComponent, User } from './../../utils/name-autocomplete/name-autocomplete.component';
import { DatepickerComponent } from './../../utils/datepicker/datepicker.component';
import { PodateComponent } from './../../utils/podate/podate.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceEditComponent implements OnInit, AfterViewInit, OnDestroy {
  purchases: PurchaseEntry[];
  pdts: Pdt[];
  totalProducts: number;
  bill: number;
  subscription: Subscription;
  productForm: FormGroup;
  @ViewChildren(ProductAutocompleteComponent) child: QueryList<ProductAutocompleteComponent>;
  @ViewChild(NameAutocompleteComponent) nChild: NameAutocompleteComponent;
  @ViewChild(DatepickerComponent) dChild: DatepickerComponent;
  @ViewChild(PodateComponent) pChild: PodateComponent;
  constructor(private product_list: Product_info, private bill_no: Bill_no, private invoice_submit: Invoice_submit, private data_insert: Data_insert, private invoiceInfo: Invoice_info) {
    this.purchases = new Array(15);
    this.totalProducts = 0;
    this.bill_no.getBillNo().subscribe(res => this.bill = res[0].invoice_no);
    this.subscription = this.invoice_submit.getState().subscribe(res =>{
      if(res)
      {
        if(this.productForm.invalid)
        {
          this.invoice_submit.setState(false);
          return;
        }
        this.data_insert.editInvoice(this.productForm).subscribe(function(s){
          if(s.message=='success')
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
    this.productForm = new FormGroup({
      'billNo': new FormControl(null),
      'paymentMode': new FormControl(null),
      'poNo': new FormControl(null),
      'ewayNo': new FormControl(null),
      'totalValue': new FormControl({value: 0, disabled: true}),
      'totalTaxAmt': new FormControl({value: 0, disabled: true}),
      'totalGross': new FormControl({value: 0, disabled: true}),
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
    this.productForm.addControl('invoiceDate', this.dChild.invoiceDate);
    this.productForm.addControl('poDate', this.pChild.poDate);
    let arr: ProductAutocompleteComponent[] = this.child.toArray();
    let j = 0;
    this.someArray.controls.forEach(control =>{
      (<FormGroup>control).addControl('childForm', arr[j].productName);
      arr[j].productName.setParent(<FormGroup>control);
      j++;
      control.get('childForm').valueChanges.pipe(distinctUntilChanged()).subscribe(()=>{
          let taxRate = this.getTaxRate(control.get('childForm').value.product_name);
          if(taxRate)
          {
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
        let tValue = this.someArray.controls.reduce((accumalator, currentValue)=>{
          return currentValue.get('value').value + accumalator;
        }, 0);
        let tTaxAmt = this.someArray.controls.reduce((accumalator, currentValue)=>{
          return currentValue.get('taxAmt').value + accumalator;
        }, 0);
        let tGross = this.someArray.controls.reduce((accumalator, currentValue)=>{
          return currentValue.get('gross').value + accumalator;
        }, 0);
        this.productForm.patchValue({"totalValue": tValue});
        this.productForm.patchValue({"totalTaxAmt": tTaxAmt});
        this.productForm.patchValue({"totalGross": tGross});
      });
      control.get('rate').valueChanges.pipe(distinctUntilChanged()).subscribe((e)=>{
        control.patchValue({"value": e*control.get('qty').value});
        let taxAmt = control.get('taxRate').value*control.get('value').value/100;
        control.patchValue({"taxAmt": taxAmt})
        control.patchValue({"gross": taxAmt+control.get('value').value});
        let tValue = this.someArray.controls.reduce((accumalator, currentValue)=>{
          return currentValue.get('value').value + accumalator;
        }, 0);
        let tTaxAmt = this.someArray.controls.reduce((accumalator, currentValue)=>{
          return currentValue.get('taxAmt').value + accumalator;
        }, 0);
        let tGross = this.someArray.controls.reduce((accumalator, currentValue)=>{
          return currentValue.get('gross').value + accumalator;
        }, 0);
        this.productForm.patchValue({"totalValue": tValue});
        this.productForm.patchValue({"totalTaxAmt": tTaxAmt});
        this.productForm.patchValue({"totalGross": tGross});
      });
    });
    this.productForm.get('billNo').valueChanges.pipe(distinctUntilChanged()).subscribe((e)=>{
      this.invoiceInfo.getInvoiceInfo({"invoiceNo": e}).subscribe((info)=>{
        if(info.length!=0)
        {
        let cn = this.nChild.options.find(user=> user.cust_name === info[0].cust_name);
        this.productForm.get('customerName').setValue(cn);
        this.productForm.patchValue({"paymentMode": info[0].payment_type});
        this.productForm.patchValue({"poNo": info[0].po_no});
        this.productForm.patchValue({"ewayNo": info[0].eway_no});
        if(info[0].po_date!=null)
        {
        this.productForm.patchValue({"poDate": new Date(info[0].po_date)});
        }
        this.productForm.patchValue({"invoiceDate": new Date(info[0].invoice_date)});
      }
       for(let i=0; i<info.length; i++)
       {
         let pn = arr[i].options.find(prod=> prod.product_name === info[i].product_des);
         //console.log(this.someArray.at(i).get('childForm'));
        this.someArray.at(i).get('childForm').setValue(pn);
        this.someArray.at(i).get('qty').setValue(info[i].qty);
        this.someArray.at(i).get('mrp').setValue(info[i].mrp);
        this.someArray.at(i).get('rate').setValue(info[i].unit_price);
       }
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
