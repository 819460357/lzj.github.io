import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrcodeAddRoutingModule } from './qrcode-add-routing.module';
import { QrcodeAddComponent } from './qrcode-add.component';
import { QrcodeAddService } from './qrcode-add.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QrcodeAddRoutingModule
  ],
  declarations: [QrcodeAddComponent],
  providers: [ QrcodeAddService ]
})
export class QrcodeAddModule { }
