let timer = null
function Carousel (el, imgsUrl, Jsons) {
  if (el == null || imgsUrl == null || imgsUrl.length == 0) {
    console.log('请传入节点或图片数据');
    return;
  }
  this.el = el;
  this.imgsUrl = imgsUrl;
  this.timer = JSON.transitionTime || 800;
  this.intervalTime = Jsons.intervalTime || 5000;
  this.index = 1;
  this.animationMark = false;
  this.init();
}

Carousel.prototype.init = function () {
  // 动态添加一些css样式
  let cssStr = `.broadcastMe .broadcastMe-list {width: ${(this.imgsUrl.length + 2) * this.el.clientWidth}px;}.broadcastMe .broadcastMe-list .broadcastMe-item {width:${this.el.clientWidth}px;}`
  let styleNode = document.createElement('style');
  styleNode.innerText = cssStr;
  document.head.appendChild(styleNode);

  var html = `<div class="broadcastMe">
                <div class="broadcastMe-list" style="left:-${this.el.clientWidth}px">`;

  // 添加显示图片区域
  // 无缝轮播，收尾多加一张
  let temStr = '';
  // ToDo
  if (this.checkVideo(this.imgsUrl[this.imgsUrl.length - 1].imgSrc)) {
    temStr = `<div class="broadcastMe-item">
          <a href="${this.imgsUrl[this.imgsUrl.length - 1].linkHref == null ? "#" : this.imgsUrl[this.imgsUrl.length - 1].linkHref}">
          <video controls ><source src = "${this.imgsUrl[this.imgsUrl.length - 1].imgSrc}"></video>
          </a>
        </div>`
  } else {
    temStr = `<div class="broadcastMe-item">
          <a href="${this.imgsUrl[this.imgsUrl.length - 1].linkHref == null ? "#" : this.imgsUrl[this.imgsUrl.length - 1].linkHref}"><img src="${this.imgsUrl[this.imgsUrl.length - 1].imgSrc}" alt="轮播图图片-pawn"></a>
        </div>`
  }
  // let temStr = `<div class="broadcastMe-item">
  //       <a href="${this.imgsUrl[this.imgsUrl.length-1].linkHref==null?"#":this.imgsUrl[this.imgsUrl.length-1].linkHref}"><img src="${this.imgsUrl[this.imgsUrl.length-1].imgSrc}" alt="轮播图图片-pawn"></a>
  //     </div>`

  this.imgsUrl.map(item => {
    if (this.checkVideo(item.imgSrc)) {
      temStr += `<div class="broadcastMe-item">
                  <a href="${item.linkHref == null ? "#" : item.linkHref}">
                  <video controls><source src = "${item.imgSrc}"></video>
                  </a>
              </div>`
    } else {
      temStr += `<div class="broadcastMe-item">
                  <a href="${item.linkHref == null ? "#" : item.linkHref}"><img src="${item.imgSrc}" alt="轮播图图片-pawn"></a>
              </div>`
    }
    // temStr += `<div class="broadcastMe-item">
    //           <a href="${item.linkHref==null?"#":item.linkHref}"><img src="${item.imgSrc}" alt="轮播图图片-pawn"></a>
    //       </div>`
  })
  if (this.checkVideo(this.imgsUrl[0].imgSrc)) {
    temStr += `<div class="broadcastMe-item">
              <a href="${this.imgsUrl[0].linkHref == null ? "#" : this.imgsUrl[0].linkHref}">
              <video controls><source src = "${this.imgsUrl[0].imgSrc}"></video>
              </a>
            </div>`
  } else {
    temStr += `<div class="broadcastMe-item">
              <a href="${this.imgsUrl[0].linkHref == null ? "#" : this.imgsUrl[0].linkHref}"><img src="${this.imgsUrl[0].imgSrc}" alt="轮播图图片-pawn"></a>
            </div>`
  }
  // temStr += `<div class="broadcastMe-item">
  //           <a href="${this.imgsUrl[0].linkHref==null?"#":this.imgsUrl[0].linkHref}"><img src="${this.imgsUrl[0].imgSrc}" alt="轮播图图片-pawn"></a>
  //         </div>`
  html += temStr + "</div>";

  temStr = `<div class="broadcastMe-tool">
              <div class="broadcastMe-spot broadcastMe-spot-active"></div>`;
  // 添加下面小圆点
  for (let i = 1, len = this.imgsUrl.length; i < len; i++) {
    temStr += `<div class="broadcastMe-spot"></div>`;
  }
  html += temStr + "</div>"

  // 添加左右2边按钮
  temStr = `<div class="broadcastMe-btn broadcastMe-btn-left"><</div>
            <div class="broadcastMe-btn broadcastMe-btn-right">></div>`

  html += temStr;

  this.el.innerHTML += html + "</div>";

  // 调用绑定事件
  this.bindEvent();
  let video = document.querySelector('video');
  video.addEventListener('play', () => {
    console.log('开始播放了')
    clearInterval(timer);
  });

  video.addEventListener('ended', () => {
    console.log('开始播放了')
    timer = setInterval(autoPlay.bind(this), this.intervalTime);
  });


}

