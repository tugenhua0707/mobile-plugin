import css from './index.styl'
$(function(){
    // 页数
    var page = 0;
    // 每页展示10个json
    var size = 10;
    // dropload
    $('.content').dropload({
      scrollArea : window,
      domUp : {
        domClass   : 'dropload-up',
        domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
        domUpdate  : '<div class="dropload-update">↑释放更新</div>',
        domLoad    : '<div class="dropload-load"><span class="loading"></span>数据正在加载中...</div>'
      },
      domDown : {
        domClass   : 'dropload-down',
        domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
        domLoad    : '<div class="dropload-load"><span class="loading"></span>数据正在加载中...</div>',
        domNoData  : '<div class="dropload-noData">暂无数据</div>'
      },
      loadUpFunc : function(me){
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:7777/json/update.json',
            dataType: 'json',
            success: function(data){
                var result = '';
                for(var i = 0; i < data.length; i++){
                    result +=   '<a class="item opacity" href="'+data[i].link+'">'
                                    +'<img src="'+data[i].pic+'" alt="">'
                                    +'<h3>'+data[i].title+'</h3>'
                                    +'<span class="date">'+data[i].date+'</span>'
                                +'</a>';
                }
                // 为了测试，延迟1秒加载
                setTimeout(function(){
                    $('.lists').html(result);
                    console.log(me)
                    // 每次数据加载完，必须重置
                    me.resetload();
                    // 重置页数，重新获取loadDownFn的数据
                    page = 1;
                    // 解锁loadDownFn里锁定的情况
                    me.unlock();
                    me.noData(false);
                },1000);
            },
            timeout: 5000,
            error: function(xhr, type){
                alert('Ajax error!');
                // 即使加载出错，也得重置
                me.resetload();
            }
        });
      },
      loadDownFunc : function(me){
        page++;
        // 拼接HTML
        var result = '';

        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:7777/json/update.json',
            dataType: 'json',
            success: function(data){
                var arrLen = data.length;
                if(arrLen > 0){
                    for(var i=0; i< arrLen; i++){
                        result +=   '<a class="item opacity" href="'+data[i].link+'">'
                                        +'<img src="'+data[i].pic+'" alt="">'
                                        +'<h3>'+data[i].title+'</h3>'
                                        +'<span class="date">'+data[i].date+'</span>'
                                    +'</a>';
                    }
                // 如果没有数据
                }else{
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }
                // 为了测试，延迟1秒加载
                setTimeout(function(){
                    // 插入数据到页面，放到最后面
                    $('.lists').append(result);
                    // 每次数据插入，必须重置
                    me.resetload();
                    console.log(me.loading);
                },1000);
            },
            timeout: 5000,
            error: function(xhr, type){
                alert('Ajax error!');
                // 即使加载出错，也得重置
                me.resetload();
            }
        });
      },
      threshold : 50
    });
});
