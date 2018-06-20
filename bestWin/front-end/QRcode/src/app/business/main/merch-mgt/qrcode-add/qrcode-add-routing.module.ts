import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrcodeAddComponent } from './qrcode-add.component';

const routes: Routes = [
  {
    path: '',
    component: QrcodeAddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrcodeAddRoutingModule { }
