import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpUtilService } from '../../utils/http-util/http-util.service';
import { AlertService } from '../../utils/alert/alert.service';
import { api } from '../../config/http.config';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogService } from '../../utils/dialog/dialog.service';
import { QrcodeDialogComponent } from './qrcode-dialog/qrcode-dialog.component';
import { WcqrcodeDialogComponent } from './wcqrcode-dialog/wcqrcode-dialog.component';

@Injectable()
export class QrcodeService {

  constructor(public http: HttpUtilService, public alert: AlertService, private sanitizer: DomSanitizer, public title: Title, public dialog: DialogService) { }


  /**
   * 获取商户详情信息
   */
  getMerchInfo = (body) => {
    return new Promise((resolve, reject) => {
      this
        .http
        .post(api.getCodeInfo, body)
        .subscribe(
          (response) => {
            if(response.code != 0) {

              response.code >= -400106 && response.code <= -400101
                ?
                this.alert.show('error', 'token过期,请选择注销重新登录！')
                :
                this.alert.show('error', response.msg);
              return reject(response);
            }
            response['data']['qr_code'] = response['data']['qr_code'] ?  this.sanitizer.bypassSecurityTrustResourceUrl(api.domainName + response['data']['qr_code']) : response['data']['qr_code'];
            response['data']['wc_img'] =  response['data']['wc_img'] ? this.sanitizer.bypassSecurityTrustResourceUrl(api.domainName + response['data']['wc_img']) : response['data']['wc_img'];
            for (let i = 0; i < response['data']['imgs'].length; i++) {
              // response['data']['imgs'][i]['url'] = this.sanitizer.bypassSecurityTrustResourceUrl(api.domainName + response['data']['imgs'][i]['url']);
              response['data']['imgs'][i]['url'] = api.domainName + response['data']['imgs'][i]['url'];
            }
            return resolve(response);
          },
          (err) => {
            this.alert.show('error',  err.toString() || '系统错误！');
            return;
          }
        );
    });
  }

  /**
   * 查看微信
   */
  viewQrcode = (body) => {
    this.dialog.openDialog(QrcodeDialogComponent, '14rem', '14rem', body);
  }
  /**
   * 查看公众号
   */
  vieWcQrcode = (body) => {
    this.dialog.openDialog(WcqrcodeDialogComponent, '14rem', '14rem', body);
  }
}
