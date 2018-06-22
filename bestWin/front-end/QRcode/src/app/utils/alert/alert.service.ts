import { Injectable } from '@angular/core';
import { AlertComponent } from './alert.component';
import { DialogService } from '../../utils/dialog/dialog.service';

@Injectable()
export class AlertService {

  constructor(private dialog: DialogService) {}

  /**
   * 自定义alert提醒框
   * @param type
   * @param msg
   */
  show = (type: string = 'warn', msg: string = '系统错误！') => {
    if(this.dialog.getDialogById('alert')) return;
    this.dialog.openDialog(AlertComponent,  'auto', '15rem', {type: type, msg: msg, dialogRef: this.dialog.dialogRef}, null, null, 'alert');

    if(type == 'success') {
      setTimeout(() => {
        this.dialog.dialogRef.close();
      }, 1000);
    }

  }

}
