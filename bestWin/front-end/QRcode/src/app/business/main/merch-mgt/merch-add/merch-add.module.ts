import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchAddRoutingModule } from './merch-add-routing.module';
import { MerchAddComponent } from './merch-add.component';
import { MerchAddService } from './merch-add.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MerchAddRoutingModule
  ],
  declarations: [MerchAddComponent],
  providers: [ MerchAddService ],
})
export class MerchAddModule { }
