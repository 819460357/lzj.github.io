import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchListComponent } from './merch-list.component';

const routes: Routes = [
  {
    path: '',
    component: MerchListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchListRoutingModule { }
