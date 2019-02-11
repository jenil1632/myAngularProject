import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pdt } from '../interfaces/pdt';

@Injectable()
export class Product_info{

  constructor(private http: HttpClient){ }

  public getProducts(): Observable<Pdt[]>{
    return this.http.get<Pdt[]>("productInfo");
  }
}
