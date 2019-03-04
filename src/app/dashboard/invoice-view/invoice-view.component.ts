import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Invoice_info } from './../../services/invoice_info.service';
import { BillProduct } from './../../interfaces/billProduct';
import { distinctUntilChanged } from 'rxjs/operators';

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

  constructor(private invoiceInfo: Invoice_info) {
    this.products = new Array(15);
   }

  ngOnInit() {
    this.billNo.valueChanges.pipe(distinctUntilChanged()).subscribe((e)=>{
      this.invoiceInfo.getInvoiceInfo({"invoiceNo": e}).subscribe((info)=>{
        this.products = new Array(15);
        this.totalGross = 0;
        this.totalValue = 0;
        this.totalTaxAmt = 0;
        if(info.length!=0)
        {
        this.customerName = info[0].cust_name;
        this.invoiceInfo.getCustomer({"customerName": this.customerName}).subscribe((cust)=>{
        this.address = cust[0].address;
        this.contactNo = cust[0].telephone;
        this.contactName = cust[0].contact_name;
        this.email = cust[0].email;
        this.gstNo = cust[0].gst_no;
        });
        this.paymentType =  info[0].payment_type;
        this.poNo = info[0].po_no;
        this.ewayNo = info[0].eway_no;
        if(info[0].po_date!=null)
        {
          let tmpPoDate = new Date(info[0].po_date);
        this.poDate = `${tmpPoDate.getDate()}/${tmpPoDate.getMonth()}/${tmpPoDate.getFullYear()}`;
      }
        let tmpDate = new Date(info[0].invoice_date);
        this.invoiceDate =  `${tmpDate.getDate()}/${tmpDate.getMonth()}/${tmpDate.getFullYear()}`;
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
