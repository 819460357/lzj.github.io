import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QrcodeAddService } from './qrcode-add.service';
import { api } from '../../../../config/http.config';

@Component({
  selector: 'app-qrcode-add',
  templateUrl: './qrcode-add.component.html',
  styleUrls: ['./qrcode-add.component.scss']
})
export class QrcodeAddComponent implements OnInit {
  public merchId;
  public merchInfo: Object = new Object();
  public host;
  constructor(public myService: QrcodeAddService, public activeRoute: ActivatedRoute) {
    this.getQueryParamsEvent();
    this.host = api.frontDominName;
  }

  ngOnInit() {
    this.getMerchInfo();
  }

  /**
   * 获取商户详情
   */
  getMerchInfo = () => {
    this
      .myService
      .getMerchInfo({id: this.merchId})
      .then(res => {
        this.merchInfo = res['data'];
      })
      .catch(err => {

      });
  }

  /**
   * 获取参数
   */
  getQueryParamsEvent = () => {
      this.activeRoute.queryParams.subscribe(params => {
        this.merchId = params['id'];
      });
  };

  /**
   * 生成二维码按钮点击事件
   */
  addQrCodeBtn = (event) => {
    let body = new Object();
    body['merch_id'] = this.merchId;
    body['begin_code'] = this.merchInfo['total'];
    body['num'] = this.merchInfo['num'];
    if(this.merchInfo['from'] && this.merchInfo['from'].trim() != '') {
      body['from'] = this.merchInfo['from'];
    }
    if(this.merchInfo['to'] && this.merchInfo['to'].trim() != '') {
      body['to'] = this.merchInfo['to'];
    }
    if(this.merchInfo['desc'] && this.merchInfo['desc'].trim() != '') {
      body['desc'] = this.merchInfo['desc'];
    }
    this
      .myService
      .addQrCode(body)
      .then(res => {
        this.getMerchInfo();
      })
      .catch(err => {

      });
  }

}
