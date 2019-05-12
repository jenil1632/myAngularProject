import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Invoice_info } from './../../services/invoice_info.service';
import { BillProduct } from './../../interfaces/billProduct';
import { distinctUntilChanged } from 'rxjs/operators';
import { State } from './../new-customer-entry/new-customer-entry.component';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {

  products: BillProduct[];
  billNo = new FormControl();
  customerName: string;
  paymentType: string;
  poNo: string;
  ewayNo: string;
  poDate: string;
  invoiceDate: string;
  address: string;
  contactNo: string;
  contactName: string;
  email: string;
  gstNo: string;
  totalGross: number = 0;
  totalValue: number = 0;
  totalTaxAmt: number = 0;
  emptyString: string = " ";
  amountInWords: string;
  states: State[] = [
  {value: 1, viewValue: 'JAMMU AND KASHMIR'},
  {value: 2, viewValue: 'HIMACHAL PRADESH'},
  {value: 3, viewValue: 'PUNJAB'},
  {value: 4, viewValue: 'CHANDIGARH'},
  {value: 5, viewValue: 'UTTARAKHAND'},
  {value: 6, viewValue: 'HARYANA'},
  {value: 7, viewValue: 'DELHI'},
  {value: 8, viewValue: 'RAJASTHAN'},
  {value: 9, viewValue: 'UTTAR PRADESH'},
  {value: 10, viewValue: 'BIHAR'},
  {value: 11, viewValue: 'SIKKIM'},
  {value: 12, viewValue: 'ARUNACHAL PRADESH'},
  {value: 13, viewValue: 'NAGALAND'},
  {value: 14, viewValue: 'MANIPUR'},
  {value: 15, viewValue: 'MIZORAM'},
  {value: 16, viewValue: 'TRIPURA'},
  {value: 17, viewValue: 'MEGHALAYA'},
  {value: 18, viewValue: 'ASSAM'},
  {value: 19, viewValue: 'WEST BENGAL'},
  {value: 20, viewValue: 'JHARKHAND'},
  {value: 21, viewValue: 'ODISHA'},
  {value: 22, viewValue: 'CHATTISGARH'},
  {value: 23, viewValue: 'MADHYA PRADESH'},
  {value: 24, viewValue: 'GUJARAT'},
  {value: 25, viewValue: 'DAMAN AND DIU'},
  {value: 26, viewValue: 'DADRA AND NAGAR HAVELI'},
  {value: 27, viewValue: 'MAHARASHTRA'},
  {value: 28, viewValue: 'ANDHRA PRADESH (OLD)'},
  {value: 29, viewValue: 'KARNATAKA'},
  {value: 30, viewValue: 'GOA'},
  {value: 31, viewValue: 'LAKSHADWEEP'},
  {value: 32, viewValue: 'KERALA'},
  {value: 33, viewValue: 'TAMIL NADU'},
  {value: 34, viewValue: 'PUDUCHERRY'},
  {value: 35, viewValue: 'ANDAMAN AND NICOBAR ISLANDS'},
  {value: 36, viewValue: 'TELANGANA'},
  {value: 37, viewValue: 'ANDHRA PRADESH (NEW)'}
];
selectedState: State;
taxable12: number = 0;
taxable18: number = 0;
taxable28: number = 0;

  constructor(private invoiceInfo: Invoice_info) {
    this.products = new Array(15);
    this.selectedState = {value: 27, viewValue: 'MAHARASHTRA'};
   }

  ngOnInit() {
    this.billNo.valueChanges.pipe(distinctUntilChanged()).subscribe((e)=>{
      this.invoiceInfo.getInvoiceInfo({"invoiceNo": e}).subscribe((info)=>{
        this.products = new Array(15);
        this.totalGross = 0;
        this.totalValue = 0;
        this.totalTaxAmt = 0;
        this.taxable12 = 0;
        this.taxable18 = 0;
        this.taxable28 = 0;
        this.poDate = '';
        if(info.length!=0)
        {console.log(info[0]);
        this.customerName = info[0].cust_name;
        this.invoiceInfo.getCustomer({"customerName": this.customerName}).subscribe((cust)=>{console.log(cust);
        this.address = cust[0].address=="null" ? this.emptyString : cust[0].address;
        this.contactNo =  cust[0].telephone =="null" ? this.emptyString : cust[0].telephone;
        this.contactName = cust[0].contact_name == "null" ? this.emptyString : cust[0].contact_name;
        this.email = cust[0].email=="null" ? this.emptyString : cust[0].email;
        this.gstNo = cust[0].gst_no;
        let tempState = this.states.find((elem)=>{
          return elem.value == cust[0].state;
        });
        this.selectedState = tempState ? tempState : this.selectedState;
        });
        this.paymentType =  info[0].payment_type;
        this.poNo = info[0].po_no=="null" ? this.emptyString : info[0].po_no;
        this.ewayNo = info[0].eway_no=="null" ? this.emptyString : info[0].eway_no;
        if(info[0].po_date!=null)
        {
          let tmpPoDate = new Date(info[0].po_date);
        this.poDate = tmpPoDate.getFullYear()<2000 ? this.emptyString : `${tmpPoDate.getDate()}/${tmpPoDate.getMonth()+1}/${tmpPoDate.getFullYear()}`;
      }
        let tmpDate = new Date(info[0].invoice_date);
        this.invoiceDate =  `${tmpDate.getDate()}/${tmpDate.getMonth()+1}/${tmpDate.getFullYear()}`;
        for(let i=info.length-1; i>=0; i--)
        {
          let product: BillProduct = {
            productName: null,
            hsn: null,
            qty: null,
            rate: null,
            taxRate: null,
            taxAmt: null,
            gross: null,
            value: null
          };
         product.productName = info[i].product_des;
         this.invoiceInfo.getHSN({"productName": product.productName}).subscribe((h)=>{
          product.hsn = h[0].hsn;
         });
         product.qty = info[i].qty;
         product.rate = info[i].unit_price;
         product.taxRate = info[i].tax_rate;
         if(product.taxRate==12)
         {
           this.taxable12 += info[i].t_value;
         }
         else if(product.taxRate==18)
         {
           this.taxable18 += info[i].t_value;
         }
         else{
           this.taxable28 += info[i].t_value;
         }
         product.taxAmt = info[i].t_value;
         product.gross = info[i].bill_value;
         product.value = info[i].tax_value;
         this.totalGross += product.gross;
         this.totalTaxAmt += product.taxAmt;
         this.totalValue += product.value;
         this.products.unshift(product);
        }
        this.products.splice(14, this.products.length-15);
        this.products = [...this.products];
        this.invoiceInfo.getAmountInWords({"amt": this.totalGross}).subscribe((w)=>{
          this.amountInWords = w.amt;
        });
        }
      });
    });
  }

}
