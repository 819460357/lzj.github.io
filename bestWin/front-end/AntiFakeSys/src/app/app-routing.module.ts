import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router'

const  appRoutes: Routes = [
  {
    path: 'qrcode',
    loadChildren: 'app/business/qrcode/qrcode.module#QrcodeModule'
  },
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: '/qrcode'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  declarations: [

  ],
  exports: [
    RouterModule
  ],
})

export class AppRoutingModule { }

