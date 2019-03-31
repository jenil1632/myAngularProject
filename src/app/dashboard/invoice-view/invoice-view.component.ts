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
selectedState: State;
taxable12: number = 0;
taxable18: number = 0;
taxable28: number = 0;

  constructor(private invoiceInfo: Invoice_info) {
    this.products = new Array(15);
    this.selectedState = {value: 27, viewValue: 'Maharashtra'};
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
        {
        this.customerName = info[0].cust_name;
        this.invoiceInfo.getCustomer({"customerName": this.customerName}).subscribe((cust)=>{
        this.address = cust[0].address;
        this.contactNo = cust[0].telephone;
        this.contactName = cust[0].contact_name;
        this.email = cust[0].email;
        this.gstNo = cust[0].gst_no;
        let tempState = this.states.find((elem)=>{
          return elem.value == cust[0].state;
        });
        this.selectedState = tempState ? tempState : this.selectedState;
        });
        this.paymentType =  info[0].payment_type;
        this.poNo = info[0].po_no;
        this.ewayNo = info[0].eway_no;
        if(info[0].po_date!=null)
        {
          let tmpPoDate = new Date(info[0].po_date);
        this.poDate = `${tmpPoDate.getDate()}/${tmpPoDate.getMonth()+1}/${tmpPoDate.getFullYear()}`;
      }
        let tmpDate = new Date(info[0].invoice_date);
        this.invoiceDate =  `${tmpDate.getDate()}/${tmpDate.getMonth()+1}/${tmpDate.getFullYear()}`;
        for(let i=0; i<info.length; i++)
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
        console.log(this.products);
        }
      });
    });
  }

}
