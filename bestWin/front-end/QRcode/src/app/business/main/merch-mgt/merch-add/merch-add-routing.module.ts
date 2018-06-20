import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchAddComponent } from './merch-add.component';

const routes: Routes = [
  {
    path: '',
    component: MerchAddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchAddRoutingModule { }
