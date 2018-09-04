import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss']
})
export class QrcodeDialogComponent implements OnInit {
  public img: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<QrcodeDialogComponent>) {
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
