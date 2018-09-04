import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeDialogComponent } from './qrcode-dialog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ QrcodeDialogComponent ],
  entryComponents: [ QrcodeDialogComponent ],
  declarations: [QrcodeDialogComponent]
})
export class QrcodeDialogModule { }
