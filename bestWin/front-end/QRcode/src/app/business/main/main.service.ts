import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../utils/storage/local.storage.service';
import { FieldTreateService } from '../../utils/field-treate/field-treate.service';
import { Router } from '@angular/router';
import { AlertService } from '../../utils/alert/alert.service';
import { HttpUtilService } from '../../utils/http-util/http-util.service';
import { api } from '../../config/http.config';

@Injectable()
export class MainService {

  constructor(private localStorage: LocalStorageService, public fieldTreate: FieldTreateService, private router: Router, public alert: AlertService, private http: HttpUtilService) { }

  getUserInfo() {
    let userInfo = this.localStorage.getObject('userInfo');
    return userInfo;
  }

  backHome() {
    this.router.navigate(['main/home']);
  }

  /**
   * 获取站点信息
   */
  logout(){
    this
      .http
      .post(api.logout, {})
      .subscribe(
        (response) => {
          this.localStorage.remove('userInfo');
          return this.router.navigate(['login']);
        },
        (err) => {
          this.localStorage.remove('userInfo');
          return this.router.navigate(['login']);
        }
      );
  }


}
