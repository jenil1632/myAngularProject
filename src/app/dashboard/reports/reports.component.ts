import { Component, OnInit, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { PodateComponent } from './../../utils/podate/podate.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Invoice_info } from './../../services/invoice_info.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {

  @ViewChildren(PodateComponent) dates: QueryList<PodateComponent>;
  reportsForm: FormGroup;
  result: boolean = false;
  resultArray = [];
  totalTax12 = 0;
  totalTax18 = 0;
  totalBill = 0;
  constructor(private invoice_info: Invoice_info) { }

  ngOnInit() {
    this.reportsForm = new FormGroup({
    });
  }

  ngAfterViewInit(){
    let arr: PodateComponent[] = this.dates.toArray();
    this.reportsForm.addControl('fromDate', arr[0].poDate);
    this.reportsForm.get('fromDate').setValidators([Validators.required]);
    this.reportsForm.addControl('toDate', arr[1].poDate);
    this.reportsForm.get('toDate').setValidators([Validators.required]);
  }

  onSubmit(){
    this.totalBill = 0;
    this.totalTax12 = 0;
    this.totalTax18 = 0;
    this.resultArray = [];
    this.result = false;
    if(this.reportsForm.invalid){
      return;
    }
    this.invoice_info.getReports(this.reportsForm).subscribe(res=>{
      if(res.length>0){
        this.invoice_info.getUniqueDates(this.reportsForm).subscribe((invoices) =>{
          invoices.forEach((inv)=>{
            let tax18 = 0;
            let tax12 = 0;
            let invDate = "";
            let cName = "";
            let total = 0;
            let firstBill = true;
            res.forEach((order)=>{
              if(inv.invoice_no == order.invoice_no){
                if(firstBill){
                  invDate = order.invoice_date;
                  cName = order.cust_name;
                  total = order.bill_value;
                  this.totalBill += order.bill_value;
                  firstBill = false;
                }
                if(order.tax_rate == 18)
                {
                  tax18 += order.tax_value;
                  this.totalTax18 += order.tax_value;
                }
                else if(order.tax_rate == 12)
                {
                  tax12 += order.tax_value;
                  this.totalTax12 += order.tax_value;
                }
              }
            });
            let tmpDate = new Date(invDate);
            let invoiceDate =  `${tmpDate.getDate()}/${tmpDate.getMonth()+1}/${tmpDate.getFullYear()}`;
            this.resultArray.push({"invoice_no": inv.invoice_no, "invoice_date": invoiceDate, "cust_name": cName, "taxable18": tax18, "taxable12": tax12, "bill_value": total});
          });
        });
                  this.result = true;
      }console.log(this.resultArray);
    });
  }

}
