import { Component, OnInit } from '@angular/core';
import { MerchListService } from './merch-list.service';

@Component({
  selector: 'app-merch-list',
  templateUrl: './merch-list.component.html',
  styleUrls: ['./merch-list.component.scss']
})
export class MerchListComponent implements OnInit {
  public merchList = new Array();
  constructor(public myServie: MerchListService) { }

  ngOnInit() {
    this.getMerchList();
  }

  /**
   * 添加二维码点击事件
   * @param $event
   */
  public addQrCodeBtn =($event, merchItem) => {
    this.myServie.addQrCode(merchItem['id']);
  }

  /**
   * 获取商户列表
   */
  public getMerchList = () => {
    this
      .myServie
      .getMerchList({})
      .then(res => {
        this.merchList = res['data']['list'];
      })
      .catch(err => {

      });
  }

  /**
   * 商户信息查看按钮点击事件
   */
  public merchInfoBtn = (event, merchItem) => {
    this.myServie.merchInfo(merchItem['id']);
  }

}
