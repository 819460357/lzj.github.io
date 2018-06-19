import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router'

const  appRoutes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/business/login/login.module#LoginModule'
  },
  {
    path: 'main',
    loadChildren: 'app/business/main/main.module#MainModule'
  },
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: '/login'
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

