import { Component, OnInit, ViewEncapsulation, ViewChildren, AfterViewInit, QueryList, OnDestroy, ViewChild } from '@angular/core';
import { PurchaseEntry } from './../../interfaces/purchase-entry';
import { Product_info } from './../../services/product_info.service';
import { Customer_list } from './../../services/customer_list.service';
import { Invoice_submit } from './../../services/invoice_submit.service';
import { Data_insert } from './../../services/dataInsert.service';
import { Invoice_info } from './../../services/invoice_info.service';
import { Pdt } from './../../interfaces/pdt';
import { FormArray, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ProductAutocompleteComponent} from './../../utils/product-autocomplete/product-autocomplete.component';
import { NameAutocompleteComponent, User } from './../../utils/name-autocomplete/name-autocomplete.component';
import { DatepickerComponent } from './../../utils/datepicker/datepicker.component';
import { PodateComponent } from './../../utils/podate/podate.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceEditComponent implements OnInit, AfterViewInit, OnDestroy {
  purchases: PurchaseEntry[];
  pdts: Pdt[];
  poDateString: string = "PO Date";
  noOfProducts: number = 0;
  subscription: Subscription;
  productForm: FormGroup;
  toggleTaxRate: boolean;
  customerList: User[];
  exitLoop: boolean = false;
  areValuesPopulated: boolean = false;
  navigationSubsciption;
  @ViewChildren(ProductAutocompleteComponent) child: QueryList<ProductAutocompleteComponent>;
  @ViewChild(NameAutocompleteComponent) nChild: NameAutocompleteComponent;
  @ViewChild(DatepickerComponent) dChild: DatepickerComponent;
  @ViewChild(PodateComponent) pChild: PodateComponent;
  constructor(private product_list: Product_info, private invoice_submit: Invoice_submit, private data_insert: Data_insert, private invoiceInfo: Invoice_info, private customer_list: Customer_list, private router: Router) {
    this.navigationSubsciption = this.router.events.subscribe((e: any) => {
      if(e instanceof NavigationEnd){
        this.purchases = new Array(15);
        this.toggleTaxRate = false;
        this.customer_list.getCustomers().subscribe(res =>{ this.customerList = res});
        this.subscription = this.invoice_submit.getState().subscribe(res =>{
          if(res)
          {console.log('submission in progress');
            if(this.validateCustomerName(this.productForm.get('customerName')))
            {console.log('edit-customer');
              this.invoice_submit.setState(false);
              document.getElementById("customerName").classList.add("errorClass");
              return;
            }
            this.someArray.controls.forEach(control =>{
              if(control.get('childForm').value != null)
              {
                if(this.validateProductName(control))
                {console.log(control.value);
                  this.invoice_submit.setState(false);
                  this.exitLoop = true;
                  alert("invalid product name(s)");
                  return;
                }
              }
              else{
                this.noOfProducts++;
              }
            });
            if(this.noOfProducts==15){
              this.noOfProducts = 0;
              alert("Please enter product name");
              return;
            }
            if(this.exitLoop == true)
            {
              this.exitLoop = false;
              return;
            }
            if(this.productForm.invalid)
            {
              this.invoice_submit.setState(false);
              return;
            }
            this.data_insert.editInvoice(this.productForm).subscribe(function(s){
              if(s.message=='success')
              {
                alert('Invoice entered successfully');
              }
              else{
                alert('Error inserting invoice');
              }
            });
           this.resetEditForm();
           this.router.navigate(['/invoiceEdit']);
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
        'qty': new FormControl(null),
        'mrp': new FormControl(null),
        'rate': new FormControl(null),
        'taxRate': new FormControl({value: null, disabled: true}),
        'taxAmt': new FormControl({value: null, disabled: true}),
        'value': new FormControl({value: null, disabled: true}),
        'gross': new FormControl({value: null, disabled: true})
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
      control.get('childForm').valueChanges.pipe(distinctUntilChanged()).subscribe(()=>{console.log(this.toggleTaxRate);
        if(this.toggleTaxRate == false){
          let taxRate = this.getTaxRate(control.get('childForm').value.product_name);
          if(taxRate)
          {
            control.patchValue({"taxRate": taxRate.rate});
            control.get('qty').setValidators([Validators.required]);
            control.get('qty').updateValueAndValidity();
            control.get('rate').setValidators([Validators.required]);
            control.get('rate').updateValueAndValidity();
          }
          else{
            control.patchValue({"taxRate": null});
            control.get('qty').clearValidators();
            control.get('qty').updateValueAndValidity();
            control.get('rate').clearValidators();
            control.get('rate').updateValueAndValidity();
            control.get('qty').reset();
            control.get('mrp').reset();
            control.get('rate').reset();
            control.get('taxRate').reset();
            control.get('taxAmt').reset();
            control.get('value').reset();
            control.get('gross').reset();
          }
        }
        this.toggleTaxRate = false;
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
        this.areValuesPopulated = true;
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
      if(this.areValuesPopulated == true && info.length == 0){
           this.resetEditForm();
      }
       for(let i=0; i<info.length; i++)
       {
         let pn = arr[i].options.find(prod=> prod.product_name === info[i].product_des);
         //console.log(this.someArray.at(i).get('childForm'));
        this.toggleTaxRate = true;
        this.someArray.at(i).get('childForm').setValue(pn);
        this.someArray.at(i).get('taxRate').setValue(info[i].tax_rate);
        this.someArray.at(i).get('qty').setValue(info[i].qty);
        this.someArray.at(i).get('mrp').setValue(info[i].mrp);
        this.someArray.at(i).get('rate').setValue(info[i].unit_price);
       }
      });
    });
    document.getElementById('customerName').addEventListener('click', ()=>{
      document.getElementById('customerName').classList.remove('errorClass');
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

  public validateCustomerName(control: AbstractControl){

    if(this.customerList.find(c =>{
      return c.cust_name == control.value.cust_name;
    })){
      return null;
    }
    return true;
  }

  public validateProductName(control: AbstractControl){
    if(this.pdts.find(p =>{
      return p.product_name == control.value.childForm.product_name;
    })){
      return null;
    }
    return true;
  }

  public resetEditForm(){
    this.someArray.controls.forEach(control =>{
     control.get('qty').reset();
     control.get('mrp').reset();
     control.get('rate').reset();
     control.get('taxRate').reset();
     control.get('taxAmt').reset();
     control.get('value').reset();
     control.get('gross').reset();
     if(control.get('childForm').value != null)
     {
       control.get('childForm').setValue({"product_name": ""});
     }
    });
    this.productForm.get('paymentMode').reset();
    this.productForm.get('poNo').reset();
    this.productForm.get('ewayNo').reset();
    this.productForm.get('totalValue').reset(0);
    this.productForm.get('totalTaxAmt').reset(0);
    this.productForm.get('totalGross').reset(0);
    this.productForm.get('customerName').reset({"cust_name": ""});
    this.productForm.get('invoiceDate').reset();
    this.productForm.get('poDate').reset();
    this.productForm.get('billNo').reset();
    this.areValuesPopulated = false;
  }
  }
