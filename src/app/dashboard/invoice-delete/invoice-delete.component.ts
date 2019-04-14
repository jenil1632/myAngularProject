import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { Invoice_info } from './../../services/invoice_info.service';
import { Data_delete } from './../../services/dataDelete.service';

@Component({
  selector: 'app-invoice-delete',
  templateUrl: './invoice-delete.component.html',
  styleUrls: ['./invoice-delete.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceDeleteComponent implements OnInit {

  invoiceDeleteForm: FormGroup;
  constructor(private invoiceinfo: Invoice_info, private datadelete: Data_delete) { }

  ngOnInit() {
    this.invoiceDeleteForm = new FormGroup({
      invoiceNo: new FormControl(null, Validators.required),
      invoiceDate: new FormControl({value: null, disabled: true}),
      customerName: new FormControl({value: null, disabled: true}),
      billAmt: new FormControl({value: null, disabled: true})
    });
    this.invoiceDeleteForm.get('invoiceNo').valueChanges.pipe(distinctUntilChanged()).subscribe((e)=>{
      this.invoiceinfo.getInvoiceInfo({"invoiceNo": e}).subscribe((info)=>{
        if(info.length!=0)
        {
          let day = (info[0].invoice_date).slice(8, 10);
          let month = (info[0].invoice_date).slice(5, 7);
          let year = (info[0].invoice_date).slice(0, 4);
          let fullDate = `${day}-${month}-${year}`;
          this.invoiceDeleteForm.patchValue({'invoiceDate': fullDate});
          this.invoiceDeleteForm.patchValue({'customerName': info[0].cust_name});
        }
        else{
          this.invoiceDeleteForm.patchValue({'invoiceDate': ''});
          this.invoiceDeleteForm.patchValue({'customerName': ''});
        }
      });
      this.invoiceinfo.getBillAmt({"invoiceNo": e}).subscribe((info)=>{
        if(info.length!=0)
        {
          this.invoiceDeleteForm.patchValue({'billAmt': info[0].sum});
        }
        else{
          this.invoiceDeleteForm.patchValue({'billAmt': ''});
        }
      });
    });
}

onSubmit(){
  if(this.invoiceDeleteForm.invalid)
  {
    return;
  }
  document.getElementById("confirmation").style.display = 'block';
  let csstext = 'opacity: 0.4; pointer-events: none';
  document.getElementById("invoice-delete-form").style.cssText = csstext;
    //  this.router.navigate(['/dataentry']);
}

deleteRequest(){
  this.datadelete.deleteInvoice(this.invoiceDeleteForm.get('invoiceNo').value).subscribe(function(res){
    if(res.message=='success')
    {
      alert('Invoice deleted successfully');
    }
    else{
      alert('Error deleting data');
    }
  });
  this.hideConfirmation();
}

hideConfirmation(){
  document.getElementById("confirmation").style.display = 'none';
  let csstext = 'opacity: 1; pointer-events: auto';
  document.getElementById("invoice-delete-form").style.cssText = csstext;
  this.invoiceDeleteForm.reset();
}
}
