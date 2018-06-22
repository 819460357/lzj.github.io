import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpUtilModule } from '../http-util/http-util.module';
import { AlertModule } from '../alert/alert.module';
import { StorageModule } from '../storage/storage.module';

@NgModule({
  imports: [
    CommonModule,
    HttpUtilModule,
    AlertModule,
    StorageModule,
  ],
  exports: [
    HttpUtilModule
  ],
  declarations: []
})
export class ShareModule { }
