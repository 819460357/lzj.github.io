import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {

  constructor(public router: Router) { }


  /**
   * 登陆
   */
  login = (body) => {
    this.router.navigate(['main/home']);
  }

}
