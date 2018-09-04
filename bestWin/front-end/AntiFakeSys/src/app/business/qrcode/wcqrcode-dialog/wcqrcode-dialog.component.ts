import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-wcqrcode-dialog',
  templateUrl: './wcqrcode-dialog.component.html',
  styleUrls: ['./wcqrcode-dialog.component.scss']
})
export class WcqrcodeDialogComponent implements OnInit {

  public img: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<WcqrcodeDialogComponent>) {
    this.img = data.img;
  }

  ngOnInit() {
  }

  /**
   * 关闭按钮
   */
  closeBtn = (event) => {
    this.dialogRef['close']({action: 'cancel'});
  }
}
