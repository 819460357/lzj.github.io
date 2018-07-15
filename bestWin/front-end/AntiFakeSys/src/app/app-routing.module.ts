import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router'

const  appRoutes: Routes = [
  {
    path: 'qrc',
    loadChildren: 'app/business/qrcode/qrcode.module#QrcodeModule'
  },
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: '/qrc'
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

