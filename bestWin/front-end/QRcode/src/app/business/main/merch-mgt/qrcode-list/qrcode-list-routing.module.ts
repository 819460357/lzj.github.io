import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrcodeListComponent } from './qrcode-list.component'

const routes: Routes = [
  {
    path: '',
    component: QrcodeListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrcodeListRoutingModule { }
