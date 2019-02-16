import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { Product_list } from './services/product_list.service';
import { Product_info } from './services/product_info.service';
import { Invoice_info } from './services/invoice_info.service';
import { Invoice_submit } from './services/invoice_submit.service';
import { Bill_no } from './services/bill_no.service';
import { Data_insert } from './services/dataInsert.service';
import { InvoiceDeleteComponent } from './dashboard/invoice-delete/invoice-delete.component';

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
    NewProductEntryComponent,
    InvoiceDeleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
  providers: [MatDatepickerModule, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}, Customer_list, Product_list, Product_info, Bill_no, Data_insert, Invoice_info, Invoice_submit],
  bootstrap: [AppComponent]
})
export class AppModule { }
