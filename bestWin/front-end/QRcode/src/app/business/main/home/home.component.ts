import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public info: Object = new Object();
  constructor(public myService: HomeService) {
    this.myService.validate();
  }

  ngOnInit() {
    this.getHomeInfo();
  }

  /**
   * 获取主页信息
   */

  getHomeInfo = () => {
    this
      .myService
      .getHomeInfo()
      .then(res => {
        this.info = res['data'];
      })
      .catch(err => {
      });
  }

}
