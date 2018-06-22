import { Injectable } from '@angular/core';
import { AlertService } from '../../../../utils/alert/alert.service';
import { api } from '../../../../config/http.config';
import { HttpUtilService } from '../../../../utils/http-util/http-util.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../utils/storage/local.storage.service';

@Injectable()
export class MerchListService {

  constructor(public alert: AlertService, private http: HttpUtilService, private router: Router, private localStorage: LocalStorageService) { }

  public addQrCode(merchId) {
    this.router.navigate(['main/addQrCode'], {queryParams: {id: merchId}});
  }

  public merchInfo(merchId) {
    this.router.navigate(['main/addMerch'], {queryParams: {id: merchId}});
  }

  /**
   * 商户列表
   */
  getMerchList = (body) => {
    return new Promise((resolve, reject) => {
      this
        .http
        .post(api.getMerchLIst, body)
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
   * token校验
   */
  validate(){
    this
      .http
      .post(api.validate, {})
      .subscribe(
        (response) => {
          if(response.code != 0) {
            return this.alert.show('error', response.msg);
          }
          if(!response['data']['alive']) {
            this.localStorage.remove('userInfo');
            return this.router.navigate(['login']);
          }
          return;
        },
        (err) => {
          this.alert.show('error',  err || '系统错误！');
          return;
        }
      );
  }

}
