;(function($){
  'use strict';
  var win = window;
  var doc = document;
  var $win = $(win);
  var $doc = $(doc);

  $.fn.dropload = function(options) {
    return new MyDropLoad(this, options);
  }
  class MyDropLoad {
    constructor(element, options) {
      var me = this;
      me.$element = element;

      // 下拉刷新是否插入DOM
      me.upInsertDOM = false;
      // loading状态
      me.loading = false;

      // 是否锁定
      me.isLockUp = false;
      me.isLockDown = false;
      
      // 是否有数据
      me.isData = true;
      me._scrollTop = 0;
      me._threshold = 0;
      me.init(options); 
    }
    init(options) {
      var me = this;
      me.opts = $.extend({}, {

        scrollArea    :   me.$element,                                   // 滚动区域
        domUp : {                                                        // 上方的DOM
          domClass   :   'dropload-up',                                  
          domRefresh :   '<div class="dropload-refresh">↓下拉刷新</div>',
          domUpdate  :   '<div class="dropload-update">↑释放更新</div>',
          domLoad    :   '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        domDown : {                                                     // 下方DOM
          domClass   :  'dropload-down',
          domRefresh :  '<div class="dropload-refresh">↑上拉加载更多</div>',
          domLoad    :  '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
          domNoData  :  '<div class="dropload-noData">暂无数据</div>'
        },
        autoLoad : true,
        distance : 50,
        threshold : '',
        loadUpFunc : null,
        loadDownFunc : null 
      }, options);
      // 如果是加载更多的话， 事先是在下方插入DOM
      if (me.opts.loadDownFunc) {
        me.$element.append('<div class="'+me.opts.domDown.domClass+'">'+me.opts.domDown.domRefresh+'</div>');
        me.$domDown = $('.' +me.opts.domDown.domClass);
      }
      // 什么时候开始加载
      if (!!me.$domDown && me.opts.threshold === '') {
        // 默认滑到加载区2/3处时加载
        me._threshold = Math.floor(me.$domDown.height() * 1/3);
      } else {
        me._threshold = me.opts.threshold;
      }
      // 判断滚动区域
      if (me.opts.scrollArea === win) {
        me.$scrollArea = $win;
        // 获取滚动内容的高度
        me._scrollContentHeight = $doc.height();
        // 获取win显示区的高度
        me._scrollWindowHeight = doc.documentElement.clientHeight;
      } else {
        me.$scrollArea = me.opts.scrollArea;
        me._scrollContentHeight = me.$element[0].scrollHeight;
        me._scrollWindowHeight = me.$element.height();
      }
      fnAutoLoad(me);
      // 绑定触摸
      me.$element.on('touchstart', function(e) {
        if (!me.loading) {
          fnTouches(e);
          fnTouchstart(e, me);
        }
      });
      me.$element.on('touchmove', function(e) {
        if (!me.loading) {
          fnTouches(e);
          fnTouchmove(e, me);
        }
      });
      me.$element.on('touchend', function(){
        if (!me.loading) {
          fnTouchend(me);
        }
      });
      // 滚动加载更多
      me.$scrollArea.on('scroll', function(){
        me._scrollTop = me.$scrollArea.scrollTop();
        
        // 滚动页面触发加载数据 条件是 = 可滚动内容的高度 - 多少距离进行滚动 <= 显示区域的高度 + 滚动的top
        if (me.opts.loadDownFunc && !me.loading && !me.isLockDown && (me._scrollContentHeight - me._threshold) <= (me._scrollWindowHeight + me._scrollTop)) {
          loadDown(me);
        }
      });
    }
    // 锁定
    lock(direction) {
      var me = this;
      // 如果不指定方向
      if (direction === undefined) {
        // 如果操作方向向上
        if (me.direction === 'up') {
          // 锁定下方
          me.isLockDown = true;
        } else if(me.direction === 'down') {
          // 锁定上方
          me.isLockUp = true;
        } else {
          me.isLockUp = true;
          me.isLockDown = true;
        }
      } else {
        if (direction === 'up') {
          // 锁定上方
          me.isLockUp = true;
        } else if(direction === 'down') {
          // 锁定下方
          me.isLockDown = true;
          // 解决tab效果的bug， 当滑动到下面时候，再滑动上去点tab项，direction = down, 有bug，需要重置
          me.direction = 'up';
        }
      };
    }
    // 解锁
    unlock() {
      this.isLockUp = false;
      this.isLockDown = false;
      // 解决tab效果的bug， 当滑动到下面时候，再滑动上去点tab项，direction = down, 有bug，需要重置
      this.direction = 'up';
    }
    // 无数据
    noData(flag) {
      if (flag === undefined || flag === true) {
        this.isData = false;
      } else if (flag === false) {
        this.isData = true;
      }
    }
    // 重置
    resetload() {
      var me = this;
      if (this.direction === 'down' && this.upInsertDOM) {
        this.$domUp.css({'height': '0'}).on('webkitTransitionEnd mozTransitionEnd transitionend',function() {
          me.loading = false;
          me.upInsertDOM = false;
          $(this).remove();
          fnRecoverContentHeight(me);
        })
      } else if(this.direction === 'up') {
        this.loading = false;
        // 如果有数据
        if (this.isData) {
          // 加载区修改样式
          this.$domDown.html(this.opts.domDown.domRefresh);
          fnRecoverContentHeight(this);
          fnAutoLoad(this);
        } else {
          // 如果没有数据
          this.$domDown.html(this.opts.domDown.domNoData);
        }
      }
    }
  }
  function fnTouches(e) {
    if (!e.touches) {
      e.touches = e.originalEvent.touches;
    } 
  }
  // touchstart
  function fnTouchstart(e, me) {
    me._startY = e.touches[0].pageY;
    // 记住触摸的scrollTop的值
    me.touchScrollTop = me.$scrollArea.scrollTop();

  }
  // touchmove 判断是下拉还是上拉 下拉 direction = down 否则 上拉 direction = up
  function fnTouchmove(e, me) {
    me._curY = e.touches[0].pageY;
    me._moveY = me._curY - me._startY;

    if (me._moveY > 0) {
      me.direction = 'down';
    } else {
      me.direction = 'up';
    }
    var _absMoveY = Math.abs(me._moveY);
    

    // 上方加载 下拉效果
    if (me.opts.loadUpFunc && me.touchScrollTop <= 0 && me.direction === 'down' && !me.isLockUp) {
      e.preventDefault();
      
      // 如果加载区没有dom节点的话， 动态生成一个
      if (!me.upInsertDOM) {
        me.$element.prepend('<div class="'+me.opts.domUp.domClass+'"></div>');
        me.upInsertDOM = true;
      }
      me.$domUp = $('.' +me.opts.domUp.domClass);

      fnTransition(me.$domUp, 0);
      // 下拉效果
      if (_absMoveY <= me.opts.distance) {
        me._offsetY = _absMoveY;
        me.$domUp.html(me.opts.domUp.domRefresh);
      } else if(me.opts.distance < _absMoveY && _absMoveY <= me.opts.distance * 2) {
        // 指定的距离 < 下拉距离 < 指定距离*2  
        me._offsetY = me.opts.distance + (_absMoveY - me.opts.distance) * 0.5;
        me.$domUp.html(me.opts.domUp.domUpdate);
      } else {
        // 下拉距离 > 指定距离 * 2
        me._offsetY = me.opts.distance + me.opts.distance * 0.5 + (_absMoveY - me.opts.distance * 2) * 0.2;
      }
      me.$domUp.css({'height': me._offsetY});
    }
  }
  // touchend 
  function fnTouchend(me) {
    var _absMoveY = Math.abs(me._moveY);
    if (me.opts.loadUpFunc && me.touchScrollTop <= 0 && me.direction === 'down' && !me.isLockUp) {
      fnTransition(me.$domUp, 300);
      if (_absMoveY > me.opts.distance) {
        me.$domUp.css({'height': me.$domUp.children().height()});
        me.$domUp.html(me.opts.domUp.domLoad);
        me.loading = true;
        me.opts.loadUpFunc(me);
      } else {
        me.$domUp.css({'height': 0}).on('webkitTransitionEnd mozTransitionEnd transitionend', function(){
          me.upInsertDOM = false;
          $(this).remove();
        });
      }
      me._moveY = 0;
    }
  }
  // 如果文档的高度不大于窗口的高度，数据较少，自动加载下方的数据
  function fnAutoLoad(me) {
    if (me.opts.loadDownFunc && me.opts.autoLoad) {
      if((me._scrollContentHeight - me._threshold) <= me._scrollWindowHeight) {
        loadDown(me);
      }
    }
  }
  // 重新获取文档的高度
  function fnRecoverContentHeight(me) {
    if (me.opts.scrollArea === win) {
      me._scrollContentHeight = $doc.height();
    } else {
      me._scrollContentHeight = me.$element[0].scrollHeight;
    }
  }
  // 加载更多数据
  function loadDown(me) {
    me.direction = 'up';
    me.$domDown.html(me.opts.domDown.domLoad);
    me.loading = true;
    me.opts.loadDownFunc(me);
  }
  // css过渡
  function fnTransition(dom, num) {
    dom.css({
      '-webkit-transition': 'all ' + num + 'ms',
      'transition': 'all ' + num + 'ms'
    })
  }
})(window.Zepto);