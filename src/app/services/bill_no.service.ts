import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from './../interfaces/billNo';


@Injectable()
export class Bill_no{

  constructor(private http: HttpClient){ }

  public getBillNo(): Observable<Bill>{
    return this.http.get<Bill>("lastBill");
  }
}
