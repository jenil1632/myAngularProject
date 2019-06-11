import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Invoice_submit } from './../services/invoice_submit.service';


declare var printInvoice: any;
declare var exportTableToExcel: any;

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private invoice_submit: Invoice_submit) {}

  submitForm()
  {
    this.invoice_submit.setState(true);
  }

  submitEditForm(){
    this.invoice_submit.setEditState(true);
  }

  createPrintInvoice(){
    new printInvoice();
  }

  createExcelFile(){
    new exportTableToExcel();
  }
}
