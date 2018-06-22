import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material";
@Injectable()
export class DialogService {
  public dialogRef: any;

  public animal: string;
  public name: string;
  constructor(private dialog: MatDialog) {
  }

  public openDialog(component, height = '250px', width = '250px', data = {}, x = null, y = null, id = null): void {
    let position = new Object();
    let config = { height: height, width: width, data: data,};
    if(x) {
      position['left'] = x;
    }
    if(y) {
      position['top'] = y;
    }
    if(id) {
      config['id'] = id;
    }
    if(Object.keys(position).length > 0) {
      config['position'] = position;
    }
    this.dialogRef = this.dialog['open'](component, config);
  };

  public getDialogById(id) {
    return this.dialog.getDialogById(id);
  }

  public dialogEvent(){
    return this.dialogRef.afterClosed();
  };


}
