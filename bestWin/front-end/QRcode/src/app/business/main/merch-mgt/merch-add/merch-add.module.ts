import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchAddRoutingModule } from './merch-add-routing.module';
import { MerchAddComponent } from './merch-add.component';
import { MerchAddService } from './merch-add.service';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MerchAddRoutingModule,
    MatSelectModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule
  ],
  declarations: [MerchAddComponent],
  providers: [MerchAddService],
})
export class MerchAddModule { }
