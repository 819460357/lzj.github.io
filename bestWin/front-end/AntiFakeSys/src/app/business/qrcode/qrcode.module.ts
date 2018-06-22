import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrcodeRoutingModule } from './qrcode-routing.module';
import { QrcodeComponent } from './qrcode.component';
import { QrcodeService } from './qrcode.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QrcodeRoutingModule,
    CarouselModule.forRoot()
  ],
  declarations: [QrcodeComponent],
  providers: [ QrcodeService ],
})
export class QrcodeModule { }
