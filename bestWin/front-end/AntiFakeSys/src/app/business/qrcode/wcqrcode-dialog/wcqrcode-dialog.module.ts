import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WcqrcodeDialogComponent } from './wcqrcode-dialog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ WcqrcodeDialogComponent ],
  entryComponents: [ WcqrcodeDialogComponent ],
  declarations: [WcqrcodeDialogComponent]
})
export class WcqrcodeDialogModule { }
