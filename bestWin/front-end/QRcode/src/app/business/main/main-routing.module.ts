import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'home',
        loadChildren: 'app/business/main/home/home.module#HomeModule',
      },
      { path: 'addMerch',
        loadChildren: 'app/business/main/merch-mgt/merch-add/merch-add.module#MerchAddModule',
      },
      { path: 'merchList',
        loadChildren: 'app/business/main/merch-mgt/merch-list/merch-list.module#MerchListModule',
      },
      { path: 'addQrCode',
        loadChildren: 'app/business/main/merch-mgt/qrcode-add/qrcode-add.module#QrcodeAddModule',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
