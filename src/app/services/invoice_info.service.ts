import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseEntry } from '../interfaces/purchase-entry';

@Injectable()
export class Invoice_info{

  constructor(private http: HttpClient){ }

  public getProducts(): Observable<PurchaseEntry[]>{
    return this.http.get<PurchaseEntry[]>("invoiceInfo");
  }
}
