import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  minDate: Date;
  maxDate: Date;
  constructor() {
    let todaysDate: Date = new Date();
    let todaysYear: number = todaysDate.getFullYear();
    let checkDate: Date = new Date(todaysYear, 3, 31);
    if(checkDate.getTime() >= todaysDate.getTime())
    {
      this.minDate = new Date(todaysYear-1, 4, 1);
      this.maxDate = checkDate;
    }
    else
    {
      this.minDate = new Date(todaysYear, 4, 1);
      this.maxDate = new Date(todaysYear+1, 3, 31);
    }
  }

  ngOnInit() {
  }
}
