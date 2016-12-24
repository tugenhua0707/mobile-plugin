
## ClipBoard 复制或者剪切操作

#### clipboard 使用纯 JavaScript （无需 Flash）实现了复制浏览器内容到系统剪切板的功能，可以在浏览器和 Node 环境中使用。支持 Chrome 42+、Firefox 41+、IE 9+、Opera 29+。
### 优点
#### 1. 压缩后代码只有3kb，轻量级，性能好，不需要依赖于任何框架，不需要依赖flash
#### 2. 浏览器支持 Chrome 42+、Firefox 41+、IE 9+、Opera 29+

### 复制文本如下代码即可
<pre>
	<div>
      <p>复制文本</p>
      <input id='foo' value='http://www.baidu.com '/>
      <button class='btn' data-clipboard-target='#foo' style="border: 1px solid #333;">复制</button>
    </div>
</pre>
### 剪切文本如下代码即可
<pre>
	<div>
      <p>剪切文本</p>
      <textarea id='bar'>textarea</textarea>
      <button class='btn' data-clipboard-action='cut' data-clipboard-target='#bar'>剪切</button>
    </div>
</pre>

### 复制属性值 如下代码即可
<pre>
	<div>
      <p>复制属性值</p>
      <button class='btn' data-clipboard-text='data-text'>复制属性文本</button>
    </div>
</pre>
### 提供如下对外事件
<pre>
  var clipboard = new Clipboard('.btn');

  clipboard.on('success', function(e) {
    console.log('Action:', e.action);
    console.log('Text:', e.text);
    console.log('Trigger:', e.trigger);
    e.clearSelection();
  });

  clipboard.on('error', function(e) {
    console.log('Action:', e.action);
    console.log('Trigger:', e.trigger);
  });
</pre>

### 动态设置目标元素
<pre>
	<div>
      <p>动态设置一个目标元素</p>
      <button class='btn2' data-clipboard-action='cut'>动态设置目标元素</button>
      <textarea>textarea</textarea>
    </div>
    // 动态设置目标元素
	new Clipboard('.btn2', {
	  target: function(trigger) {
	    return trigger.nextElementSibling;
	  }
	})
</pre>

### 动态设置一个文本
<pre>
	<div>
	  <p>动态设置一个文本</p>
	  <button class='btn3' data-text='动态设置文本'>动态设置文本</button>
	</div>
	// 动态设置一个文本
	new Clipboard('.btn3', {
	  text: function(trigger) {
	    return trigger.getAttribute('data-text');
	  }
	})
</pre>