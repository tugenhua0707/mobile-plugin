
import ClipboardAction from './clipboard-action';
import Emitter from 'tiny-emitter';
import listen from 'good-listener';

class Clipboard extends Emitter {
  /*
   * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
   * @param {Object} options
   */
  constructor(trigger, options) {
    super();
    this.init(options);
    this.listenClick(trigger);
  }
  init(options = {}) {
    this.action = (typeof options.action === 'function') ? options.action : this.defaultAction;
    this.target = (typeof options.target === 'function') ? options.target : this.defaultTarget;
    this.text = (typeof options.text === 'function') ? options.text : this.defaultText;
  }
  listenClick(trigger) {
    this.listener = listen(trigger, 'click', (e) => this.onClick(e));
  }
  onClick(e) {
    const trigger = e.delegateTarget || e.currentTarget;
    if (this.clipboardAction) {
      this.clipboardAction = null;
    }
    this.clipboardAction = new ClipboardAction({
      action: this.action(trigger),
      target: this.target(trigger),
      text:   this.text(trigger),
      trigger: trigger,
      emitter: this
    })
  }
  /*
   * default action 
   * @param {Element} trigger
   */
  defaultAction(trigger) {
    return getAttributeValue('action', trigger);
  }
  /*
   * default target 
   * @param {Element} trigger
   */
   defaultTarget(trigger) {
     const selector = getAttributeValue('target', trigger);
     if (selector) {
      return document.querySelector(selector);
     }
   }
   /*
    * default text
    * *param {Element} trigger
    */
   defaultText(trigger) {
     return getAttributeValue('text', trigger);
   }
   /*
     destory
    */
   destory() {
    this.listener.destory();
    if (this.clipboardAction) {
      this.clipboardAction.destory();
    }
  }
}

/*
 * Helper function to attribute value
 * @param {String} suffix
 * @param {Element} element 
 */
function getAttributeValue(suffix, element) {
  const attribute = `data-clipboard-${suffix}`;
  if (!element.hasAttribute(attribute)) {
    return;
  }
  return element.getAttribute(attribute);
}

module.exports = Clipboard;