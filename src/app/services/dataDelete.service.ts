import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';


@Injectable()
export class Data_delete{

  constructor(private http: HttpClient){ }

  public deleteInvoice(invoiceNo): Observable<any>{
    return this.http.delete<any>(`deleteInvoice/${invoiceNo}`);
  }

}
