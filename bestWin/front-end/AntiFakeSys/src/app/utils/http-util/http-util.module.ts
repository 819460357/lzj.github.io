import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpUtilService } from './http-util.service';
import { CHttpInterceptor } from './http-interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [ HttpUtilService, {
    provide: HTTP_INTERCEPTORS,
    useClass: CHttpInterceptor,
    multi: true,
  }, ]
})
export class HttpUtilModule { }
