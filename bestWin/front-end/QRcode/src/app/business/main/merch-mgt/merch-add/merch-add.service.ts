import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../../utils/alert/alert.service';
import { api } from '../../../../config/http.config';
import { HttpUtilService } from '../../../../utils/http-util/http-util.service';
import { HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService } from '../../../../utils/storage/local.storage.service';

@Injectable()
export class MerchAddService {

  constructor(public alert: AlertService, private http: HttpUtilService, private sanitizer: DomSanitizer, public router: Router, private localStorage: LocalStorageService) { }

  /**
   * 二维码上传
   */
  qrCodeUpload = (fileArray) => {
    let  headers = new HttpHeaders();
    let  formData = new FormData();
    headers.append( 'Content-Type',  'multipart/form-data');
   for ( let i = 0; i < fileArray.length; i++) {
     formData.append('file' + i, fileArray[i]);
   }
    return new Promise((resolve, reject) => {
      this
        .http
        .post(api.imgUpload, formData, headers)
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
            let imgItem = {
              url: response['data']['urls'][0],
              imgUrl: this.sanitizer.bypassSecurityTrustResourceUrl(api.domainName + response['data']['urls'][0]),
            };
            response.data = imgItem;
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
   * 主图上传
   */
  imgUpload = (fileArray) => {
    let  headers = new HttpHeaders();
    let  formData = new FormData();
    headers.append( 'Content-Type',  'multipart/form-data');
    for ( let i = 0; i < fileArray.length; i++) {
      formData.append('file' + i, fileArray[i]);
    }
    return new Promise((resolve, reject) => {
      this
        .http
        .post(api.imgUpload, formData, headers)
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
            let imgs = new Array();
            for(let i = 0; i < response['data']['urls'].length; i ++) {
              let imgItem = {
                url: response['data']['urls'][i],
                imgUrl: this.sanitizer.bypassSecurityTrustResourceUrl(api.domainName + response['data']['urls'][i]),
              };
              imgs.push(imgItem);
            }
            response.data = {imgs: imgs};
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
   * 商户添加
   */
  addMerch = (body) => {
    return new Promise((resolve, reject) => {
      this
        .http
        .post(api.addMerch, body)
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

            this.alert.show('warn', '商户创建成功！');
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
   * 商户信息编辑
   */
  editMerch = (body) => {
    return new Promise((resolve, reject) => {
      this
        .http
        .post(api.editMerch, body)
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

            this.alert.show('warn', '商户信息修改成功！');
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

  /**
   * 获取商户详情信息
   */
  /**
   * 获取商户详情信息
   */
  getMerchInfo = (body) => {
    return new Promise((resolve, reject) => {
      this
        .http
        .post(api.getMerchInfo, body)
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
            if(response['data']['qr_code'] && response['data']['qr_code'].trim() != '') {
              response['data']['qr_code_url'] = api.domainName +  response['data']['qr_code'];
            }
            if(response['data']['wc_img'] && response['data']['wc_img'].trim() != '') {
              response['data']['wc_img_url'] = api.domainName +  response['data']['wc_img'];
            }
            let imgs = new Array();
            for(let i = 0; i < response['data']['imgs'].length; i ++) {
              let imgItem = {
                url: response['data']['imgs'][i]['url'],
                imgUrl: this.sanitizer.bypassSecurityTrustResourceUrl(api.domainName + response['data']['imgs'][i]['url']),
              };
              imgs.push(imgItem);
            }
            response['data']['imgs'] = imgs;
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
