import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public userInfo: Object = new Object();
  public navClose;
  public toggleDescTip = '点击关闭导航菜单';
  constructor(public myService: MainService) { }

  ngOnInit() {
    this.getUserInfo();
  }


  toggleNav(obj) {
    this.navClose = !this.navClose;
    if (this.navClose) {
      this.toggleDescTip = "点击展开导航菜单";
    } else {
      this.toggleDescTip = "点击关闭导航菜单";
    }
  }

  /**
   * 获取登陆用户信息
   */
  getUserInfo = () => {
    this.userInfo = this.myService.getUserInfo();
    this.userInfo['append_time'] = this.myService.fieldTreate.dateFomate(this.userInfo['append_time'] * 1000);
  }

  /**
   * 首页按钮点击事件
   */
  backHomeBtn = (event) => {
    this.myService.backHome();
  }

  /**
   * 退出登陆按钮点击事件
   */
  logoutBtn = (event) => {
    this.myService.logout();
  }
}
