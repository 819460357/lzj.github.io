import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public myService: LoginService) { }

  ngOnInit() {
  }

  /**
   * 登陆按钮点击事件
   */
  loginBtn = (event) => {
    this
  }

}
