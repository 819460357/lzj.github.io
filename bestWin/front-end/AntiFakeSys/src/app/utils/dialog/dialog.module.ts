import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { DialogService } from './dialog.service';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    MatDialogModule
  ],
  providers: [DialogService],
})
export class DialogModule { }
