import { Component, OnInit, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { PodateComponent } from './../../utils/podate/podate.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Invoice_info } from './../../services/invoice_info.service';
import { Customer_list } from './../../services/customer_list.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {

  @ViewChildren(PodateComponent) date1: QueryList<PodateComponent>;
  reportsForm: FormGroup;
  result: boolean = false;
  startDate: string = "Start Date";
  endDate: string = "End Date";
  requiredDate: boolean = true;
  resultArray = [];
  totalTax12 = 0;
  totalTax18 = 0;
  totalBill = 0;
  value = 0;
  rates = [5, 12, 18, 'all'];
  displayRateColumn = 'all';

  constructor(private invoice_info: Invoice_info, private customer_list: Customer_list) { }

  ngOnInit() {
    this.reportsForm = new FormGroup({
      'gstRate': new FormControl(null, Validators.required)
    });
  }

  ngAfterViewInit(){
    this.reportsForm.addControl('fromDate', this.date1.first.poDate);
    this.reportsForm.addControl('toDate', this.date1.last.poDate);
  }

  onSubmit(){
    this.totalBill = 0;
    this.totalTax12 = 0;
    this.totalTax18 = 0;
    this.resultArray = [];
    this.value = 0;
    this.result = false;
    this.displayRateColumn = this.reportsForm.get('gstRate').value;
    this.invoice_info.getReports(this.reportsForm).subscribe(res=>{
      if(res.length>0){console.log(res);
        this.invoice_info.getUniqueDates(this.reportsForm).subscribe((invoices) =>{
          invoices.forEach((inv)=>{
            let tax18 = 0;
            let tax12 = 0;
            let invDate = "";
            let cName = "";
            let total = 0;
            let firstBill = true;
            let t_value = 0;
            res.forEach((order)=>{
              if(inv.invoice_no == order.invoice_no){
                this.value += order.t_value;
                t_value += order.t_value;
                total += order.bill_value;
                this.totalBill += order.bill_value;
                if(firstBill){
                  invDate = order.invoice_date;
                  cName = order.cust_name;
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
            this.customer_list.getCustomerData({"cust_name": cName}).subscribe((cData)=>{
              this.resultArray.push({"invoice_no": inv.invoice_no, "gstNo": cData[0].gst_no, "invoice_date": invoiceDate, "cust_name": cName, "taxable18": tax18, "taxable12": tax12, "bill_value": total, "taxable_value": t_value});
            });
          });
            this.resultArray.sort((a, b)=>{
              let dateArray1 = a.invoice_date.split("/");
              let dateArray2 = b.invoice_date.split("/");
              let date1: any = new Date(parseInt(dateArray1[2]), parseInt(dateArray1[1])-1, parseInt(dateArray1[0]));
              let date2: any = new Date(parseInt(dateArray2[2]), parseInt(dateArray2[1])-1, parseInt(dateArray2[0]));
              return date1 - date2;
            });
              this.result = true;
        });

      }
    });
  }

  sortResults(results){console.log(results.length);
    for(let i = 0; i< results.length; i++){
      for(let j = 0; j < results.length - i - 1; j++){
        let dateArray1 = results[j].invoice_date.split("/");
        let dateArray2 = results[j+1].invoice_date.split("/");
        let date1 = new Date(parseInt(dateArray1[2]), parseInt(dateArray1[1])-1, parseInt(dateArray1[0]));
        let date2 = new Date(parseInt(dateArray2[2]), parseInt(dateArray2[1])-1, parseInt(dateArray2[0]));
        if(date1 > date2){
          let temp = results[j+1];
          results[j+1] = results[j];
          results[j] = temp;
        }
      }
    }
    console.log(results);
  }

}
