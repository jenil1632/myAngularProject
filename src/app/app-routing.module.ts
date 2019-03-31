import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataentryComponent} from './dashboard/dataentry/dataentry.component'
import { NewCustomerEntryComponent} from './dashboard/new-customer-entry/new-customer-entry.component';
import { NewProductEntryComponent} from './dashboard/new-product-entry/new-product-entry.component';
import { InvoiceDeleteComponent} from './dashboard/invoice-delete/invoice-delete.component';
import { InvoiceEditComponent } from './dashboard/invoice-edit/invoice-edit.component';
import { InvoiceViewComponent } from './dashboard/invoice-view/invoice-view.component';

const routes: Routes = [{path: 'dataentry', component: DataentryComponent, runGuardsAndResolvers: 'always'}, {path: 'newCustomer', component: NewCustomerEntryComponent}, {path: 'newProduct', component: NewProductEntryComponent}, {path: 'invoiceDelete', component: InvoiceDeleteComponent}, {path: 'invoiceEdit', component: InvoiceEditComponent}, {path: 'invoiceView', component: InvoiceViewComponent}, {path: '**', redirectTo: '/dataentry', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
