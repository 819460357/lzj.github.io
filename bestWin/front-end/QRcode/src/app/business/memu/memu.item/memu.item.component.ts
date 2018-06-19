import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'c-treeview-memu',
  templateUrl: './memu.item.component.html',
  styleUrls: ['memu.item.component.scss']
})
export class MemuItemComponent implements OnInit {
  @Input() data;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  /**
   * 是否有子节点
   * 是否有子节点
   * @param item
   */
  isLeaf(item) {
    return !item.children || !item.children.length;
  }

  /**
   * 点击
   * @param item
   */
  itemClicked(item) {
    console.log('dd');
    if (!this.isLeaf(item)) {
      item.isExpend = !item.isExpend;
    } else {
      this.router.navigate([item.url]);
    }
  }

}
