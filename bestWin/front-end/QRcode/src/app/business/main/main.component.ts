import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  navClose;
  toggleDescTip = '点击关闭导航菜单';

  constructor() { }

  ngOnInit() {
  }


  toggleNav(obj) {
    this.navClose = !this.navClose;
    if (this.navClose) {
      this.toggleDescTip = "点击展开导航菜单";
    } else {
      this.toggleDescTip = "点击关闭导航菜单";
    }
  }
}
