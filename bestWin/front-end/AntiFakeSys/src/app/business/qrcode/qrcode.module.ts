import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrcodeRoutingModule } from './qrcode-routing.module';
import { QrcodeComponent } from './qrcode.component';
import { QrcodeService } from './qrcode.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DialogModule } from '../../utils/dialog/dialog.module';
import { QrcodeDialogModule } from './qrcode-dialog/qrcode-dialog.module';
import { WcqrcodeDialogModule } from './wcqrcode-dialog/wcqrcode-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QrcodeRoutingModule,
    CarouselModule.forRoot(),
    DialogModule,
    QrcodeDialogModule,
    WcqrcodeDialogModule
  ],
  declarations: [QrcodeComponent],
  providers: [ QrcodeService ],
})
export class QrcodeModule { }
