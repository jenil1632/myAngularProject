import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../utils/name-autocomplete/name-autocomplete.component';

@Injectable()
export class Customer_list{

  constructor(private http: HttpClient){ }

  public getCustomers(): Observable<User[]>{
    return this.http.get<User[]>("customerList");
  }

  public checkGSTno(gstNo){
    return this.http.post("checkGSTno", {"gstNo": gstNo});
  }

  public getCustomerData(customerName){
    return this.http.post("getCustomerData", customerName);
  }
}
