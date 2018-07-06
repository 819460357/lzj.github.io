import { Component, OnInit } from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { QrcodeService } from './qrcode.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['qrcode.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: true, showIndicators: true } }
  ]
})
export class QrcodeComponent implements OnInit {
  public merch_id;
  public code;
  public codeInfo: Object = new Object();
  constructor(public myService: QrcodeService, public activeRoute: ActivatedRoute) {
    this.getQueryParamsEvent();
  }

  ngOnInit() {
    this.getCodeInfo();
  }

  /**
   * 获取防伪码信息
   */
  getCodeInfo = () => {
    if(!this.merch_id) return;

    this
      .myService
      .getMerchInfo({merch_id: this.merch_id, code: this.code})
      .then(res => {
        this.myService.title.setTitle('查询结果_' + res['data'].brand_name);
        this.codeInfo = res['data'];
        Date.prototype['format'] = function(format) {
          var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
          };
          if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
          }
          for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
          }
          return format;
        };

        this.codeInfo['first_read_time'] = new Date(this.codeInfo['first_read_time'] * 1000)['format']('yyyy-MM-dd hh:mm:ss');
      })
      .catch(res => {

      });
  }

  /**
   * 获取参数
   */
  getQueryParamsEvent = () => {
    this.activeRoute.queryParams.subscribe(params => {
      this.merch_id = params['merch_id'];
      this.code = params['code'];
    });
  };

}
