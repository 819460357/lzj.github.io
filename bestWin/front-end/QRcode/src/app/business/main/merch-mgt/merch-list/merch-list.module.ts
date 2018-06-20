import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchListRoutingModule } from './merch-list-routing.module';
import { MerchListComponent } from './merch-list.component';
import { MerchListService } from './merch-list.service';

@NgModule({
  imports: [
    CommonModule,
    MerchListRoutingModule
  ],
  declarations: [MerchListComponent],
  providers: [ MerchListService ],
})
export class MerchListModule { }
