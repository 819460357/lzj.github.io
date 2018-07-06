import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpUtilService } from '../../utils/http-util/http-util.service';
import { AlertService } from '../../utils/alert/alert.service';
import { api } from '../../config/http.config';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class QrcodeService {

  constructor(public http: HttpUtilService, public alert: AlertService, private sanitizer: DomSanitizer, public title: Title) { }


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
            response['data']['qr_code'] = this.sanitizer.bypassSecurityTrustResourceUrl(api.domainName + response['data']['qr_code']);
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
}
