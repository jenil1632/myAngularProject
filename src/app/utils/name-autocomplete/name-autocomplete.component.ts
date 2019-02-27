import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Customer_list} from './../../services/customer_list.service';

export interface User {
  cust_name: string;
}


@Component({
  selector: 'app-name-autocomplete',
  templateUrl: './name-autocomplete.component.html',
  styleUrls: ['./name-autocomplete.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NameAutocompleteComponent implements OnInit {
  customerName = new FormControl(null, Validators.required);
  options: User[] = [];
  filteredOptions: Observable<User[]>;

  ngOnInit() {
    this.customer_list.getCustomers().subscribe(res => this.options = res);
    this.filteredOptions = this.customerName.valueChanges
      .pipe(
        startWith<string | User>(''),
        map(value => typeof value === 'string' ? value : value.cust_name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  displayFn(user?: User): string | undefined {
    //return user? user.cust_name : 'nola';
    return user ? user.cust_name : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.cust_name.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(private customer_list: Customer_list){
  }
}