Carousel.prototype.bindEvent = function () {
  // 获取要用到的节点信息
  this.broadcastMe = this.el.getElementsByClassName('broadcastMe')[0];
  this.broadcastMeList = this.el.getElementsByClassName('broadcastMe-list')[0];
  this.broadcastMeTool = this.el.getElementsByClassName('broadcastMe-tool')[0];
  this.broadcastMeSpot = this.el.getElementsByClassName('broadcastMe-spot');
  this.broadcastMeBtnLeft = this.el.getElementsByClassName('broadcastMe-btn-left')[0];
  this.broadcastMeBtnRight = this.el.getElementsByClassName('broadcastMe-btn-right')[0];


  // 左右按钮 事件监听
  this.broadcastMeBtnLeft.addEventListener('click', () => {
    if (this.animationMark) return;
    this.index--;
    this.render();
  });
  this.broadcastMeBtnRight.addEventListener('click', () => {
    if (this.animationMark) return;
    this.index++;
    this.render();
  });

  // 下面小圆点点击事件监听
  this.broadcastMeTool.addEventListener('click', e => {
    let obj = e.target;
    if (obj.className != "broadcastMe-spot") return;
    this.spotClick(obj);
  })

    // 开启自动轮播
    = setInterval(autoPlay.bind(this), this.intervalTime);

  this.el.addEventListener("mouseover", () => {
    clearInterval(timer);
  })

  this.el.addEventListener("mouseout", () => {
    timer = setInterval(autoPlay.bind(this), this.intervalTime);
  })

  // 移动端手指滑动
  let stratPointX = 0;
  let offsetX = 0;
  this.el.addEventListener("touchstart", (e) => {
    // 清楚定时器，因为移动端不能监听到Mouseover时间
    clearInterval(timer);

    stratPointX = e.changedTouches[0].pageX;
    offsetX = this.broadcastMeList.offsetLeft;
    this.animationMark = true;
  })
  this.el.addEventListener("touchmove", (e) => {
    let disX = e.changedTouches[0].pageX - stratPointX;
    let left = offsetX + disX;

    this.broadcastMeList.style.transitionProperty = 'none';
    this.broadcastMeList.style.left = left + 'px';
  })
  this.el.addEventListener("touchend", () => {
    let left = this.broadcastMeList.offsetLeft;
    // 判断正在滚动的图片距离左右图片的远近，
    this.index = Math.round(-left / this.el.clientWidth);
    this.animationMark = false;
    // 开启定时器
    timer = setInterval(autoPlay.bind(this), this.intervalTime);

    this.render();
  })


  // 封装自动轮播
  function autoPlay () {
    if (this.animationMark) return;
    this.index++;
    this.render();
  }
}

// render => 根据index的值，渲染当前要显示的界面
Carousel.prototype.render = function () {
  if (this.animationMark) return;

  this.animationMark = true;
  // 修改broadcastMeList 的left值
  this.broadcastMeList.style.left = (-1) * this.el.clientWidth * this.index + 'px';
  this.broadcastMeList.style.transition = 'left ' + this.timer / 1000 + 's';

  setTimeout(() => {
    // 添加判断，防止出界
    if (this.index <= 0) {
      this.broadcastMeList.style.transitionProperty = 'none';
      this.index = this.imgsUrl.length;
      this.broadcastMeList.style.left = (-1) * this.el.clientWidth * this.index + 'px';
    } else if (this.index > this.imgsUrl.length) {
      this.broadcastMeList.style.transitionProperty = 'none';
      this.index = 1;
      this.broadcastMeList.style.left = (-1) * this.el.clientWidth * this.index + 'px';
    }
    this.animationMark = false;
  }, this.timer)

  this.renderSpot();
}

// renderSpot => 渲染最下面的小圆点
Carousel.prototype.renderSpot = function () {
  let flag = this.index;
  if (this.index <= 0) {
    flag = this.imgsUrl.length;
  } else if (this.index > this.imgsUrl.length) {
    flag = 1;
  }

  for (let i = 0, len = this.broadcastMeSpot.length; i < len; i++) {
    if (i == (flag - 1)) {
      this.broadcastMeSpot[i].className = "broadcastMe-spot broadcastMe-spot-active";
    } else {
      this.broadcastMeSpot[i].className = "broadcastMe-spot";
    }
  }
}

// spotClick => 下面小圆点点击事件
Carousel.prototype.spotClick = function (obj) {
  for (let i = 0, len = this.broadcastMeSpot.length; i < len; i++) {
    if (this.broadcastMeSpot[i] === obj) {
      this.index = i + 1;
      this.render();
      break;
    }
  }
}

Carousel.prototype.checkVideo = (url) => {
  if (/\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/.test(url)) {
    return false;
  }
  if (/\w*\.[mp4|rmvb|flv|mpeg|avi|...]/.test(url)) {
    return true;
  }
  return false;
}

// 如果是在vue的环境下使用，取消下面的注释
// module.exports = carousel;
