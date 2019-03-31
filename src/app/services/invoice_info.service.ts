import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Invoice_info{

  constructor(private http: HttpClient){ }

  public getInvoiceInfo(invoiceNo): Observable<any>{
    return this.http.post<any>("invoiceInfo", invoiceNo);
  }

  public getBillAmt(invoiceNo): Observable<any>{
    return this.http.post<any>("billAmt", invoiceNo);
  }

  public getCustomer(customerName): Observable<any>{
    return this.http.post<any>("getCustomer", customerName);
  }

  public getHSN(productName): Observable<any>{
    return this.http.post<any>("productHSN", productName);
  }

  public getAmountInWords(amt): Observable<any>{
    return this.http.post<any>("inWords", amt);
  }
}
