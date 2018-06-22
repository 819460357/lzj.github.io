import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userName;
  public password;
  constructor(public myService: LoginService) { }

  ngOnInit() {
  }

  /**
   * 登陆按钮点击事件
   */
  loginBtn = (event) => {
    if(!this.userName || this.userName.toString().trim() == '') {
     return this.myService.alert.show('warn', '请输入账号');
    }
    if(!this.password || this.password.toString().trim() == '') {
     return this.myService.alert.show('warn', '请输入密码');
    }

    this
      .myService
      .login({userName: this.userName, password: this.password});
  }

}
