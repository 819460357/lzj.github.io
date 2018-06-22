import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../utils/alert/alert.service';
import { HttpUtilService } from '../../../utils/http-util/http-util.service';
import { api } from '../../../config/http.config';
import { LocalStorageService } from '../../../utils/storage/local.storage.service';

@Injectable()
export class HomeService {

  constructor(public router: Router, public alert: AlertService, private http: HttpUtilService, private localStorage: LocalStorageService) {

  }

  /**
   * token校验
   */
  validate = () =>{
    console.log(this);
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

  /**
   * token校验
   */
  getHomeInfo = ()=>{
    return new Promise((resolve, reject) => {
      this
        .http
        .post(api.gethomeInfo, {})
        .subscribe(
          (response) => {
            if(response.code != 0) {
               this.alert.show('error', response.msg);
              return reject(response);
            }
            return resolve(response);
          },
          (err) => {
            this.alert.show('error',  err || '系统错误！');
            return reject(err);
          }
        );
    });
  }

}
