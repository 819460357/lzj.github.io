import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchAddRoutingModule } from './merch-add-routing.module';
import { MerchAddComponent } from './merch-add.component';
import { MerchAddService } from './merch-add.service';

@NgModule({
  imports: [
    CommonModule,
    MerchAddRoutingModule
  ],
  declarations: [MerchAddComponent],
  providers: [ MerchAddService ],
})
export class MerchAddModule { }
