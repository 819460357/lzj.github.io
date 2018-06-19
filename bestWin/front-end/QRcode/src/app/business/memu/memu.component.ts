import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'c-main-memu',
  templateUrl: 'memu.component.html',
  styleUrls: ['memu.component.scss'],
})
export class MenuComponent implements OnInit {
//输入数据
  @Input() data;
  //所有数据
  private  allData;

  //搜索文本
  searchTxt:string='';

  //搜索隐藏
  searchMsgHidden:boolean=true;

  constructor() { }

  ngOnInit() {
    this.allData=this.data;
  }

  /**
   * 是否有子节点
   * @param item
   */
  isLeaf(item){
    return !item.children || !item.children.length;
  }

  /**
   * 查询输入
   * @param event
   */
    memuSearchTxt(event){
    this.searchTxt=event.target.value;
  }

  /**
   * 点击
   * @param item
   */
  itemClicked(item){
    if(!this.isLeaf(item)) {
      for(let obj of this.data){
        if(obj.id!=item.id){
          obj.isExpend=false;
        }
      }
      item.isExpend = !item.isExpend;
    }
  }


  /**
   * 查询菜单
   */
  searchMenu(){
    console.log('dddd');
    let tempData=this.allData;
    this.searchTxt=this.searchTxt.trim();
    this.searchMsgHidden=true;

    if(''!=this.searchTxt){
      let keyWord = new RegExp(this.searchTxt);
      let menuList=new Array<Object>();
      let menuIdList=new Array<string>();

      for(let item of tempData){
        this.searchItem(item,menuList,menuIdList,keyWord);
      }
      if(menuList.length>0){
        this.data=menuList;
      }else{
        this.searchMsgHidden=false;
      }

    }else{
      this.data=this.allData;
    }
  }

  /**
   * 查询子菜单
   * @param item
   * @param menuList
   */
  searchItem(item,menuList:Array<Object>,menuIdList:Array<string>,keyWord:RegExp){
    item.isExpend=false;
    //关键字匹配，并且不在列表中的
    if((item.hasOwnProperty('name') && item.name.match(keyWord) || ( item.hasOwnProperty('keyWord') && item.keyWord.match(keyWord))) && !this.checkSearchMenuIdExists(item.id,menuIdList)){
      menuList.push(item);
      this.pushSearchMenu(item,menuIdList);
    }

    //存在子菜单的，递归子菜单
    let itemChildren=item.children;
    if(itemChildren && itemChildren.length>0){
      for(let subItem of itemChildren){
        this.searchItem(subItem,menuList,menuIdList,keyWord);
      }
    }

  }

  /**
   * 添加查询的菜单
   * @param item
   * @param menuIdList
   */
  pushSearchMenu(item,menuIdList:Array<string>){
    menuIdList.push(item.id);
    let itemChildren=item.children;
    if(itemChildren && itemChildren.length>0){
      for(let subItem of itemChildren){
        this.pushSearchMenu(subItem,menuIdList);
      }
    }
  }

  /**
   *
   * @param id 检查菜单id是否存在
   * @param menuIdList
   */
  checkSearchMenuIdExists(id,menuIdList:Array<string>){
    for(let menuId of menuIdList){
      if(menuId==id){
        return true;
      }
    }

    return false;
  }
}
