import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from'rxjs/observable';
import { api } from '../../config/http.config';
import { LocalStorageService } from '../storage/local.storage.service';

@Injectable()
export class CHttpInterceptor implements HttpInterceptor {

  constructor(private localStotrage: LocalStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let userInfo = this.localStotrage.getObject('userInfo');
    if(userInfo.hasOwnProperty('token')) {
      let token = userInfo.token;
      let body = req.body;
      body['token'] = token;
      req.clone({body: body});
    }

    return next.handle(req);
    // return next.handle(req).map((event) => {
    //   //  TODO 后期可用于结果预处理
    //   return event;
    // });
  }
}
