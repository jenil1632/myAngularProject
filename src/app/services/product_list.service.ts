import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../utils/product-autocomplete/product-autocomplete.component';

@Injectable()
export class Product_list{

  constructor(private http: HttpClient){ }

  public getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>("productList");
  }
}
