import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseEntry } from '../interfaces/purchase-entry';

@Injectable()
export class Invoice_info{

  constructor(private http: HttpClient){ }

  public getInvoiceInfo(invoiceNo): Observable<any>{
    return this.http.post<any>("invoiceInfo", invoiceNo);
  }

  public getBillAmt(invoiceNo): Observable<any>{
    return this.http.post<any>("billAmt", invoiceNo);
  }
}
