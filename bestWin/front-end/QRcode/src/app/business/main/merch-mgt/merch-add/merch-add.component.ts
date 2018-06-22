import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MerchAddService } from './merch-add.service';

@Component({
  selector: 'app-merch-add',
  templateUrl: './merch-add.component.html',
  styleUrls: ['./merch-add.component.scss']
})
export class MerchAddComponent implements OnInit {
  public merchId;
  public name;
  public title;
  public addr;
  public tel;
  public wechat;
  public qrCode;
  public qrCodeUrl;
  public imgs: Array<OnInit> = new Array();

  constructor(public myService: MerchAddService, public activeRoute: ActivatedRoute) {
    this.getQueryParamsEvent();
  }

  ngOnInit() {
  }

  /**
   * 二维码上传
   */
  public uploadQRCode = (event) => {
    let files = event.target.files;
    if(files.length == 0) return;
    this
      .myService
      .qrCodeUpload(files)
      .then(res => {
        this.qrCode = res['data']['url'];
        this.qrCodeUrl = res['data']['imgUrl'];
        console.log(this.qrCodeUrl);
      })
      .catch(err => {

      })
  }

  /**
   * 商户主图上传
   */
  public uploadImg = (event) => {
    let files = event.target.files;
    if(files.length == 0) return;
    this
      .myService
      .imgUpload(files)
      .then(res => {
        this.imgs = this.imgs.concat(res['data']['imgs']);
      })
      .catch(err => {

      })
  }

  /**
   * 商户添加按钮点击事件
   */
  public addMerchBtn = (event) => {
    let body = new Object();
    body['name'] = this.name;
    body['title'] = this.title;
    body['addr'] = this.addr;
    body['tel'] = this.tel;
    body['wechat'] = this.wechat;
    body['qrCode'] = this.qrCode;
    body['imgs'] = new Array();
    for (let i = 0; i < this.imgs.length; i ++ ) {
      body['imgs'].push(this.imgs[i]['url']);
    }
    if(!this.merchId) {
      this
        .myService
        .addMerch(body)
        .then(res => {
          this.merchId = res['data']['id'];
        })
        .catch(err => {

        });
    } else {
      body['id'] = this.merchId;
      this
        .myService
        .editMerch(body)
        .then(res => {
        })
        .catch(err => {

        });
    }


  }

  /**
   * 获取商户详细信息
   */
  public getMerchInfo = () => {
    this
      .myService
      .getMerchInfo({id: this.merchId})
      .then(res => {
        this.name = res['data']['name'];
        this.title = res['data']['title'];
        this.addr = res['data']['addr'];
        this.tel = res['data']['tel'];
        this.wechat = res['data']['wechat'];
        this.qrCode = res['data']['qr_code'];
        this.qrCodeUrl =  res['data']['qr_code_url'];
        this.imgs = res['data']['imgs'];
      })
      .catch(err => {

      });
  }


  /**
   * 获取参数
   */
  getQueryParamsEvent = () => {
    this.activeRoute.queryParams.subscribe(params => {
      if(params.hasOwnProperty('id')) {
        this.merchId = params['id'];
        this.getMerchInfo();
      }
    });
  };

  /**
   * 删除图片点击事件
   */
  delImgBtn = (event, index) => {
    this.imgs.splice(index, 1);
  }


}
