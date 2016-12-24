
import select from 'select';

class ClipboardAction {
  constructor(options) {
    this.init(options);
    this.bindEnv();
  }
  init(options) {
  	this.action = options.action;
  	this.emitter = options.emitter;
  	this.target = options.target;
  	this.text = options.text;
  	this.trigger = options.trigger;
  	this.selectedText = '';
  	if (this.text) {
  	  this.selectFake();
  	} else if (this.target) {
  	  this.selectTarget();
  	}
  }
  selectFake() {
  	const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
  	this.removeFake();
  	this.fakeElem = document.createElement('textarea');
  	this.fakeElem.style.fontSize = '12pt';
  	// Reset box model
  	this.fakeElem.style.border = '0';
  	this.fakeElem.style.padding = '0';
  	this.fakeElem.style.margin = '0';
  	// Move element out of screen horizontally
  	this.fakeElem.style.position = 'fixed';
  	this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
  	// Move Element to the same position vertitally
  	this.fakeElem.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px';
  	this.fakeElem.setAttribute('readonly', '');
  	this.fakeElem.value = this.text;

  	document.body.appendChild(this.fakeElem);
  	this.selectedText = select(this.fakeElem);
  	this.copyText(); 
  }
  removeFake() {
  	if(this.fakeHandler) {
  	  document.body.removeEventListener('click');
  	  this.fakeHandler = null;
  	}
  	if (this.fakeElem) {
  	  document.body.removeChild(this.fakeElem);
  	  this.fakeElem = null;
  	}
  }
  selectTarget() {
  	this.selectedText = select(this.target);
  	this.copyText();
  }
  copyText() {
  	let succeeded;
  	try {
  	  succeeded = document.execCommand(this.action);
  	} catch (err) {
  	  succeeded = false;
  	}
  	this.handleResult(succeeded);
  }
  handleResult(succeeded) {
  	if(succeeded) {
  	  this.emitter.emit('success', {
  	  	action: this.action,
  	  	text: this.selectedText,
  	  	trigger: this.trigger,
  	  	clearSelection: this.clearSelection.bind(this)
  	  });
  	} else {
  	  this.emitter.emit('error', {
  	  	action: this.action,
  	  	trigger: this.trigger,
  	  	clearSelection: this.clearSelection.bind(this)
  	  });
  	}
  }
  clearSelection() {
  	if(this.target) {
  	  this.target.blur();
  	}
    var selection = window.getSelection();
    selection.removeAllRanges();
  }
  set action (action = 'copy') {
  	this._action = action;
  	if(this._action !== 'copy' && this._action !== 'cut') {
  	  throw new Error('Invalid action value, use either copy or cut');
  	}
  }
  get action() {
  	return this._action;
  }
  /*
   * Sets the target property using an element
   * that will be have its content copied
   * @param {Element} target
   */
  set target(target) {
  	if (target !== undefined) {
  	  if(target && typeof target === 'object' && target.nodeType === 1) {
  	  	if(this.action === 'copy' && target.hasAttribute('disabled')) {
  	  	  throw new Error('Invalid target attribute ,please use readonly instead of disabled attribute');
  	  	}
  	  	if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
  	  	  throw new Error('Invalid target attribute you can\'t cut text from element with readonly or disabled attributes');
  	  	}
  	  	this._target = target;
  	  } else {
  	  	throw new Error('Invalid target value , use a valid Element');
  	  }
  	}
  }
  /*
   * Get the target property
   * @return {String | HTMLElement}
   */
  get target() {
  	return this._target;
  }
  destory() {
  	this.removeFake();
  }
  bindEnv() {
  	this.fakeHandler = document.body.addEventListener('click', () => this.removeFake());
  }
}
module.exports = ClipboardAction;