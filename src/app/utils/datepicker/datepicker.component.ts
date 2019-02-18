import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements OnInit {

  invoiceDate = new FormControl();
  minDate: Date;
  maxDate: Date;
  constructor() {
    let todaysDate: Date = new Date();
    let todaysYear: number = todaysDate.getFullYear();
    let checkDate: Date = new Date(todaysYear, 2, 31);
    if(checkDate.getTime() >= todaysDate.getTime())
    {
      this.minDate = new Date(todaysYear-1, 3, 1);
      this.maxDate = checkDate;
    }
    else
    {
      this.minDate = new Date(todaysYear, 3, 1);
      this.maxDate = new Date(todaysYear+1, 2, 31);
    }
  }

  ngOnInit() {
  }
}
