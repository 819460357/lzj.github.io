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
  public official_website;
  public qrCode;
  public qrCodeUrl;
  public wcQrcode;
  public wcQrcodeUrl;
  public fixed_line;
  public template = 1;
  public company_name;
  public company_address;
  public company_tel1;
  public company_tel2;
  public imgs: Array<OnInit> = new Array();
  public support_tag = 1;
  public selectList: Array<Object> = [
    {
      name: '是',
      value: 1
    },
    {
      name: '否',
      value: 0
    }
  ];
  public qrCodeInput;
  public wcQrCodeInput;

  constructor(public myService: MerchAddService, public activeRoute: ActivatedRoute) {
    this.getQueryParamsEvent();
  }

  ngOnInit() {
  }

  /**
   * 二维码上传
   */
  public uploadQRCode = (event) => {
    return new Promise((resolve, reject) => {
      console.log(event);
      let files = event.target.files;
      if (files.length == 0) return;
      this
        .myService
        .qrCodeUpload(files)
        .then(res => {
          this.qrCode = res['data']['url'];
          this.qrCodeUrl = res['data']['imgUrl'];
          console.log(this.qrCodeUrl);
        })
        .catch(err => {
          return reject(err);
        })
    })
      .catch(err => {
        console.log(err);
      });
  }

  public uploadWcQRCode = (event) => {
    let files = event.target.files;
    if (files.length == 0) return;
    this
      .myService
      .qrCodeUpload(files)
      .then(res => {
        this.wcQrcode = res['data']['url'];
        this.wcQrcodeUrl = res['data']['imgUrl'];
      })
      .catch(err => {

      })
  }

  /**
   * 商户主图上传
   */
  public uploadImg = (event) => {
    let files = event.target.files;
    if (files.length == 0) return;
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
    // body['title'] = this.title;
    body['addr'] = this.addr;
    body['tel'] = this.tel;
    body['wechat'] = this.wechat;
    body['qr_code'] = this.qrCode;
    body['wc_img'] = this.wcQrcode;
    body['fixed_line'] = this.fixed_line;
    body['support_tag'] = this.support_tag;
    body['imgs'] = new Array();
    body['official_website'] = this.official_website;
    body['template'] = this.template;
    body['company_name'] = this.company_name;
    body['company_address'] = this.company_address;
    body['company_tel1'] = this.company_tel1;
    body['company_tel2'] = this.company_tel2;
    for (let i = 0; i < this.imgs.length; i++) {
      body['imgs'].push(this.imgs[i]['url']);
    }
    if (!this.merchId) {
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
      .getMerchInfo({ id: this.merchId })
      .then(res => {
        this.name = res['data']['name'];
        // this.title = res['data']['title'];
        this.addr = res['data']['addr'];
        this.tel = res['data']['tel'];
        this.wechat = res['data']['wechat'];
        this.official_website = res['data']['official_website'];
        this.qrCode = res['data']['qr_code'];
        this.wcQrcode = res['data']['wc_img'];
        this.fixed_line = res['data']['fixed_line'];
        this.support_tag = res['data']['support_tag'];
        this.qrCodeUrl = res['data']['qr_code_url'];
        this.wcQrcodeUrl = res['data']['wc_img_url'];
        this.imgs = res['data']['imgs'];
        this.template = res['data']['template'] || 1;
        this.company_name = res['data']['company_name'];
        this.company_address = res['data']['company_address'];
        this.company_tel1 = res['data']['company_tel1'];
        this.company_tel2 = res['data']['company_tel2'];
      })
      .catch(err => {

      });
  }


  /**
   * 获取参数
   */
  getQueryParamsEvent = () => {
    this.activeRoute.queryParams.subscribe(params => {
      if (params.hasOwnProperty('id')) {
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

  /**
   * 删除微信二维码图片
   */
  delQrcode = (event) => {
    this.qrCode = '';
    this.qrCodeUrl = '';
    this.qrCodeInput = '';
  }

  /**
   * 删除公众号二维码
   */
  delWcQrcode = (event) => {
    this.wcQrcode = '';
    this.wcQrcodeUrl = '';
    this.wcQrCodeInput = '';
  }

  isImage(str) {
    var reg = /\.(png|jpg|gif|jpeg|webp)$/;
    return reg.test(str.changingThisBreaksApplicationSecurity);
  }


}
