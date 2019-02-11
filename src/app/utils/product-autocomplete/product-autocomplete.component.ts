import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Product_list} from './../../services/product_list.service';

export interface Product {
  product_name: string;
}

@Component({
  selector: 'app-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAutocompleteComponent implements OnInit {
  productName = new FormControl();
  options: Product[] = [];
  filteredOptions: Observable<Product[]>;

  ngOnInit() {
    this.product_list.getProducts().subscribe(res => this.options = res);
    this.filteredOptions = this.productName.valueChanges
      .pipe(
        startWith<string | Product>(''),
        map(value => typeof value === 'string' ? value : value.product_name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  displayFn(user?: Product): string | undefined {
    return user ? user.product_name : undefined;
  }

  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.product_name.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(private product_list: Product_list){}

}
