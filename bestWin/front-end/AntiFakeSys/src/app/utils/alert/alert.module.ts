import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule } from '@angular/forms'
import { AlertComponent } from './alert.component';
import { AlertService } from './alert.service';
import { DialogModule } from '../dialog/dialog.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule
  ],
  exports: [
    AlertComponent
  ],
  entryComponents: [
    AlertComponent
  ],
  declarations: [AlertComponent],
  providers: [ AlertService ]
})
export class AlertModule { }
