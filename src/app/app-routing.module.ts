import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataentryComponent} from './dashboard/dataentry/dataentry.component'

const routes: Routes = [{path: '', component: DataentryComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
