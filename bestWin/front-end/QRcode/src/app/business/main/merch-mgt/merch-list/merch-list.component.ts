import { Component, OnInit } from '@angular/core';
import { MerchListService } from './merch-list.service';

@Component({
  selector: 'app-merch-list',
  templateUrl: './merch-list.component.html',
  styleUrls: ['./merch-list.component.scss']
})
export class MerchListComponent implements OnInit {

  constructor(public myServie: MerchListService) { }

  ngOnInit() {
  }

  /**
   * 添加二维码点击事件
   * @param $event
   */
  public addQrCodeBtn =($event) => {
    this.myServie.addQrCode();
  }

}
