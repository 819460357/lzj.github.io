import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpUtilModule } from '../http-util/http-util.module';
import { AlertModule } from '../alert/alert.module';
import { StorageModule } from '../storage/storage.module';
import { FieldTreateModule } from '../field-treate/field-treate.module';

@NgModule({
  imports: [
    CommonModule,
    HttpUtilModule,
    AlertModule,
    StorageModule,
    FieldTreateModule,
  ],
  exports: [
    HttpUtilModule
  ],
  declarations: []
})
export class ShareModule { }
