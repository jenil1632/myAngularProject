import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';


@Injectable()
export class Data_insert{

  constructor(private http: HttpClient){ }

  public insertCustomer(formGroup: FormGroup): Observable<any>{
    return this.http.post<any>("insertCustomer", formGroup);
  }

  public insertProduct(formGroup: FormGroup): Observable<any>{
    return this.http.post<any>("insertProduct", formGroup.value);
  }

  public insertInvoice(formGroup: FormGroup): Observable<any>{
    return this.http.post<any>("insertInvoice", formGroup.getRawValue());
  }

  public editInvoice(formGroup: FormGroup): Observable<any>{
    return this.http.post<any>("editInvoice", formGroup.getRawValue());
  }

  public editProduct(formGroup: FormGroup): Observable<any>{
    return this.http.post<any>("editProduct", formGroup.getRawValue());
  }
}
