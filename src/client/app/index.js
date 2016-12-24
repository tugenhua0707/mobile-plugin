import Clipboard from '../../../components/clipboard.js';
console.log(Clipboard);
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
// 动态设置目标元素
new Clipboard('.btn2', {
  target: function(trigger) {
    return trigger.nextElementSibling;
  }
})

// 动态设置一个文本
new Clipboard('.btn3', {
  text: function(trigger) {
    return trigger.getAttribute('data-text');
  }
})
