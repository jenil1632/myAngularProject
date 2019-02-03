import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatAutocompleteModule, MatSelectModule, MAT_DATE_LOCALE } from '@angular/material';
import { DataentryComponent } from './dashboard/dataentry/dataentry.component';
import { DatepickerComponent } from './utils/datepicker/datepicker.component';
import { NameAutocompleteComponent } from './utils/name-autocomplete/name-autocomplete.component';
import { ProductAutocompleteComponent } from './utils/product-autocomplete/product-autocomplete.component';
import { NewCustomerEntryComponent } from './dashboard/new-customer-entry/new-customer-entry.component';
import { NewProductEntryComponent } from './dashboard/new-product-entry/new-product-entry.component';
import { Customer_list } from './services/customer_list.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainNavComponent,
    DataentryComponent,
    DatepickerComponent,
    NameAutocompleteComponent,
    ProductAutocompleteComponent,
    NewCustomerEntryComponent,
    NewProductEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  providers: [MatDatepickerModule, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}, Customer_list],
  bootstrap: [AppComponent]
})
export class AppModule { }
