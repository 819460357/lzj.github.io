import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import   'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";

@Injectable()
export class HttpUtilService {

  constructor(private httpClient: HttpClient) { }

  /**
   * post请求
   * @param url
   * @param body
   * @param options
   * @returns {Observable<ArrayBuffer>}
   */

  public post(url: string, body: any, options: any = {headers: {"content-type": "application/json"}}): Observable<any> {
    return this
      .httpClient
      .post(url, body, options);
  }

}
