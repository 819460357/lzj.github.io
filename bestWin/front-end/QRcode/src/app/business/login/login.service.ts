import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../utils/alert/alert.service';
import { HttpUtilService } from '../../utils/http-util/http-util.service';
import { api } from '../../config/http.config';
import { LocalStorageService } from '../../utils/storage/local.storage.service';

@Injectable()
export class LoginService {

  constructor(public router: Router, public alert: AlertService, private http: HttpUtilService, private localStorage: LocalStorageService) { }


  // /**
  //  * 登陆
  //  */
  // login = (body) => {
  //   this.router.navigate(['main/home']);
  // }

  /**
   * 获取站点信息
   */
  login(body){
    this
      .http
      .post(api.login, body)
      .subscribe(
        (response) => {
          if(response.code != 0) {
            return this.alert.show('error', response.msg);
          }
          this.localStorage.setObject('userInfo', response.data);
          return this.router.navigate(['main/home']);
        },
        (err) => {
          this.alert.show('error',  err || '系统错误！');
          return;
        }
      );
  }


}
