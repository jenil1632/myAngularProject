import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataentryComponent} from './dashboard/dataentry/dataentry.component'
import { NewCustomerEntryComponent} from './dashboard/new-customer-entry/new-customer-entry.component';

const routes: Routes = [{path: 'dataentry', component: DataentryComponent}, {path: 'newCustomer', component: NewCustomerEntryComponent}, {path: '**', redirectTo: '/dataentry', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
