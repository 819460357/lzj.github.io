import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrcodeListRoutingModule } from './qrcode-list-routing.module';
import { QrcodeListComponent } from './qrcode-list.component';
import { QrcodeListService } from './qrcode-list.service';

@NgModule({
  imports: [
    CommonModule,
    QrcodeListRoutingModule
  ],
  declarations: [QrcodeListComponent],
  providers: [ QrcodeListService ],
})
export class QrcodeListModule { }
