(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
function __addNamespace(scope, obj){for(k in obj){if(!scope[k]) scope[k] = {};__addNamespace(scope[k], obj[k])}};
__addNamespace(this, {"slikland":{"erlik":{"ui":{"image":{}},"core":{},"plugins":{"align":{},"list":{},"format":{},"media":{}}}}});
/**
EventDispatcher class for handling and triggering events.
@class EventDispatcher
 */
var EventDispatcher;
EventDispatcher = (function() {
  function EventDispatcher() {
    this._triggerStacked = __bind(this._triggerStacked, this);
    this.trigger = __bind(this.trigger, this);
  }
  EventDispatcher.prototype._events = null;
  /**
  	Add a event listener.
  	@method on
  	@param {String} event Event name.
  	@param {function} handler A callback function to handle the event.<br>
  	The callback function can receive 1 or 2 parameters. The first parameter is the event data itself and the second parameter is the custom data of the triggering event.
  	@example
  		function someEventHandler(e, data)
  		{
  			console.log(e); // Returns event data with it's type and target/currentTarget set to the scope
  			console.log(data); // If the triggering event has any custom data
  		}
  		var ed = new EventDispatcher()
  		ed.on('someEvent', someEventHandler);
   */
  EventDispatcher.prototype.on = function(p_event, p_handler) {
    if (!this._events) {
      this._events = {};
    }
    if (!this._events[p_event]) {
      this._events[p_event] = [];
    }
    if (!(__indexOf.call(this._events[p_event], p_handler) >= 0)) {
      return this._events[p_event].unshift(p_handler);
    }
  };
  /**
  	Remove an event listener.
  	**BEWARE**
  	> Calling this method without a handler will remove all listeners attached to this event.
  	> If calling without the event name, will remove all listeners attached to this instance.
  	@method off
  	@param {String} [event=null] Event name.
  	@param {function} [handler=null]
  	A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
   */
  EventDispatcher.prototype.off = function(p_event, p_handler) {
    var events, i;
    if (p_event == null) {
      p_event = null;
    }
    if (p_handler == null) {
      p_handler = null;
    }
    if (!this._events) {
      this._events = {};
      return;
    }
    if ((p_event != null) && Boolean(this._events[p_event])) {
      events = this._events[p_event];
      if (!p_handler) {
        return this._events[p_event].length = 0;
      } else {
        while ((i = events.indexOf(p_handler)) >= 0) {
          events.splice(i, 1);
        }
        return this._events[p_event] = events;
      }
    } else {
      return this._events = {};
    }
  };
  /**
  	Triggers an event.
  	@method trigger
  	@param {String} event Event name.
  	@param {object} [data=null] Custom event data.
  	@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.
  	@example
  		var ed = new EventDispatcher()
  		// Will just trigger the event
  		ed.trigger('someEvent'); 
  		// Will trigger the event with the object which can be retrieved by the second
  		// parameter of the handler function.
  		ed.trigger('someEvent', {someData: true}); 
  		// Will set the event target to window. On the handler's first parameter
  		//`event.target` will be window, and event.currentTarget will be the `ev` instance.
  		ed.trigger('someEvent', {someData: true}, window);
   */
  EventDispatcher.prototype.trigger = function(evt, data, target) {
    var e, events, i, k, v, _i, _len, _results;
    if (data == null) {
      data = null;
    }
    if (target == null) {
      target = null;
    }
    if (Array.isArray(evt)) {
      for (_i = 0, _len = evt.length; _i < _len; _i++) {
        e = evt[_i];
        this.trigger(evt, data);
      }
      return;
    }
    if (!this._events) {
      this._events = {};
    }
    events = this._events[evt];
    if (!events || events.length === 0) {
      return;
    }
    if (!target) {
      target = this;
    }
    e = {
      type: evt,
      target: target,
      currentTarget: this
    };
    if (typeof data === 'object') {
      for (k in data) {
        v = data[k];
        if (!e[k]) {
          e[k] = v;
        }
      }
    }
    i = events.length;
    _results = [];
    while (i-- > 0) {
      _results.push(typeof events[i] === "function" ? events[i](e, data) : void 0);
    }
    return _results;
  };
  /**
  	Check if a event handler is already set.
  	@method hasEvent
  	@param {String} event Event name.
  	@param {function} [handler=null] A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
  	@return {Boolean}
   */
  EventDispatcher.prototype.hasEvent = function(p_event, p_handler) {
    var event;
    if (!this._events) {
      this._events = {};
      return;
    }
    for (event in this._events) {
      if (event === p_event) {
        if (this._events[event].indexOf(p_handler) > -1) {
          return true;
        }
      }
    }
    return false;
  };
  /**
  	Triggers an event after the current code block has finished processing.
  	This is useful for stacking up events that needs to be triggered at the end of the function but it's validating beforehand.
  	@method stackTrigger
  	@param {String} event Event name.
  	@param {object} [data=null] Custom event data.
  	@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.
  	@example
  		var ed = new EventDispatcher()
  		var someObject = {a: true, b: false, c: true};
  		ed.on('isA', function(){console.log('Is A!');});
  		ed.on('isB', function(){console.log('Is B!');});
  		ed.on('isC', function(){console.log('Is C!');});
  		function test()
  		{
  			console.log("Init test()");
  			if(someObject.a) ed.stackTrigger('isA');
  			if(someObject.b) ed.stackTrigger('isB');
  			if(someObject.c) ed.stackTrigger('isC');
  			console.log("End test()");
  		}
  		// This will result in:
  		// log: 'Init test()'
  		// log: 'End test()'
  		// log: 'isA'
  		// log: 'isC'
   */
  EventDispatcher.prototype.stackTrigger = function(evt, data, target) {
    if (data == null) {
      data = null;
    }
    if (target == null) {
      target = null;
    }
    if (!this._stackTriggerer) {
      this._stackTriggerer = [];
    }
    this._stackTriggerer.push([evt, data, target]);
    clearTimeout(this._stackTriggerTimeout);
    return this._stackTriggerTimeout = setTimeout(this._triggerStacked, 0);
  };
  EventDispatcher.prototype._triggerStacked = function() {
    var i, l;
    l = this._stackTriggerer.length;
    i = -1;
    while (++i < l) {
      this.trigger.apply(this, this._stackTriggerer[i]);
    }
    return this._stackTriggerer.length = 0;
  };
  return EventDispatcher;
})();
var App, app, windowLoaded;
App = (function(_super) {
  __extends(App, _super);
  function App() {
    App.__super__.constructor.apply(this, arguments);
  }
  App.prototype._checkWindowActivity = function() {
    var _ref, _ref1, _ref2, _ref3;
    this._hidden = 'hidden';
    if (_ref = this._hidden, __indexOf.call(document, _ref) >= 0) {
      document.addEventListener('visibilitychange', this._windowVisibilityChange);
    } else if (_ref1 = (this._hidden = 'mozHidden'), __indexOf.call(document, _ref1) >= 0) {
      document.addEventListener('mozvisibilitychange', this._windowVisibilityChange);
    } else if (_ref2 = (this._hidden = 'webkitHidden'), __indexOf.call(document, _ref2) >= 0) {
      document.addEventListener('webkitvisibilitychange', this._windowVisibilityChange);
    } else if (_ref3 = (this._hidden = 'msHidden'), __indexOf.call(document, _ref3) >= 0) {
      document.addEventListener('msvisibilitychange', this._windowVisibilityChange);
    } else if (__indexOf.call(document, 'onfocusin') >= 0) {
      document.onfocusin = document.onfocusout = this._windowVisibilityChange;
    } else {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this._windowVisibilityChange;
    }
    if (document[this._hidden] !== void 0) {
      return this._windowVisibilityChange({
        type: document[this._hidden] ? 'blur' : 'focus'
      });
    }
  };
  App.prototype._windowVisibilityChange = function(evt) {
    var evtMap, h, hidden, v, _ref;
    v = 'visible';
    h = 'hidden';
    evtMap = {
      focus: false,
      focusin: false,
      pageshow: false,
      blur: true,
      focusout: true,
      pagehide: true
    };
    evt = evt || window.event;
    if (_ref = evt.type, __indexOf.call(evtMap, _ref) >= 0) {
      hidden = evtMap[evt.type];
    } else {
      hidden = document[this._hidden];
    }
    if (hidden) {
      return this.dispatchEvent('windowInactive');
    } else {
      return this.dispatchEvent('windowActive');
    }
  };
  return App;
})(EventDispatcher);
if (!app) {
  app = new App();
}
windowLoaded = (function(_this) {
  return function() {
    if (window.remove) {
      window.remove('load', windowLoaded);
    } else if (window.detachEvent) {
      window.detachEvent('onload', windowLoaded);
    } else {
      window.onload = null;
    }
    return app.trigger('windowLoad');
  };
})(this);
if (window.addEventListener) {
  window.addEventListener('load', windowLoaded);
} else if (window.attachEvent) {
  window.attachEvent('onload', windowLoaded);
} else {
  window.onload = windowLoaded;
}
var isIE, __scopeIE8;
isIE = function() {
  var nav;
  nav = navigator.userAgent.toLowerCase();
  if (nav.indexOf('msie') !== -1) {
    return parseInt(nav.split('msie')[1]);
  } else {
    return false;
  }
};
if (isIE() === 8) {
  __scopeIE8 = document.createElement("IE8_" + Math.random());
}
Function.prototype["const"] = function(scope, p_prop) {
  var name, o, value, __scope;
  if (!p_prop) {
    p_prop = scope;
    __scope = __scopeIE8 ? __scopeIE8 : this;
  } else {
    __scope = scope;
  }
  for (name in p_prop) {
    value = p_prop[name];
    o = {};
    o.get = function() {
      return value;
    };
    o.set = function() {
      throw new Error("Can't set const " + name);
    };
    o.configurable = false;
    o.enumerable = true;
    Object.defineProperty(__scope, name, o);
  }
  return null;
};
Function.prototype.get = function(scope, p_prop) {
  var enumerable, getter, name, __scope;
  enumerable = false;
  if (!p_prop) {
    p_prop = scope;
    __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  } else {
    enumerable = true;
    __scope = scope;
  }
  for (name in p_prop) {
    getter = p_prop[name];
    Object.defineProperty(__scope, name, {
      get: getter,
      configurable: true,
      enumerable: enumerable
    });
  }
  return null;
};
Function.prototype.set = function(scope, p_prop) {
  var enumerable, name, setter, __scope;
  enumerable = false;
  if (!p_prop) {
    p_prop = scope;
    __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  } else {
    enumerable = true;
    __scope = scope;
  }
  for (name in p_prop) {
    setter = p_prop[name];
    Object.defineProperty(__scope, name, {
      set: setter,
      configurable: true,
      enumerable: enumerable
    });
  }
  return null;
};
if (!("bind" in Function.prototype)) {
  Function.prototype.bind = function(owner) {
    var args, that;
    that = this;
    if (arguments_.length <= 1) {
      return function() {
        return that.apply(owner, arguments_);
      };
    } else {
      args = Array.prototype.slice.call(arguments_, 1);
      return function() {
        return that.apply(owner, (arguments_.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments_))));
      };
    }
  };
}
if (!("trim" in String.prototype)) {
  String.prototype.trim = function(char) {
    if (char == null) {
      char = null;
    }
    return this.ltrim(char).rtrim(char);
  };
}
String.prototype.ltrim = function(char) {
  var re;
  if (char == null) {
    char = null;
  }
  if (!char) {
    char = '\\s';
  }
  re = new RegExp('^' + char + '*');
  re.global = true;
  re.multiline = true;
  return this.replace(re, '');
};
String.prototype.rtrim = function(char) {
  var re;
  if (char == null) {
    char = null;
  }
  if (!char) {
    char = '\\s';
  }
  re = new RegExp(char + '*$');
  re.global = true;
  re.multiline = true;
  return this.replace(re, '');
};
String.prototype.padLeft = function(length, char) {
  var text;
  if (char == null) {
    char = ' ';
  }
  if (char.length === 0) {
    char = ' ';
  }
  text = this;
  while (text.length < length) {
    text = char + text;
  }
  return text;
};
String.prototype.padRight = function(length, char) {
  var text;
  if (char == null) {
    char = ' ';
  }
  if (char.length === 0) {
    char = ' ';
  }
  text = this;
  while (text.length < length) {
    text += char;
  }
  return text;
};
if (!("isArray" in Array.prototype)) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
if (!("indexOf" in Array.prototype)) {
  Array.prototype.indexOf = function(find, i) {
    var n;
    if (i === void 0) {
      i = 0;
    }
    if (i < 0) {
      i += this.length;
    }
    if (i < 0) {
      i = 0;
    }
    n = this.length;
    while (i < n) {
      if (i in this && this[i] === find) {
        return i;
      }
      i++;
    }
    return -1;
  };
}
if (!("lastIndexOf" in Array.prototype)) {
  Array.prototype.lastIndexOf = function(find, i) {
    if (i === void 0) {
      i = this.length - 1;
    }
    if (i < 0) {
      i += this.length;
    }
    if (i > this.length - 1) {
      i = this.length - 1;
    }
    i++;
    while (i-- > 0) {
      if (i in this && this[i] === find) {
        return i;
      }
    }
    return -1;
  };
}
if (!("forEach" in Array.prototype)) {
  Array.prototype.forEach = function(action, that) {
    var i, n, _results;
    i = 0;
    n = this.length;
    _results = [];
    while (i < n) {
      if (i in this) {
        action.call(that, this[i], i, this);
      }
      _results.push(i++);
    }
    return _results;
  };
}
if (!("map" in Array.prototype)) {
  Array.prototype.map = function(mapper, that) {
    var i, n, other;
    other = new Array(this.length);
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this) {
        other[i] = mapper.call(that, this[i], i, this);
      }
      i++;
    }
    return other;
  };
}
if (!("filter" in Array.prototype)) {
  Array.prototype.filter = function(filter, that) {
    var i, n, other, v;
    other = [];
    v = void 0;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && filter.call(that, v = this[i], i, this)) {
        other.push(v);
      }
      i++;
    }
    return other;
  };
}
if (!("every" in Array.prototype)) {
  Array.prototype.every = function(tester, that) {
    var i, n;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && !tester.call(that, this[i], i, this)) {
        return false;
      }
      i++;
    }
    return true;
  };
}
if (!("some" in Array.prototype)) {
  Array.prototype.some = function(tester, that) {
    var i, n;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && tester.call(that, this[i], i, this)) {
        return true;
      }
      i++;
    }
    return false;
  };
}
Node.prototype.on = Node.prototype.addEventListener;
Node.prototype.off = Node.prototype.removeEventListener;
var BaseDOM,
  __slice = [].slice;
Node.prototype.__appendChild__ = Node.prototype.appendChild;
Node.prototype.appendChild = function(node) {
  var el;
  el = node;
  if (node instanceof BaseDOM) {
    el = node.element;
    node.parent = this;
  }
  return Node.prototype.__appendChild__.call(this, el);
};
Node.prototype.__removeChild__ = Node.prototype.removeChild;
Node.prototype.removeChild = function(node) {
  var el;
  el = node;
  if (node instanceof BaseDOM) {
    el = node.element;
    node.parent = this;
  }
  return Node.prototype.__removeChild__.call(this, el);
};
Element.prototype.matches = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;
Node.prototype.findParents = function(query) {
  if (this.parentNode != null) {
    if (this.parentNode.matches(query)) {
      return this.parentNode;
    } else {
      return this.parentNode.findParents(query);
    }
  }
  return null;
};
/**
Base DOM manipulation class
@class BaseDOM
 */
BaseDOM = (function(_super) {
  __extends(BaseDOM, _super);
  function BaseDOM() {
    var className, element, i, namespace, option, p_options;
    p_options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    BaseDOM.__super__.constructor.apply(this, arguments);
    element = 'div';
    className = null;
    namespace = null;
    if (typeof p_options[0] === 'string' || p_options[0] instanceof HTMLElement) {
      element = p_options[0];
    } else {
      i = p_options.length;
      while (i--) {
        option = p_options[i];
        if (option.element != null) {
          element = option.element;
        }
        if (option.className != null) {
          className = option.className;
        }
        if (option.namespace != null) {
          namespace = option.namespace;
        }
      }
    }
    if (typeof element === 'string') {
      if (namespace) {
        this._namespace = namespace;
        this._element = document.createElementNS(this._namespace, element);
      } else {
        this._element = document.createElement(element);
      }
    } else if (element instanceof HTMLElement) {
      this._element = element;
    }
    if (className) {
      this.addClass(className);
    }
    this._element.__instance__ = this;
  }
  BaseDOM.get({
    element: function() {
      return this._element;
    }
  });
  BaseDOM.get({
    namespace: function() {
      return this._namespace;
    }
  });
  BaseDOM.get({
    childNodes: function() {
      return this.element.childNodes;
    }
  });
  BaseDOM.get({
    width: function() {
      return this.getBounds().width;
    }
  });
  BaseDOM.get({
    height: function() {
      return this.getBounds().height;
    }
  });
  BaseDOM.get({
    left: function() {
      return this.getBounds().left;
    }
  });
  BaseDOM.get({
    top: function() {
      return this.getBounds().top;
    }
  });
  BaseDOM.get({
    x: function() {
      return this.getBounds().left;
    }
  });
  BaseDOM.get({
    y: function() {
      return this.getBounds().top;
    }
  });
  BaseDOM.get({
    parent: function() {
      return this._parent;
    }
  });
  BaseDOM.set({
    parent: function(value) {
      if (!(value instanceof BaseDOM) && !(value instanceof Node)) {
        throw new Error('Parent instance is not either Node or BaseDOM');
      }
      return this._parent = value;
    }
  });
  BaseDOM.get({
    className: function() {
      return this.element.className;
    }
  });
  BaseDOM.set({
    className: function(value) {
      return this.element.className = value.trim();
    }
  });
  BaseDOM.get({
    text: function() {
      return this.html;
    }
  });
  BaseDOM.set({
    text: function(value) {
      return this.html = value;
    }
  });
  BaseDOM.get({
    html: function() {
      return this.element.innerHTML;
    }
  });
  BaseDOM.set({
    html: function(value) {
      return this.element.innerHTML = value;
    }
  });
  BaseDOM.get({
    isAttached: function() {
      return document.contains(this.element) || document.body.contains(this.element);
    }
  });
  BaseDOM.get({
    attributes: function() {
      return this.element.attributes;
    }
  });
  BaseDOM.prototype.appendChild = function(child) {
    var el;
    el = child;
    if (child instanceof BaseDOM) {
      el = child.element;
    }
    return this.appendChildAt(el);
  };
  BaseDOM.prototype.appendChildAt = function(child, index) {
    var el;
    if (index == null) {
      index = -1;
    }
    el = child;
    if (child instanceof BaseDOM) {
      el = child.element;
    }
    if (index === -1 || index >= this.childNodes.length) {
      this.element.appendChild(el);
    } else {
      this.element.insertBefore(el, this.childNodes[index]);
    }
    if (child instanceof BaseDOM) {
      child.parent = this;
    }
    return child;
  };
  BaseDOM.prototype.remove = function() {
    var _ref;
    return (_ref = this.parent) != null ? typeof _ref.removeChild === "function" ? _ref.removeChild(this) : void 0 : void 0;
  };
  BaseDOM.prototype.removeChild = function(child) {
    var el;
    el = child;
    if (child instanceof BaseDOM) {
      el = child.element;
    }
    try {
      return this.element.removeChild(el);
    } catch (_error) {}
  };
  BaseDOM.prototype.removeChildAt = function(index) {
    if (index == null) {
      index = -1;
    }
    if (index < this.childNodes.length) {
      return this.removeChild(this.childNodes[i]);
    }
  };
  BaseDOM.prototype.removeAll = function() {
    var childs, i, _results;
    childs = this.childNodes;
    i = childs.length;
    _results = [];
    while (i-- > 0) {
      _results.push(this.removeChild(childs[i]));
    }
    return _results;
  };
  BaseDOM.prototype.matches = function(query) {
    return this.element.matches(query);
  };
  BaseDOM.prototype.findParents = function(query) {
    return this.element.findParents(query);
  };
  BaseDOM.prototype.find = function(query, onlyInstances) {
    var element;
    if (onlyInstances == null) {
      onlyInstances = false;
    }
    element = this.element.querySelector(query);
    if (onlyInstances) {
      return element != null ? element.__instance__ : void 0;
    } else {
      return element;
    }
  };
  BaseDOM.prototype.findAll = function(query, onlyInstances) {
    var elements, els, i, l, p;
    if (onlyInstances == null) {
      onlyInstances = false;
    }
    elements = this.element.querySelectorAll(query);
    if (onlyInstances) {
      els = [];
      i = -1;
      l = elements.length;
      p = 0;
      while (++i < l) {
        if (elements[i].__instance__) {
          els[p++] = elements[i].__instance__;
        }
      }
      elements = els;
    }
    return elements;
  };
  BaseDOM.prototype.attr = function(name, value, namespace) {
    var k, v, _results;
    if (value == null) {
      value = 'nonenonenone';
    }
    if (namespace == null) {
      namespace = false;
    }
    if (typeof name === 'string') {
      return this._attr(name, value, namespace);
    } else if (typeof name === 'object') {
      _results = [];
      for (k in name) {
        v = name[k];
        _results.push(this._attr(k, v, namespace));
      }
      return _results;
    }
  };
  BaseDOM.prototype._attr = function(name, value, namespace) {
    if (value == null) {
      value = 'nonenonenone';
    }
    if (namespace == null) {
      namespace = false;
    }
    if (namespace === false) {
      namespace = this.namespace;
    }
    if (value !== 'nonenonenone') {
      if (namespace) {
        this.element.setAttributeNS(namespace, name, value);
      } else {
        this.element.setAttribute(name, value);
      }
    }
    if (namespace) {
      return this.element.getAttributeNS(namespace, name);
    } else {
      return this.element.getAttribute(name);
    }
  };
  BaseDOM.prototype._css = function(name, value) {
    if (value == null) {
      value = null;
    }
    if (value !== null) {
      this.element.style[name] = value;
    }
    return this.element.style[name];
  };
  BaseDOM.prototype.css = function(name, value) {
    var k, v, _results;
    if (value == null) {
      value = null;
    }
    if (typeof name === 'string') {
      return this._css(name, value);
    } else if (typeof name === 'object') {
      _results = [];
      for (k in name) {
        v = name[k];
        _results.push(this._css(k, v));
      }
      return _results;
    }
  };
  BaseDOM.prototype.addClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    p = classNames.length;
    i = className.length;
    while (i-- > 0) {
      if (classNames.indexOf(className[i]) >= 0) {
        continue;
      }
      classNames[p++] = className[i];
    }
    return this.className = classNames.join(' ');
  };
  BaseDOM.prototype.removeClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    while (i-- > 0) {
      if ((p = classNames.indexOf(className[i])) >= 0) {
        classNames.splice(p, 1);
      }
    }
    return this.className = classNames.join(' ');
  };
  BaseDOM.prototype.toggleClass = function(className, toggle) {
    var i, _results;
    if (toggle == null) {
      toggle = null;
    }
    if (toggle !== null) {
      if (toggle) {
        this.addClass(className);
      } else {
        this.removeClass(className);
      }
      return;
    }
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    i = className.length;
    _results = [];
    while (i-- > 0) {
      if (this.hasClass(className[i])) {
        _results.push(this.removeClass(className[i]));
      } else {
        _results.push(this.addClass(className[i]));
      }
    }
    return _results;
  };
  BaseDOM.prototype.hasClass = function(className) {
    var classNames, hasClass, i;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    hasClass = true;
    while (i-- > 0) {
      hasClass &= classNames.indexOf(className[i]) >= 0;
    }
    return hasClass;
  };
  BaseDOM.prototype.getBounds = function(target) {
    var bounds, boundsObj, k, tbounds, v;
    if (target == null) {
      target = null;
    }
    boundsObj = {};
    bounds = this.element.getBoundingClientRect();
    for (k in bounds) {
      v = bounds[k];
      boundsObj[k] = v;
    }
    if (target) {
      if (target instanceof BaseDOM) {
        tbounds = target.getBounds();
      } else if (target instanceof HTMLElement) {
        tbounds = target.getBoundingClientRect();
      }
    }
    if (tbounds) {
      boundsObj.top -= tbounds.top;
      boundsObj.left -= tbounds.left;
      boundsObj.bottom -= tbounds.top;
      boundsObj.right -= tbounds.left;
    }
    boundsObj.width = boundsObj.right - boundsObj.left;
    boundsObj.height = boundsObj.bottom - boundsObj.top;
    return boundsObj;
  };
  BaseDOM.prototype.destroy = function() {
    if (typeof this.off === "function") {
      this.off();
    }
    return typeof this.remove === "function" ? this.remove() : void 0;
  };
  return BaseDOM;
})(EventDispatcher);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.ui.Blocker = (function(_super) {
  __extends(Blocker, _super);
  Blocker.CLOSE = 'close';
  Blocker._instances = [];
  Blocker.open = function(content) {
    var instance;
    if (content == null) {
      content = null;
    }
    instance = new Blocker(content);
    instance.open();
    return instance;
  };
  Blocker.closeAll = function() {
    var i;
    i = this._instances.length;
    while (i-- > 0) {
      this._instances[i].close();
    }
    return this._instances.length = 0;
  };
  Blocker._registerInstance = function(instance) {
    return this._instances.push(instance);
  };
  Blocker._unregisterInstance = function(instance) {
    var i, _ref, _results;
    _results = [];
    while ((i = this._instances.indexOf(instance)) >= 0) {
      _results.push((_ref = this._instances.splice(i, 1)[0]) != null ? _ref.destroy() : void 0);
    }
    return _results;
  };
  function Blocker() {
    this.close = __bind(this.close, this);
    this.open = __bind(this.open, this);
    Blocker.__super__.constructor.call(this, {
      element: 'div',
      className: 'erlik_blocker'
    });
    this.constructor._registerInstance(this);
    this._container = new BaseDOM({
      className: 'erlik_blocker_container'
    });
    this.appendChild(this._container);
  }
  Blocker.prototype.open = function() {
    return document.body.appendChild(this.element);
  };
  Blocker.prototype.close = function() {
    var _ref;
    this.trigger(this.constructor.CLOSE);
    if ((_ref = this.element.parentNode) != null) {
      _ref.removeChild(this.element);
    }
    return this.constructor._unregisterInstance(this);
  };
  Blocker.prototype.destroy = function() {
    return Blocker.__super__.destroy.apply(this, arguments);
  };
  return Blocker;
})(BaseDOM);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.core.PluginController = (function(_super) {
  __extends(PluginController, _super);
  PluginController._init = function() {
    if (this._inited) {
      return;
    }
    this._inited = true;
    this._plugins = {};
    return this._mapPlugins();
  };
  PluginController._mapPlugins = function(target) {
    var k, v, _results;
    if (target == null) {
      target = null;
    }
    if (!target) {
      target = slikland.erlik.plugins;
    }
    _results = [];
    for (k in target) {
      v = target[k];
      if (v._IS_ERLIK_PLUGIN != null) {
        if (v === slikland.erlik.plugins.Plugin) {
          continue;
        }
        v.NAME = k.toLowerCase();
        _results.push(this._plugins[v.NAME] = v);
      } else {
        _results.push(this._mapPlugins(v));
      }
    }
    return _results;
  };
  function PluginController(root, editor, toolbar, config) {
    this._pluginFocus = __bind(this._pluginFocus, this);
    this._pluginChange = __bind(this._pluginChange, this);
    this._getPlugin = __bind(this._getPlugin, this);
    if (!(editor instanceof slikland.erlik.Editor)) {
      throw new Error('Editor is not an slikland.erlik.Editor');
    }
    if (!(toolbar instanceof slikland.erlik.Toolbar)) {
      throw new Error('Toolbar is not an slikland.erlik.Toolbar');
    }
    this.constructor._init();
    this._root = root;
    this._editor = editor;
    this._toolbar = toolbar;
    this._plugins = [];
    this._setup(config);
    this._processPre = [];
    this._processNormal = [];
    this._processPos = [];
    this._sortPlugins();
  }
  PluginController.get({
    config: function() {
      return this._config;
    }
  });
  PluginController.prototype._sortPlugins = function() {
    var normal, p, pos, pre, _i, _len, _ref, _results;
    this._plugins.sort(this._sortPluginProcessOrder);
    pre = slikland.erlik.plugins.Plugin.PROCESS_PRE;
    normal = slikland.erlik.plugins.Plugin.PROCESS_NORMAL;
    pos = slikland.erlik.plugins.Plugin.PROCESS_POS;
    _ref = this._plugins;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (p.constructor.PROCESS_ORDER <= pre) {
        _results.push(this._processPre.push(p));
      } else if (p.constructor.PROCESS_ORDER < pos) {
        _results.push(this._processNormal.push(p));
      } else {
        _results.push(this._processPos.push(p));
      }
    }
    return _results;
  };
  PluginController.prototype._sortPluginProcessOrder = function(a, b) {
    var apo, bpo;
    apo = a.constructor.PROCESS_ORDER;
    bpo = b.constructor.PROCESS_ORDER;
    if (apo < bpo) {
      return -1;
    }
    if (apo > bpo) {
      return 1;
    }
    return 0;
  };
  PluginController.prototype._getPlugin = function(name) {
    var p, _i, _len, _ref;
    _ref = this._plugins;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (p.name === name) {
        return p;
      }
    }
    p = this.constructor._plugins[name];
    if (!p) {
      return null;
    }
    p = new p(this);
    p.on(p.constructor.CHANGE, this._pluginChange);
    this._plugins.push(p);
    return p;
  };
  PluginController.prototype._setup = function(data) {
    this._config = data;
    this._setupToolbar(data.toolbar || slikland.erlik.Toolbar.DEFAULT_ICONS);
    if (data.plugins) {
      return this._setupPlugins(data.plugins);
    }
  };
  PluginController.prototype._setupToolbar = function(items) {
    items = this._parseToolbarItems(items);
    return this._toolbar.buildItems(items);
  };
  PluginController.prototype._parseToolbarItems = function(items) {
    var item, newItems, _i, _len;
    newItems = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (Array.isArray(item)) {
        newItems.push(this._parseToolbarItems(item));
      } else {
        newItems.push(this._getPlugin(item));
      }
    }
    return newItems;
  };
  PluginController.prototype._setupPlugins = function(items) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      _results.push(this._getPlugin(item));
    }
    return _results;
  };
  PluginController.prototype._pluginChange = function(e, data) {
    var element, plugin, range;
    this._editor.focus();
    range = this._editor.getRange();
    plugin = data.plugin;
    if (!range) {
      return;
    }
    if (plugin.command != null) {
      switch (plugin.command) {
        case 'insertElement':
          element = data.element;
          if (element) {
            element.editor = this._editor;
            element.on('focus', this._pluginFocus);
            range.deleteContents();
            range.insertNode(element.element);
          }
          break;
        default:
          this._editor.execCommand(plugin.command, null, plugin.value);
      }
    }
    return this._editor.update();
  };
  PluginController.prototype._pluginFocus = function(e) {
    return this._editor.blur();
  };
  PluginController.prototype.update = function(data) {
    var p, _i, _len, _ref, _results;
    _ref = this._plugins;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      _results.push(p.update(data.styles, data.parents));
    }
    return _results;
  };
  PluginController.prototype.parseDOM = function(nodeList) {
    var i, plugin, _results;
    i = this._plugins.length;
    _results = [];
    while (i-- > 0) {
      plugin = this._plugins[i];
      _results.push(typeof plugin.parseElement === "function" ? plugin.parseElement(nodeList) : void 0);
    }
    return _results;
  };
  return PluginController;
})(EventDispatcher);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.plugins.Plugin = (function(_super) {
  __extends(Plugin, _super);
  Plugin.get(Plugin, {
    PLUGIN_NAME: function() {
      if (this._pluginName == null) {
        this._pluginName = [];
      }
      return this._pluginName.join(' ');
    }
  });
  Plugin.set(Plugin, {
    PLUGIN_NAME: function(value) {
      if (this._pluginName == null) {
        this._pluginName = [];
      }
      if (this._pluginName.indexOf(value) < 0) {
        return this._pluginName.push(value);
      }
    }
  });
  Plugin.PLUGIN_NAME = 'erlik_plugin';
  Plugin.PROCESS_PRE = -10;
  Plugin.PROCESS_NORMAL = 0;
  Plugin.PROCESS_POS = 10;
  Plugin.PROCESS_ORDER = Plugin.PROCESS_NORMAL;
  Plugin.CHANGE = 'erlik_plugin_change';
  Plugin._IS_ERLIK_PLUGIN = true;
  Plugin.prototype._toolbar = null;
  Plugin.prototype._styleValidation = null;
  Plugin.prototype._style = null;
  Plugin.prototype._validateParentStyles = false;
  Plugin.prototype._tagValidation = null;
  Plugin.prototype._validateParentTags = false;
  Plugin.prototype._command = null;
  Plugin.prototype._value = null;
  function Plugin(editor) {
    this._editPlugin = __bind(this._editPlugin, this);
    this._toolbarClick = __bind(this._toolbarClick, this);
    this._change = __bind(this._change, this);
    this._buildToolbarUI = __bind(this._buildToolbarUI, this);
    Plugin.PLUGIN_NAME;
    this._editor = editor;
    this._editor.on(slikland.Erlik.EDIT_PLUGIN, this._editPlugin);
    if (this.constructor === slikland.erlik.plugins.Plugin) {
      throw new Error('Please extend me!');
    }
    this._name = this.constructor.NAME;
    this._buildToolbarUI();
  }
  Plugin.get({
    name: function() {
      return this.constructor.NAME;
    }
  });
  Plugin.get({
    type: function() {
      return 2;
    }
  });
  Plugin.get({
    toolbarUI: function() {
      return this._toolbarUI;
    }
  });
  Plugin.get({
    command: function() {
      return this._command;
    }
  });
  Plugin.get({
    value: function() {
      return this._value;
    }
  });
  Plugin.prototype.update = function(styles, nodes) {
    return this._validate(styles);
  };
  Plugin.prototype._validate = function(styles) {
    var style, valid, value, _i, _len, _ref;
    if (!this._styleValidation) {
      return;
    }
    valid = false;
    for (_i = 0, _len = styles.length; _i < _len; _i++) {
      style = styles[_i];
      value = style[this._style];
      if (/[\&\|\=|\!|+]/.test(this._styleValidation)) {
        valid = eval(this._styleValidation);
      } else {
        valid = value === this._styleValidation;
      }
      if (valid) {
        break;
      }
      if (!this._validateParentStyles) {
        break;
      }
    }
    return (_ref = this._toolbarUI) != null ? _ref.value = valid : void 0;
  };
  Plugin.prototype._buildToolbarUI = function() {
    if (this._toolbar) {
      this._toolbarUI = new slikland.erlik.ui.Button(this._toolbar);
      return this._toolbarUI.on('click', this._toolbarClick);
    }
  };
  Plugin.prototype._triggerChange = function(data) {
    var k, v;
    if (data == null) {
      data = {};
    }
    if (this._changeData == null) {
      this._changeData = {};
    }
    for (k in data) {
      v = data[k];
      this._changeData[k] = v;
    }
    clearTimeout(this._changeTimeout);
    return this._changeTimeout = setTimeout(this._change, 0);
  };
  Plugin.prototype._change = function() {
    this._changeData['plugin'] = this;
    this.trigger(this.constructor.CHANGE, this._changeData);
    return this._changeData = null;
  };
  Plugin.prototype._toolbarClick = function() {
    return this._triggerChange();
  };
  Plugin.prototype._editPlugin = function(e, data) {
    if (data instanceof this.constructor.Element) {
      return typeof this.edit === "function" ? this.edit(data) : void 0;
    }
  };
  Plugin.Element = (function(_super1) {
    __extends(Element, _super1);
    function Element(target) {
      if (target == null) {
        target = null;
      }
      if (!target) {
        target = 'div';
      }
      Element.__super__.constructor.call(this, {
        element: target
      });
    }
    return Element;
  })(BaseDOM);
  return Plugin;
})(EventDispatcher);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.ui.image.Cropper = (function(_super) {
  var Gallery, Mask, Thumb;
  __extends(Cropper, _super);
  Cropper._GRID_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABBJREFUCNdj+H+AoYEBFwIAcQEGQFVLmEYAAAAASUVORK5CYII=';
  Cropper._EMPTY_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';
  Cropper.WIDTH = 760;
  Cropper.HEIGHT = 401;
  function Cropper() {
    this._imageLoaded = __bind(this._imageLoaded, this);
    this._maskUpdate = __bind(this._maskUpdate, this);
    this._galleryChange = __bind(this._galleryChange, this);
    Cropper.__super__.constructor.call(this, {
      element: 'div',
      className: 'cropper'
    });
    this._container = new BaseDOM({
      element: 'div',
      className: 'cropper_container'
    });
    this._container.css({
      'background-image': 'url(' + this.constructor._GRID_IMAGE + ')',
      display: 'block',
      width: this.constructor.WIDTH + 'px',
      height: this.constructor.HEIGHT + 'px'
    });
    this._image = document.createElement('img');
    this._image.className = 'cropper_image';
    this._image.addEventListener('load', this._imageLoaded);
    this._container.appendChild(this._image);
    this._cropperMask = new Mask();
    this._cropperMask.on('update', this._maskUpdate);
    this._container.appendChild(this._cropperMask);
    this.appendChild(this._container);
    this._gallery = new Gallery();
    this._gallery.on('change', this._galleryChange);
    this.appendChild(this._gallery);
  }
  Cropper.prototype.getData = function() {
    return this._gallery.getItems();
  };
  Cropper.prototype._galleryChange = function(e, data) {
    this._cropperMask.aspectRatio = data.aspectRatio;
    return this._cropperMask.update(data.bounds.x, data.bounds.y, data.bounds.w, data.bounds.h);
  };
  Cropper.prototype._maskUpdate = function(e, data) {
    return this._gallery.updateSelected(data.bounds);
  };
  Cropper.prototype.setImage = function(url) {
    this._image.src = url;
    this._url = url;
    return this._gallery.setImage(this._url);
  };
  Cropper.prototype._imageLoaded = function() {
    var h, s, w;
    this._imageWidth = this._image.initialWidth || this._image.naturalWidth || this._image.width;
    this._imageHeight = this._image.initialHeight || this._image.naturalHeight || this._image.height;
    s = this.constructor.WIDTH / this.constructor.HEIGHT;
    if (s < this._imageWidth / this._imageHeight) {
      s = this.constructor.WIDTH / this._imageWidth;
    } else {
      s = this.constructor.HEIGHT / this._imageHeight;
    }
    w = s * this._imageWidth;
    h = s * this._imageHeight;
    this._cropperMask.imageSize(w / this.constructor.WIDTH, h / this.constructor.HEIGHT);
    this._image.style['left'] = (this.constructor.WIDTH - w) * 0.5 + 'px';
    this._image.style['top'] = (this.constructor.HEIGHT - h) * 0.5 + 'px';
    this._image.style['width'] = w + 'px';
    return this._image.style['height'] = h + 'px';
  };
  Cropper.prototype.setSizes = function(sizes) {
    this._gallery.setSizes(sizes);
    if (this._url) {
      return this._gallery.setImage(this._url);
    }
  };
  Mask = (function(_super1) {
    __extends(Mask, _super1);
    function Mask() {
      this._redraw = __bind(this._redraw, this);
      this._resizeUp = __bind(this._resizeUp, this);
      this._resizeMove = __bind(this._resizeMove, this);
      this._resizeDown = __bind(this._resizeDown, this);
      this._stopDrag = __bind(this._stopDrag, this);
      this._drag = __bind(this._drag, this);
      this._startDrag = __bind(this._startDrag, this);
      Mask.__super__.constructor.call(this, {
        element: 'div',
        className: 'cropper_mask'
      });
      this._aspectRatio = 1;
      this._topMask = new BaseDOM({
        element: 'div',
        className: 'cropper_mask_item'
      });
      this._leftMask = new BaseDOM({
        element: 'div',
        className: 'cropper_mask_item'
      });
      this._bottomMask = new BaseDOM({
        element: 'div',
        className: 'cropper_mask_item'
      });
      this._rightMask = new BaseDOM({
        element: 'div',
        className: 'cropper_mask_item'
      });
      this._middleMask = new BaseDOM({
        element: 'div',
        className: 'cropper_mask_dragger'
      });
      this._middleMask.element.on('mousedown', this._startDrag);
      this._middleMask.css({
        'background-image': 'url(' + Cropper._EMPTY_IMAGE + ')'
      });
      this.appendChild(this._topMask);
      this.appendChild(this._leftMask);
      this.appendChild(this._bottomMask);
      this.appendChild(this._rightMask);
      this.appendChild(this._middleMask);
      this._dragTL = new BaseDOM({
        element: 'div',
        className: 'cropper_mask_resizer tl'
      });
      this._dragTR = new BaseDOM({
        element: 'div',
        className: 'cropper_mask_resizer tr'
      });
      this._dragBL = new BaseDOM({
        element: 'div',
        className: 'cropper_mask_resizer bl'
      });
      this._dragBR = new BaseDOM({
        element: 'div',
        className: 'cropper_mask_resizer br'
      });
      this._dragTL.attr('type', 'tl');
      this._dragTR.attr('type', 'tr');
      this._dragBL.attr('type', 'bl');
      this._dragBR.attr('type', 'br');
      this._dragTL.element.on('mousedown', this._resizeDown);
      this._dragTR.element.on('mousedown', this._resizeDown);
      this._dragBL.element.on('mousedown', this._resizeDown);
      this._dragBR.element.on('mousedown', this._resizeDown);
      this.appendChild(this._dragTL);
      this.appendChild(this._dragTR);
      this.appendChild(this._dragBL);
      this.appendChild(this._dragBR);
      this.update(0, 0, 1, 1);
    }
    Mask.get({
      aspectRatio: function() {
        return this._aspectRatio;
      }
    });
    Mask.set({
      aspectRatio: function(value) {
        this._aspectRatio = value;
        return this._dirty = true;
      }
    });
    Mask.set({
      _dirty: function(value) {
        if (!value) {
          return;
        }
        clearTimeout(this._dirtyCallback);
        return this._dirtyCallback = setTimeout(this._redraw, 0);
      }
    });
    Mask.prototype._getMousePos = function(e) {
      var x, y;
      x = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      x -= this.x;
      y -= this.y;
      return [x, y];
    };
    Mask.prototype._startDrag = function(e) {
      this._mousePos = this._getMousePos(e);
      window.addEventListener('mousemove', this._drag);
      return window.addEventListener('mouseup', this._stopDrag);
    };
    Mask.prototype._drag = function(e) {
      var h, p, w;
      e.preventDefault();
      e.stopImmediatePropagation();
      p = this._getMousePos(e);
      w = this.width;
      h = this.height;
      this._x += ((p[0] - this._mousePos[0]) / w) / this._imageWidth;
      this._y += ((p[1] - this._mousePos[1]) / h) / this._imageHeight;
      this._dirty = true;
      return this._mousePos = p;
    };
    Mask.prototype._stopDrag = function() {
      window.removeEventListener('mousemove', this._drag);
      return window.removeEventListener('mouseup', this._stopDrag);
    };
    Mask.prototype._resizeDown = function(e) {
      window.addEventListener('mousemove', this._resizeMove);
      window.addEventListener('mouseup', this._resizeUp);
      this._resizeType = e.currentTarget.getAttribute('type');
      return this._resizePos = this._getMousePos(e);
    };
    Mask.prototype._resizeMove = function(e) {
      var bottom, h, i, left, ox, oy, p, px, py, right, t, top, w, x, y;
      e.preventDefault();
      e.stopImmediatePropagation();
      p = this._getMousePos(e);
      x = this._x;
      y = this._y;
      w = this._w;
      h = this._h;
      top = y;
      bottom = y + h;
      left = x;
      right = x + w;
      ox = (1 - this._imageWidth) * 0.5;
      oy = (1 - this._imageHeight) * 0.5;
      px = ((p[0] / this.width) - ox) / this._imageWidth;
      py = ((p[1] / this.height) - oy) / this._imageHeight;
      t = this._resizeType.split('');
      i = t.length;
      while (i-- > 0) {
        switch (t[i]) {
          case 't':
            top = py;
            break;
          case 'b':
            bottom = py;
            break;
          case 'l':
            left = px;
            break;
          case 'r':
            right = px;
        }
      }
      w = right - left;
      h = bottom - top;
      if (w / h > this._aspectRatio) {
        w = h * this._aspectRatio;
      } else {
        h = w / this._aspectRatio;
      }
      i = t.length;
      while (i-- > 0) {
        switch (t[i]) {
          case 't':
            top = bottom - h;
            if (top + h > 1) {
              top = 1 - h;
              bottom = 1;
            }
            break;
          case 'b':
            bottom = top + h;
            if (bottom - h < 0) {
              top = 0;
              bottom = top + h;
            }
            break;
          case 'l':
            left = right - w;
            if (left + w > 1) {
              left = 1 - w;
              right = 1;
            }
            break;
          case 'r':
            right = left + w;
            if (right - w < 0) {
              left = 0;
              right = left + w;
            }
        }
      }
      this._x = left;
      this._y = top;
      this._w = w;
      this._h = h;
      this._dirty = true;
      return this._resizePos = p;
    };
    Mask.prototype._resizeUp = function(e) {
      window.removeEventListener('mousemove', this._resizeMove);
      return window.removeEventListener('mouseup', this._resizeUp);
    };
    Mask.prototype.imageSize = function(w, h) {
      this._imageWidth = w;
      this._imageHeight = h;
      this._minX = (1 - this._imageWidth) * 0.5;
      this._minY = (1 - this._imageHeight) * 0.5;
      return this._dirty = true;
    };
    Mask.prototype.reset = function() {
      return this.update(0, 0, 1, 1);
    };
    Mask.prototype.update = function(x, y, w, h) {
      this._x = x;
      this._y = y;
      this._w = w;
      this._h = h;
      return this._dirty = true;
    };
    Mask.prototype._redraw = function() {
      var cx, cy, h, w, x, y;
      if (isNaN(this._x) || isNaN(this._y) || isNaN(this._w) || isNaN(this._h) || isNaN(this._imageWidth) || isNaN(this._imageHeight)) {
        return;
      }
      x = this._x;
      y = this._y;
      w = this._w;
      h = this._h;
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (w > 1) {
        w = 1;
      }
      if (h > 1) {
        h = 1;
      }
      if (w < 0.1) {
        w = 0.1;
        h = w / this._aspectRatio;
      }
      if (w / h !== this._aspectRatio) {
        cx = w * 0.5 + x;
        cy = h * 0.5 + y;
        if (w / h > this._aspectRatio) {
          w = h * this._aspectRatio;
        }
        if (h) {
          h = w / this._aspectRatio;
        }
        x = cx - w * 0.5;
        y = cy - h * 0.5;
      }
      if (x < 0) {
        x = 0;
      }
      if (x + w > 1) {
        x = 1 - w;
      }
      if (y < 0) {
        y = 0;
      }
      if (y + h > 1) {
        y = 1 - h;
      }
      this._x = x;
      this._y = y;
      this._w = w;
      this._h = h;
      this.stackTrigger('update', {
        bounds: {
          x: x,
          y: y,
          w: w,
          h: h
        }
      });
      x *= this._imageWidth;
      y *= this._imageHeight;
      x += this._minX;
      y += this._minY;
      w *= this._imageWidth;
      h *= this._imageHeight;
      this._dragTL.css({
        left: x * 100 + '%',
        top: y * 100 + '%'
      });
      this._dragTR.css({
        left: (x + w) * 100 + '%',
        top: y * 100 + '%'
      });
      this._dragBL.css({
        left: x * 100 + '%',
        top: (y + h) * 100 + '%'
      });
      this._dragBR.css({
        left: (x + w) * 100 + '%',
        top: (y + h) * 100 + '%'
      });
      this._middleMask.css({
        left: x * 100 + '%',
        top: y * 100 + '%',
        width: w * 100 + '%',
        height: h * 100 + '%'
      });
      this._topMask.css({
        top: 0,
        left: 0,
        width: '100%',
        height: y * 100 + '%'
      });
      this._leftMask.css({
        top: y * 100 + '%',
        left: 0,
        width: x * 100 + '%',
        bottom: 0
      });
      this._bottomMask.css({
        top: (y + h) * 100 + '%',
        left: x * 100 + '%',
        right: 0,
        bottom: 0
      });
      return this._rightMask.css({
        left: (x + w) * 100 + '%',
        top: y * 100 + '%',
        right: 0 + '%',
        height: h * 100 + '%'
      });
    };
    return Mask;
  })(BaseDOM);
  Gallery = (function(_super1) {
    __extends(Gallery, _super1);
    function Gallery() {
      this._thumbActive = __bind(this._thumbActive, this);
      this._thumbSelect = __bind(this._thumbSelect, this);
      this.updateSelected = __bind(this.updateSelected, this);
      Gallery.__super__.constructor.call(this, {
        element: 'div',
        className: 'cropper_gallery'
      });
      this._items = [];
    }
    Gallery.prototype.setSizes = function(sizes) {
      var i, l, t;
      this.reset();
      l = sizes.length;
      i = -1;
      while (++i < l) {
        t = new Thumb(sizes[i]);
        t.on('select', this._thumbSelect);
        t.on('active', this._thumbActive);
        this.appendChild(t);
        this._items[i] = t;
      }
      return this.selectByIndex(0);
    };
    Gallery.prototype.getItems = function() {
      var i, items, o, thumb;
      items = [];
      i = this._items.length;
      while (i-- > 0) {
        o = {};
        thumb = this._items[i];
        o.id = thumb.data.id;
        o.size = thumb.data.size;
        o.bounds = thumb.bounds;
        items[i] = o;
      }
      return items;
    };
    Gallery.prototype.updateSelected = function(bounds) {
      if (!this._activeThumb) {
        return;
      }
      return this._activeThumb.bounds = bounds;
    };
    Gallery.prototype.setImage = function(url) {
      var i, _results;
      i = this._items.length;
      _results = [];
      while (i-- > 0) {
        _results.push(this._items[i].setImage(url));
      }
      return _results;
    };
    Gallery.prototype.reset = function() {
      var i, _base;
      i = this._items.length;
      while (i-- > 0) {
        this.removeChild(this._items[i]);
        this._items[i].off();
        if (typeof (_base = this._items[i]).destroy === "function") {
          _base.destroy();
        }
      }
      return this._items.length = 0;
    };
    Gallery.prototype.selectByIndex = function(index) {
      var i, l, _results;
      l = this._items.length;
      index = ((index % l) + l) % l;
      i = this._items.length;
      _results = [];
      while (i-- > 0) {
        _results.push(this._items[i].selected = i === index);
      }
      return _results;
    };
    Gallery.prototype._thumbSelect = function(e) {
      var i, _results;
      i = this._items.length;
      _results = [];
      while (i-- > 0) {
        _results.push(this._items[i].selected = this._items[i] === e.currentTarget);
      }
      return _results;
    };
    Gallery.prototype._thumbActive = function(e) {
      var target;
      target = e.currentTarget;
      this._activeThumb = target;
      return this.trigger('change', {
        bounds: target.bounds,
        aspectRatio: target.aspectRatio
      });
    };
    return Gallery;
  })(BaseDOM);
  Thumb = (function(_super1) {
    __extends(Thumb, _super1);
    function Thumb(data) {
      this._click = __bind(this._click, this);
      var ah, aw, cx, cy, h, w, x, y;
      this._data = data;
      this._selected = false;
      Thumb.__super__.constructor.call(this, {
        element: 'div',
        className: 'cropper_thumb'
      });
      this.css({
        'display': 'inline-block'
      });
      this._thumbContainer = new BaseDOM({
        className: 'container'
      });
      this._thumbContainer.addClass('align_center');
      this._thumbContainer.addClass('align_middle');
      this._thumbImage = new BaseDOM({});
      this._thumbContainer.appendChild(this._thumbImage);
      this.appendChild(this._thumbContainer);
      x = data.x || 0;
      y = data.y || 0;
      w = data.w || 1;
      h = data.h || 1;
      this._aspectRatio = data.size[0] / data.size[1];
      if (this._aspectRatio > 1) {
        aw = 1;
        ah = 1 / this._aspectRatio;
      } else {
        aw = this._aspectRatio;
        ah = 1;
      }
      this._aspectWidth = aw;
      this._aspectHeight = ah;
      this._thumbImage.css({
        'display': 'inline-block',
        'width': aw * 100 + '%',
        'height': ah * 100 + '%'
      });
      this._labelContainer = new BaseDOM({
        className: 'label'
      });
      this.appendChild(this._labelContainer);
      this._labelContainer.html = data.name + ' (' + data.size[0] + 'x' + data.size[1] + ')';
      if (w / h !== this._aspectRatio) {
        cx = x + w * 0.5;
        cy = y + h * 0.5;
        if (w / h !== this._aspectRatio) {
          cx = w * 0.5 + x;
          cy = h * 0.5 + y;
          if (w / h > this._aspectRatio) {
            w = h * this._aspectRatio;
          }
          if (h) {
            h = w / this._aspectRatio;
          }
          x = cx - w * 0.5;
          y = cy - h * 0.5;
        }
      }
      this.update(x, y, w, h);
      this.element.on('click', this._click);
    }
    Thumb.get({
      data: function() {
        return this._data;
      }
    });
    Thumb.get({
      aspectRatio: function() {
        return this._aspectRatio;
      }
    });
    Thumb.get({
      bounds: function() {
        return {
          x: this._x,
          y: this._y,
          w: this._w,
          h: this._h
        };
      }
    });
    Thumb.set({
      bounds: function(value) {
        return this.update(value.x, value.y, value.w, value.h);
      }
    });
    Thumb.get({
      selected: function() {
        return this._selected;
      }
    });
    Thumb.set({
      selected: function(value) {
        this._selected = value;
        this.toggleClass('selected', this._selected);
        if (this._selected) {
          return this.trigger('active');
        }
      }
    });
    Thumb.prototype._click = function() {
      return this.trigger('select');
    };
    Thumb.prototype.setImage = function(url) {
      return this._thumbImage.css({
        'background-image': 'url(' + url + ')'
      });
    };
    Thumb.prototype.update = function(x, y, w, h) {
      this._x = x;
      this._y = y;
      this._w = w;
      this._h = h;
      x /= 1 - w;
      y /= 1 - h;
      if (isNaN(x)) {
        x = 0;
      }
      if (isNaN(y)) {
        y = 0;
      }
      w = 1 / this._w;
      h = 1 / this._h;
      return this._thumbImage.css({
        'background-size': w * 100 + '% ' + h * 100 + '%',
        'background-position': x * 100 + '% ' + y * 100 + '%'
      });
    };
    return Thumb;
  })(BaseDOM);
  return Cropper;
})(BaseDOM);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.align.Right = (function(_super) {
  __extends(Right, _super);
  function Right() {
    return Right.__super__.constructor.apply(this, arguments);
  }
  Right.prototype._toolbar = {
    icon: 'fa-align-right',
    toggle: true
  };
  Right.prototype._styleValidation = 'right';
  Right.prototype._style = 'text-align';
  Right.prototype._command = 'justifyRight';
  return Right;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.list.Outdent = (function(_super) {
  __extends(Outdent, _super);
  function Outdent() {
    return Outdent.__super__.constructor.apply(this, arguments);
  }
  Outdent.prototype._toolbar = {
    icon: 'fa-outdent',
    toggle: false
  };
  Outdent.prototype._command = 'outdent';
  return Outdent;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.align.Left = (function(_super) {
  __extends(Left, _super);
  function Left() {
    return Left.__super__.constructor.apply(this, arguments);
  }
  Left.prototype._toolbar = {
    icon: 'fa-align-left',
    toggle: true
  };
  Left.prototype._styleValidation = 'value == "left" || value == "start"';
  Left.prototype._style = 'text-align';
  Left.prototype._command = 'justifyLeft';
  return Left;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.align.Justify = (function(_super) {
  __extends(Justify, _super);
  function Justify() {
    return Justify.__super__.constructor.apply(this, arguments);
  }
  Justify.prototype._toolbar = {
    icon: 'fa-align-justify',
    toggle: true
  };
  Justify.prototype._styleValidation = 'justify';
  Justify.prototype._style = 'text-align';
  Justify.prototype._command = 'justifyFull';
  return Justify;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.align.Indent = (function(_super) {
  __extends(Indent, _super);
  function Indent() {
    return Indent.__super__.constructor.apply(this, arguments);
  }
  Indent.prototype._toolbar = {
    icon: 'fa-indent',
    toggle: false
  };
  Indent.prototype._command = 'indent';
  return Indent;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.align.Center = (function(_super) {
  __extends(Center, _super);
  function Center() {
    return Center.__super__.constructor.apply(this, arguments);
  }
  Center.prototype._toolbar = {
    icon: 'fa-align-center',
    toggle: true
  };
  Center.prototype._styleValidation = 'center';
  Center.prototype._style = 'text-align';
  Center.prototype._command = 'justifyCenter';
  return Center;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.format.Underline = (function(_super) {
  __extends(Underline, _super);
  function Underline() {
    return Underline.__super__.constructor.apply(this, arguments);
  }
  Underline.prototype._toolbar = {
    icon: 'fa-underline',
    toggle: true
  };
  Underline.prototype._styleValidation = 'underline';
  Underline.prototype._style = 'text-decoration';
  Underline.prototype._validateParentStyles = true;
  Underline.prototype._command = 'underline';
  return Underline;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.format.Strikethrough = (function(_super) {
  __extends(Strikethrough, _super);
  function Strikethrough() {
    return Strikethrough.__super__.constructor.apply(this, arguments);
  }
  Strikethrough.prototype._toolbar = {
    icon: 'fa-strikethrough',
    toggle: true
  };
  Strikethrough.prototype._styleValidation = 'line-through';
  Strikethrough.prototype._style = 'text-decoration';
  Strikethrough.prototype._validateParentStyles = true;
  Strikethrough.prototype._command = 'Strikethrough';
  return Strikethrough;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.format.Italic = (function(_super) {
  __extends(Italic, _super);
  function Italic() {
    return Italic.__super__.constructor.apply(this, arguments);
  }
  Italic.prototype._toolbar = {
    icon: 'fa-italic',
    toggle: true
  };
  Italic.prototype._styleValidation = 'italic';
  Italic.prototype._style = 'font-style';
  Italic.prototype._command = 'italic';
  return Italic;
})(slikland.erlik.plugins.Plugin);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.plugins.format.Font = (function(_super) {
  __extends(Font, _super);
  function Font() {
    this._buildToolbarUI = __bind(this._buildToolbarUI, this);
    Font.__super__.constructor.apply(this, arguments);
  }
  Font.prototype._buildToolbarUI = function() {
    return this._toolbarUI = new BaseDOM({
      element: 'select'
    });
  };
  return Font;
})(slikland.erlik.plugins.Plugin);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.plugins.format.Color = (function(_super) {
  __extends(Color, _super);
  Color.prototype._toolbar = {
    icon: 'fa-font',
    toggle: false
  };
  Color.prototype._style = 'color';
  Color.prototype._command = 'foreColor';
  Color.prototype._value = '#000000';
  function Color() {
    this._pickerChange = __bind(this._pickerChange, this);
    this._toolbarClick = __bind(this._toolbarClick, this);
    Color.__super__.constructor.apply(this, arguments);
    this._picker = document.createElement('input');
    this._picker.setAttribute('type', 'color');
    this._picker.style['position'] = 'absolute';
    this._picker.style['left'] = '-100000px';
    this._picker.style['opacity'] = 0;
    this._picker.on('change', this._pickerChange);
    document.body.appendChild(this._picker);
  }
  Color.prototype.update = function(styles) {
    var style, value, _i, _len;
    for (_i = 0, _len = styles.length; _i < _len; _i++) {
      style = styles[_i];
      value = style[this._style];
      break;
    }
    return this._setValue(value);
  };
  Color.prototype._toolbarClick = function() {
    return this._picker.click();
  };
  Color.prototype._pickerChange = function() {
    this._value = this._picker.value;
    return this._triggerChange();
  };
  Color.prototype._setValue = function(color) {
    var b, g, hexFormat, o, r, rgbFormat, _ref;
    rgbFormat = /rgba?\(([\d\.]+),.*?([\d\.]+),.*?([\d\.]+).*?\)/;
    hexFormat = /^\#(?:[a-f\d]{3}){1,2}$/i;
    if (rgbFormat.test(color)) {
      o = rgbFormat.exec(color);
      r = Number(o[1]).toString(16).padLeft(2, '0');
      g = Number(o[2]).toString(16).padLeft(2, '0');
      b = Number(o[3]).toString(16).padLeft(2, '0');
      color = '#' + r + g + b;
    }
    if (!hexFormat.test(color)) {
      return;
    }
    this._picker.value = this._value = color;
    return (_ref = this._toolbarUI) != null ? typeof _ref.css === "function" ? _ref.css('color', color) : void 0 : void 0;
  };
  return Color;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.format.Bold = (function(_super) {
  __extends(Bold, _super);
  function Bold() {
    return Bold.__super__.constructor.apply(this, arguments);
  }
  Bold.prototype._toolbar = {
    icon: 'fa-bold',
    toggle: true
  };
  Bold.prototype._styleValidation = 'value > 500 || value == \'bold\'';
  Bold.prototype._style = 'font-weight';
  Bold.prototype._command = 'bold';
  return Bold;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.list.UnorderedList = (function(_super) {
  __extends(UnorderedList, _super);
  function UnorderedList() {
    return UnorderedList.__super__.constructor.apply(this, arguments);
  }
  UnorderedList.prototype._toolbar = {
    icon: 'fa-list-ul',
    toggle: true
  };
  UnorderedList.prototype._command = 'insertUnorderedList';
  return UnorderedList;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.list.OrderedList = (function(_super) {
  __extends(OrderedList, _super);
  function OrderedList() {
    return OrderedList.__super__.constructor.apply(this, arguments);
  }
  OrderedList.prototype._toolbar = {
    icon: 'fa-list-ol',
    toggle: true
  };
  OrderedList.prototype._command = 'insertOrderedList';
  return OrderedList;
})(slikland.erlik.plugins.Plugin);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.plugins.media.Video = (function(_super) {
  __extends(Video, _super);
  Video.prototype._toolbar = {
    icon: 'fa-film',
    toggle: false
  };
  Video.prototype._command = 'insertElement';
  function Video() {
    this._toolbarClick = __bind(this._toolbarClick, this);
    Video.__super__.constructor.apply(this, arguments);
    this._browser = document.createElement('input');
    this._browser.setAttribute('type', 'file');
    this._browser.setAttribute('accept', 'image/*');
    this._browser.style['position'] = 'absolute';
    this._browser.style['left'] = '-100000px';
    this._browser.style['opacity'] = 0;
    this._browser.on('change', this._browserChange);
    document.body.appendChild(this._browser);
  }
  Video.prototype._toolbarClick = function() {
    Video.__super__._toolbarClick.apply(this, arguments);
    return slikland.erlik.ui.Lightbox.open({
      title: 'Media'
    });
  };
  Video.Element = (function(_super1) {
    __extends(Element, _super1);
    function Element(target) {
      if (target == null) {
        target = null;
      }
      this._dblCick = __bind(this._dblCick, this);
      this._focus = __bind(this._focus, this);
      this._click = __bind(this._click, this);
      if (!target) {
        target = 'div';
      }
      Element.__super__.constructor.call(this, {
        element: target
      });
      this.element.contentEditable = false;
      this.attr('tabindex', 0);
      this.addClass('media-item');
      this.element.on('click', this._click);
      this.element.on('focus', this._focus);
      this.element.on('dblclick', this._dblCick);
    }
    Element.prototype._click = function() {
      return this._element.focus();
    };
    Element.prototype._focus = function() {
      return this.trigger('focus');
    };
    Element.prototype._dblCick = function() {
      return console.log('edit', this);
    };
    return Element;
  })(BaseDOM);
  return Video;
})(slikland.erlik.plugins.Plugin);
var API;
API = (function(_super) {
  __extends(API, _super);
  API.COMPLETE = 'apiComplete';
  API.ERROR = 'apiError';
  API.PROGRESS = 'apiProgress';
  API.ROOT_PATH = '';
  API._request = function() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      return new ActiveXObject("MSXML2.XMLHTTP.3.0");
    }
  };
  API.call = function(url, data, onComplete, onError, type, method) {
    var api;
    if (data == null) {
      data = null;
    }
    if (onComplete == null) {
      onComplete = null;
    }
    if (onError == null) {
      onError = null;
    }
    if (type == null) {
      type = 'json';
    }
    if (method == null) {
      method = 'POST';
    }
    if (arguments.length < 1) {
      return;
    }
    if (!url) {
      return;
    }
    if (((data != null ? data['onComplete'] : void 0) != null) && arguments.length === 2) {
      onComplete = data != null ? data['onComplete'] : void 0;
      onError = data != null ? data['onError'] : void 0;
      type = data != null ? data['type'] : void 0;
      data = data != null ? data['params'] : void 0;
    }
    api = new API(API.ROOT_PATH + url, data, method, type);
    if (onComplete) {
      api.on(this.COMPLETE, onComplete);
    }
    if (onError) {
      api.on(this.ERROR, onError);
    }
    api.load();
    return api;
  };
  function API(url, params, method, type) {
    this.url = url;
    this.params = params != null ? params : null;
    this.method = method != null ? method : 'POST';
    this.type = type != null ? type : 'json';
    this._loaded = __bind(this._loaded, this);
    this._progress = __bind(this._progress, this);
    API.__super__.constructor.call(this);
    this.reuse = false;
    this.stackTrigger('test');
  }
  API.prototype.load = function(data) {
    var formData, n, url, v, _ref, _ref1;
    if (data == null) {
      data = null;
    }
    if (data) {
      this.params = data;
    }
    url = this.url.split('.').join('/');
    if ((typeof FormData !== "undefined" && FormData !== null) && this.params instanceof FormData) {
      this.method = 'POST';
      formData = this.params;
    } else {
      if ((typeof FormData !== "undefined" && FormData !== null) && this.method === 'POST') {
        formData = new FormData();
        _ref = this.params;
        for (n in _ref) {
          v = _ref[n];
          formData.append(n, v);
        }
      } else {
        formData = [];
        _ref1 = this.params;
        for (n in _ref1) {
          v = _ref1[n];
          formData.push(n + '=' + v);
        }
        if (typeof FormData === "undefined" || FormData === null) {
          formData = formData.join('&');
        }
      }
    }
    this.req = API._request();
    this.req.onreadystatechange = this._loaded;
    this.req.addEventListener('progress', this._progress);
    this.req.open(this.method, this.url, true);
    return this.req.send(formData);
  };
  API.prototype._progress = function(e) {
    return this.trigger(this.constructor.PROGRESS, e);
  };
  API.prototype.cancel = function() {
    if (this.req) {
      this.req.onreadystatechange = null;
      this.req.abort();
    }
    if (!this.reuse) {
      return this.off();
    }
  };
  API.prototype._loaded = function(e) {
    var data, err;
    if (e.currentTarget.readyState === 4) {
      if (e.currentTarget.status === 200) {
        data = e.currentTarget.responseText;
        try {
          if (typeof this.type === 'function') {
            data = this.type(data);
          } else if (this.type === 'json') {
            data = JSON.parse(e.currentTarget.responseText);
          }
          this.trigger(this.constructor.COMPLETE, data);
        } catch (_error) {
          err = _error;
          this.trigger(this.constructor.ERROR, err);
        }
      } else {
        this.trigger(this.constructor.ERROR, null, e.currentTarget.status);
      }
      if (!this.reuse) {
        return this.off();
      }
    }
  };
  return API;
})(EventDispatcher);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.plugins.media.Image = (function(_super) {
  __extends(Image, _super);
  Image.PLUGIN_NAME = 'image';
  Image.elementSelector = 'image';
  Image.prototype._toolbar = {
    icon: 'fa-image',
    toggle: false
  };
  Image.prototype._command = 'insertElement';
  function Image() {
    this._cropCompleteHandler = __bind(this._cropCompleteHandler, this);
    this._cropImage = __bind(this._cropImage, this);
    this._uploadCompleteHandler = __bind(this._uploadCompleteHandler, this);
    this._uploadProgressHandler = __bind(this._uploadProgressHandler, this);
    this._lightboxCommit = __bind(this._lightboxCommit, this);
    this._lightboxCancel = __bind(this._lightboxCancel, this);
    this._browserChange = __bind(this._browserChange, this);
    this._toolbarClick = __bind(this._toolbarClick, this);
    Image.__super__.constructor.apply(this, arguments);
    this._elements = {};
    this._form = document.createElement('form');
    this._form.enctype = 'multipart/form-data';
    this._form.style['position'] = 'absolute';
    this._form.style['left'] = '-100000px';
    this._form.style['opacity'] = 0;
    this._browser = document.createElement('input');
    this._browser.setAttribute('type', 'file');
    this._browser.setAttribute('accept', 'image/*');
    this._browser.on('change', this._browserChange);
    this._browser.name = 'image';
    this._form.appendChild(this._browser);
    document.body.appendChild(this._form);
  }
  Image.prototype._toolbarClick = function() {
    this._cropData = null;
    this._currentElement = null;
    this._browser.value = null;
    return this._browser.click();
  };
  Image.prototype._showLightbox = function(data) {
    var _ref;
    this._lightboxContent = new this.constructor.Lightbox(this._browser.files[0], (_ref = this._editor.config.image) != null ? _ref.types : void 0);
    this._lightboxContent.on(this._lightboxContent.constructor.COMMIT, this._lightboxCommit);
    this._lightboxContent.on(this._lightboxContent.constructor.CANCEL, this._lightboxCancel);
    this._lightbox = slikland.erlik.ui.Lightbox.open({
      title: 'Image',
      content: this._lightboxContent
    });
    return this._lightbox.on(slikland.erlik.ui.Lightbox.CLOSE, this._lightboxCancel);
  };
  Image.prototype._closeLightbox = function() {
    var _ref, _ref1, _ref2, _ref3, _ref4;
    if ((_ref = this._lightboxContent) != null) {
      _ref.off(this._lightboxContent.constructor.COMMIT, this._lightboxCommit);
    }
    if ((_ref1 = this._lightboxContent) != null) {
      _ref1.off(this._lightboxContent.constructor.CANCEL, this._lightboxCancel);
    }
    if ((_ref2 = this._lightbox) != null) {
      _ref2.off(slikland.erlik.ui.Lightbox.CLOSE, this._lightboxCancel);
    }
    if ((_ref3 = this._lightboxContent) != null) {
      if (typeof _ref3.destroy === "function") {
        _ref3.destroy();
      }
    }
    return (_ref4 = this._lightbox) != null ? typeof _ref4.destroy === "function" ? _ref4.destroy() : void 0 : void 0;
  };
  Image.prototype._browserChange = function() {
    var _ref;
    if (!this._browser.files || ((_ref = this._browser.files) != null ? _ref.length : void 0) === 0) {
    }
  };
  Image.prototype._lightboxCancel = function() {};
  Image.prototype._lightboxCommit = function(e, data) {
    this._cropData = data;
    if (this._browser.value) {
      this._uploadImage();
    } else {
      this._cropImage();
    }
    return this._lightbox.close();
  };
  Image.prototype._uploadImage = function() {
    var api, fd;
    this._uploadProgress = new slikland.erlik.ui.ProgressBlocker();
    this._uploadProgress.progress = 0;
    this._uploadProgress.title = "Uploading image";
    this._uploadProgress.open();
    fd = new FormData(this._form);
    api = new API('api/image/upload', fd);
    api.on(API.PROGRESS, this._uploadProgressHandler);
    api.on(API.COMPLETE, this._uploadCompleteHandler);
    return api.load();
  };
  Image.prototype._uploadProgressHandler = function(e, data) {
    var p;
    p = data.loaded / data.total;
    this._uploadProgress.progress = p;
    p = Math.round(p * 100);
    return this._uploadProgress.text = p + '%';
  };
  Image.prototype._uploadCompleteHandler = function(e, data) {
    this._uploadProgress.progress = 1;
    this._cropData.image = data.url;
    return this._cropImage();
  };
  Image.prototype._cropImage = function() {
    var api;
    if (this._uploadProgress == null) {
      this._uploadProgress = new slikland.erlik.ui.ProgressBlocker();
    }
    this._uploadProgress.progress = Number.NaN;
    this._uploadProgress.title = "Cropping image";
    this._uploadProgress.text = '';
    api = new API('api/image/crop', this._cropData);
    api.on(API.COMPLETE, this._cropCompleteHandler);
    return api.load();
  };
  Image.prototype._cropCompleteHandler = function(e, data) {
    this._uploadProgress.close();
    if (!this._currentElement) {
      this._currentElement = new this.constructor.Element(data, this._editor);
      this._registerElement(this._currentElement);
    }
    return this._triggerChange({
      element: this._currentElement
    });
  };
  Image.prototype._registerElement = function(element) {
    var target;
    if (element instanceof this.constructor.Element) {
      target = element.element;
    } else {
      target = element;
      if (this._elements[target]) {
        element = this._elements[target];
      } else {
        element = new this.constructor.Element(target);
      }
    }
    if (this._elements[target]) {
      return;
    }
    element.editor = this._editor;
    return this._elements[target] = element;
  };
  Image.prototype.edit = function() {
    return console.log("LALAAL");
  };
  Image.prototype.parseElement = function(dom) {
    var children, classNames, i, item, items, _results;
    children = dom.childNodes;
    classNames = this.constructor.PLUGIN_NAME.replace(/(^|\s)*([^\s]+)/g, '.$2');
    items = dom.querySelectorAll(classNames);
    i = items.length;
    _results = [];
    while (i-- > 0) {
      item = items[i];
      _results.push(this._registerElement(item));
    }
    return _results;
  };
  Image.Element = (function(_super1) {
    __extends(Element, _super1);
    function Element(data, target) {
      if (target == null) {
        target = null;
      }
      this._dblClick = __bind(this._dblClick, this);
      this._focus = __bind(this._focus, this);
      this._click = __bind(this._click, this);
      if (data instanceof HTMLElement) {
        target = data;
      }
      if (!target) {
        target = 'div';
      }
      Element.__super__.constructor.call(this, {
        element: target
      });
      this.addClass(Image.PLUGIN_NAME);
      this.element.contentEditable = false;
      this.attr('tabindex', 0);
      this.addClass('media-item');
      this.element.on('click', this._click);
      this.element.on('focus', this._focus);
      this.element.on('dblclick', this._dblClick);
      if (data instanceof HTMLElement) {
        this._buildFromElement(data);
      } else {
        this._buildFromObject(data);
      }
    }
    Element.prototype._buildFromElement = function(element) {};
    Element.prototype._buildFromObject = function(data) {
      var img, size, _i, _len, _ref, _results;
      this.attr('data', encodeURIComponent(JSON.stringify(data)));
      _ref = data.sizes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        size = _ref[_i];
        img = document.createElement('img');
        img.className = 'item';
        img.src = size.url;
        _results.push(this.appendChild(img));
      }
      return _results;
    };
    Element.prototype._click = function() {
      return this._element.focus();
    };
    Element.prototype._focus = function() {
      return this.trigger('focus');
    };
    Element.prototype._dblClick = function() {
      return this.editor.trigger(slikland.Erlik.EDIT_PLUGIN, this);
    };
    return Element;
  })(BaseDOM);
  Image.Lightbox = (function(_super1) {
    __extends(Lightbox, _super1);
    Lightbox.COMMIT = 'commit';
    Lightbox.CANCEL = 'cancel';
    function Lightbox(file, sizes) {
      this._okClick = __bind(this._okClick, this);
      Lightbox.__super__.constructor.call(this, {
        element: 'div'
      });
      this._cropper = new slikland.erlik.ui.image.Cropper();
      this._cropper.setImage(URL.createObjectURL(file));
      if (sizes) {
        this._cropper.setSizes(sizes);
      }
      this.appendChild(this._cropper);
      this._buttonContainer = new BaseDOM({});
      this._buttonContainer.css({
        'display': 'block',
        width: '100%',
        'text-align': 'right'
      });
      this._okButton = new slikland.erlik.ui.Button({
        label: 'OK'
      });
      this._okButton.on(slikland.erlik.ui.Button.CLICK, this._okClick);
      this._buttonContainer.appendChild(this._okButton);
      this.appendChild(this._buttonContainer);
    }
    Lightbox.prototype._okClick = function(e) {
      var o;
      o = {
        sizes: JSON.stringify(this._cropper.getData())
      };
      return this.trigger(this.constructor.COMMIT, o);
    };
    return Lightbox;
  })(BaseDOM);
  return Image;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.plugins.media.Gallery = (function(_super) {
  __extends(Gallery, _super);
  Gallery.prototype._toolbar = {
    icon: 'fa-th-large',
    toggle: false
  };
  Gallery.prototype._command = 'insertElement';
  function Gallery() {
    Gallery.__super__.constructor.apply(this, arguments);
  }
  Gallery.Element = (function(_super1) {
    __extends(Element, _super1);
    function Element(target) {
      if (target == null) {
        target = null;
      }
      this._dblCick = __bind(this._dblCick, this);
      this._focus = __bind(this._focus, this);
      this._click = __bind(this._click, this);
      if (!target) {
        target = 'div';
      }
      Element.__super__.constructor.call(this, {
        element: target
      });
      this.element.contentEditable = false;
      this.attr('tabindex', 0);
      this.addClass('media-gallery');
      this.element.on('click', this._click);
      this.element.on('focus', this._focus);
      this.element.on('dblclick', this._dblCick);
    }
    Element.prototype._click = function() {
      return this._element.focus();
    };
    Element.prototype._focus = function() {
      return this.trigger('focus');
    };
    Element.prototype._dblCick = function() {
      return console.log('edit');
    };
    return Element;
  })(BaseDOM);
  return Gallery;
})(slikland.erlik.plugins.Plugin);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.ui.ProgressBlocker = (function(_super) {
  __extends(ProgressBlocker, _super);
  function ProgressBlocker() {
    ProgressBlocker.__super__.constructor.apply(this, arguments);
    this._title = new BaseDOM({
      className: 'title'
    });
    this._container.appendChild(this._title);
    this._progressBar = new BaseDOM({
      className: 'title'
    });
    this._container.appendChild(this._title);
    this._progressBar = new slikland.erlik.ui.ProgressBar();
    this._progressBar.progress = 0;
    this._container.appendChild(this._progressBar);
    this._text = new BaseDOM({
      className: 'text'
    });
    this._container.appendChild(this._text);
  }
  ProgressBlocker.get({
    title: function() {
      return this._title.html;
    }
  });
  ProgressBlocker.set({
    title: function(value) {
      return this._title.html = value;
    }
  });
  ProgressBlocker.get({
    progress: function() {
      return this._progressBar.progress;
    }
  });
  ProgressBlocker.set({
    progress: function(value) {
      return this._progressBar.progress = value;
    }
  });
  ProgressBlocker.get({
    text: function() {
      return this._text.html;
    }
  });
  ProgressBlocker.set({
    text: function(value) {
      return this._text.html = value;
    }
  });
  return ProgressBlocker;
})(slikland.erlik.ui.Blocker);
var __hasProp = {}.hasOwnProperty;
slikland.erlik.ui.ProgressBar = (function(_super) {
  __extends(ProgressBar, _super);
  function ProgressBar(data) {
    ProgressBar.__super__.constructor.call(this, {
      element: 'div',
      className: 'erlik_progressbar'
    });
    this._progress = Number.POSITIVE_INFINITY;
    this._progressBar = new BaseDOM({
      element: 'div',
      className: 'progress'
    });
    this.appendChild(this._progressBar);
    this.color = 0x9999FF;
    this.progress = 0.5;
  }
  ProgressBar.get({
    progress: function() {
      return this._progress;
    }
  });
  ProgressBar.set({
    progress: function(value) {
      var p;
      this._progress = value;
      p = 1;
      if (isFinite(this._progress)) {
        p = this._progress;
      }
      if (p > 1) {
        p = 1;
      } else if (p < 0) {
        p = 0;
      }
      return this._progressBar.css({
        width: p * 100 + '%'
      });
    }
  });
  ProgressBar.get({
    color: function() {
      return this._color;
    }
  });
  ProgressBar.set({
    color: function(value) {
      var b, bgB, bgG, bgR, c, g, hexRE, l, max, o, r, rgbRE;
      if (typeof value === 'string') {
        hexRE = /^#((?:[\da-f]{3}){1,2})/i;
        rgbRE = /^rgba?\(([\d]+).*?([\d]+).*?([\d]+).*?\)/i;
        if (o = hexRE.exec(value)) {
          c = o[1];
          l = c.length / 3;
          c = parseInt(c, 16);
          max = Math.pow(16, l) - 1;
          r = ((c >> (4 * l * 2) & max) / max) * 0xFF;
          g = ((c >> (4 * l * 1) & max) / max) * 0xFF;
          b = ((c >> (4 * l * 0) & max) / max) * 0xFF;
        } else if (o = rgbRE.exec(value)) {
          r = Number(o[1]);
          g = Number(o[2]);
          b = Number(o[3]);
        } else {
          throw new Error('Not a color value');
        }
      } else {
        r = value >> 16 & 0xFF;
        g = value >> 8 & 0xFF;
        b = value >> 0 & 0xFF;
      }
      value = r << 16 | g << 8 | b;
      bgR = ((0xFF - r) * 0.5 + r) >> 0;
      bgG = ((0xFF - g) * 0.5 + g) >> 0;
      bgB = ((0xFF - b) * 0.5 + b) >> 0;
      this.css({
        'background-color': "rgb(" + bgR + ", " + bgG + ", " + bgB + ")"
      });
      this._progressBar.css({
        'background-color': "rgb(" + r + ", " + g + ", " + b + ")"
      });
      return this._color = value;
    }
  });
  return ProgressBar;
})(BaseDOM);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.ui.Lightbox = (function(_super) {
  __extends(Lightbox, _super);
  Lightbox.CLOSE = 'close';
  Lightbox._instances = [];
  Lightbox.open = function(content) {
    var instance;
    if (content == null) {
      content = null;
    }
    instance = new Lightbox(content);
    instance.open();
    return instance;
  };
  Lightbox.closeAll = function() {
    var i;
    i = this._instances.length;
    while (i-- > 0) {
      this._instances[i].close();
    }
    return this._instances.length = 0;
  };
  Lightbox._registerInstance = function(instance) {
    return this._instances.push(instance);
  };
  Lightbox._unregisterInstance = function(instance) {
    var i, _ref, _results;
    _results = [];
    while ((i = this._instances.indexOf(instance)) >= 0) {
      _results.push((_ref = this._instances.splice(i, 1)[0]) != null ? _ref.destroy() : void 0);
    }
    return _results;
  };
  function Lightbox(data) {
    this._updateContainerSize = __bind(this._updateContainerSize, this);
    this._checkContainerSize = __bind(this._checkContainerSize, this);
    this.close = __bind(this.close, this);
    this.open = __bind(this.open, this);
    this._toggle = false;
    Lightbox.__super__.constructor.call(this, {
      element: 'div',
      className: 'erlik_lightbox'
    });
    this._prevContentSize = [0, 0];
    this.constructor._registerInstance(this);
    this._contentWrapper = new BaseDOM({
      element: 'div',
      className: 'erlik_lightbox_wrapper'
    });
    this.appendChild(this._contentWrapper);
    this._header = new BaseDOM({
      element: 'div',
      className: 'erlik_lightbox_header'
    });
    this._title = new BaseDOM({
      element: 'span',
      className: 'erlik_lightbox_title'
    });
    this._title.html = data.title || '';
    this._header.appendChild(this._title);
    this._closeBtn = new slikland.erlik.ui.Button({
      icon: 'fa-close'
    });
    this._closeBtn.element.on('click', this.close);
    this._closeBtn.addClass('close_btn');
    this.appendChild(this._closeBtn);
    this._header.appendChild(this._closeBtn);
    this._contentWrapper.appendChild(this._header);
    if (data.width != null) {
      this._contentWrapper.css('width', data.width);
    }
    if (data.height != null) {
      this._contentWrapper.css('height', data.height);
    }
    this._container = new BaseDOM({
      element: 'div',
      className: 'erlik_lightbox_container'
    });
    if (data.content) {
      this._content = data.content;
      this._container.appendChild(data.content);
    }
    this._contentWrapper.appendChild(this._container);
  }
  Lightbox.prototype.open = function() {
    document.body.appendChild(this.element);
    return this._watchContainerSize();
  };
  Lightbox.prototype.close = function() {
    var _ref;
    this.trigger(this.constructor.CLOSE);
    if ((_ref = this.element.parentNode) != null) {
      _ref.removeChild(this.element);
    }
    this.constructor._unregisterInstance(this);
    return this._unwatchContainerSize();
  };
  Lightbox.prototype.destroy = function() {
    this._closeBtn.element.off('click', this.close);
    return Lightbox.__super__.destroy.apply(this, arguments);
  };
  Lightbox.prototype._watchContainerSize = function() {
    return this._checkContainerSize();
  };
  Lightbox.prototype._unwatchContainerSize = function() {
    if (this._containerSizeWatchAnimationFrame != null) {
      return window.cancelAnimationFrame(this._containerSizeWatchAnimationFrame);
    }
  };
  Lightbox.prototype._checkContainerSize = function() {
    setTimeout(this._updateContainerSize, 0);
    return this._containerSizeWatchAnimationFrame = window.requestAnimationFrame(this._checkContainerSize);
  };
  Lightbox.prototype._updateContainerSize = function() {
    var bounds;
    if (this._content != null) {
      bounds = this._content.getBounds();
      if (this._prevContentSize[0] !== bounds.width || this._prevContentSize[1] !== bounds.height) {
        this._contentWrapper.css({
          width: '',
          height: ''
        });
        bounds = this._content.getBounds();
        this._contentWrapper.css({
          width: bounds.width + 'px',
          height: (bounds.height + this._header.height) + 'px'
        });
        bounds = this._content.getBounds();
        this._prevContentSize[0] = bounds.width;
        return this._prevContentSize[1] = bounds.height;
      }
    }
  };
  return Lightbox;
})(BaseDOM);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.ui.Button = (function(_super) {
  __extends(Button, _super);
  Button.CLICK = 'click';
  function Button(data) {
    this._redraw = __bind(this._redraw, this);
    this._click = __bind(this._click, this);
    this._toggle = false;
    Button.__super__.constructor.call(this, {
      element: 'button',
      className: 'erlik_button'
    });
    if (data.icon != null) {
      this._icon = new BaseDOM({
        element: 'i',
        className: 'fa ' + data.icon
      });
      this.appendChild(this._icon);
    }
    if (data.label != null) {
      this._label = new BaseDOM({
        element: 'spane',
        className: 'label'
      });
      this._label.html = data.label;
      this.appendChild(this._label);
    }
    this._data = data;
    this.toggle = data.toggle || false;
    this.element.on('click', this._click);
  }
  Button.prototype._click = function() {
    this.selected = !this.selected;
    return this.trigger(this.constructor.CLICK);
  };
  Button.get({
    data: function() {
      return this._data;
    }
  });
  Button.get({
    toggle: function() {
      return this._toggle;
    }
  });
  Button.set({
    toggle: function(value) {
      if (this._toggle === value) {
        return;
      }
      this._toggle = value;
      if (!this._toggle) {
        return this.selected = false;
      }
    }
  });
  Button.get({
    selected: function() {
      return this._selected;
    }
  });
  Button.set({
    selected: function(value) {
      if (this._selected === value) {
        return;
      }
      this._selected = value;
      return this.toggleClass('selected', this._selected && this._toggle);
    }
  });
  Button.get({
    value: function() {
      return this.selected;
    }
  });
  Button.set({
    value: function(value) {
      return this.selected = value;
    }
  });
  Button.set({
    _dirty: function(value) {
      if (!value) {
        return;
      }
      clearTimeout(this._dirtyCallback);
      return this._dirtyCallback = setTimeout(this._redraw, 0);
    }
  });
  Button.prototype._redraw = function() {};
  return Button;
})(BaseDOM);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.Toolbar = (function(_super) {
  __extends(Toolbar, _super);
  Toolbar.DEFAULT_ICONS = [['bold', 'italic', 'underline', 'strikethrough', 'color'], ['left', 'center', 'right', 'justify'], ['indent', 'outdent', 'orderedlist', 'unorderedlist'], ['media', 'gallery']];
  function Toolbar() {
    this._iconClick = __bind(this._iconClick, this);
    this._change = __bind(this._change, this);
    this._items = [];
    Toolbar.__super__.constructor.call(this, {
      element: 'div',
      className: 'erlik_toolbar'
    });
  }
  Toolbar.prototype.getState = function(data) {};
  Toolbar.prototype.setState = function(data) {};
  Toolbar.prototype.buildItems = function(items, container) {
    var icon, iconContainer, item, _i, _len, _results;
    if (container == null) {
      container = this;
    }
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (Array.isArray(item)) {
        iconContainer = new BaseDOM({
          element: 'span',
          className: 'icon-container'
        });
        this.buildItems(item, iconContainer);
        _results.push(container.appendChild(iconContainer));
      } else {
        if (item != null ? item.toolbarUI : void 0) {
          icon = item.toolbarUI;
          container.appendChild(icon);
          _results.push(this._items.push(icon));
        } else {
          _results.push(void 0);
        }
      }
    }
    return _results;
  };
  Toolbar.prototype._triggerChange = function() {
    clearTimeout(this._changeTimeout);
    return this._changeTimeout = setTimeout(this._change, 0);
  };
  Toolbar.prototype._change = function() {
    return this.trigger(this.constructor.CHANGE);
  };
  Toolbar.prototype._iconClick = function(e) {
    this.trigger(this.constructor.ITEM_CHANGE, e.currentTarget);
    return this._triggerChange();
  };
  Toolbar.prototype._itemValidation_b = function(value, key) {
    if (value > 500 || value === 'bold') {
      return true;
    }
    return false;
  };
  Toolbar.prototype._itemValidation_i = function(value, key) {
    if (value === 'italic') {
      return true;
    }
    return false;
  };
  Toolbar.prototype._itemValidation_u = function(value, key) {
    if (value === 'underline') {
      return true;
    }
    return false;
  };
  Toolbar.prototype._itemValidation_s = function(value, key) {
    if (value === 'line-through') {
      return true;
    }
    return false;
  };
  Toolbar.prototype._itemValidation_left = function(value, key) {
    if (value === 'left') {
      return true;
    }
    return false;
  };
  Toolbar.prototype._itemValidation_right = function(value, key) {
    if (value === 'right') {
      return true;
    }
    return false;
  };
  Toolbar.prototype._itemValidation_center = function(value, key) {
    if (value === 'center') {
      return true;
    }
    return false;
  };
  Toolbar.prototype._itemValidation_justify = function(value, key) {
    if (value === 'justify') {
      return true;
    }
    return false;
  };
  return Toolbar;
})(BaseDOM);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.erlik.Editor = (function(_super) {
  __extends(Editor, _super);
  Editor.CLASS_NAME = 'erlik_editor';
  Editor.UPDATE_SELECTION = 'erlik_editor_updateSelection';
  Editor.DOM_CHANGED = 'erlik_editor_domChanged';
  function Editor() {
    this._keyDown = __bind(this._keyDown, this);
    this.execCommand = __bind(this.execCommand, this);
    this._onPaste = __bind(this._onPaste, this);
    this._domChanged = __bind(this._domChanged, this);
    this._update = __bind(this._update, this);
    this.update = __bind(this.update, this);
    Editor.__super__.constructor.call(this, {
      element: 'div',
      className: this.constructor.CLASS_NAME
    });
    this._element.contentEditable = true;
    this._element.on('keydown', this._keyDown);
    this._element.on('keyup', this.update);
    this._element.on('mouseup', this.update);
    this._element.on('paste', this._onPaste);
  }
  Editor.get({
    value: function() {
      return this.html;
    }
  });
  Editor.set({
    value: function(value) {
      this.html = value;
      return this._domChanged();
    }
  });
  Editor.prototype.update = function() {
    clearTimeout(this._updateTimeout);
    return this._updateTimeout = setTimeout(this._update, 0);
  };
  Editor.prototype._findSelectionParents = function(node) {
    var parents;
    parents = [];
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        parents.push(node);
        if (node.matches('.' + this.constructor.CLASS_NAME)) {
          break;
        }
      }
      node = node.parentNode;
    }
    return parents;
  };
  Editor.prototype._update = function() {
    var p, parents, styles, _i, _len;
    parents = this._findSelectionParents(window.getSelection().anchorNode);
    styles = [];
    for (_i = 0, _len = parents.length; _i < _len; _i++) {
      p = parents[_i];
      styles.push(window.getComputedStyle(p));
    }
    return this.trigger(this.constructor.UPDATE_SELECTION, {
      styles: styles,
      parents: parents
    });
  };
  Editor.prototype._domChanged = function() {
    return this.stackTrigger(this.constructor.DOM_CHANGED);
  };
  Editor.prototype._onPaste = function(e) {
    var data;
    data = e.clipboardData || window.clipboardData;
    return this._domChanged();
  };
  Editor.prototype.focus = function() {
    return this._element.focus();
  };
  Editor.prototype.blur = function() {
    var selection;
    selection = this.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
    return this._element.blur();
  };
  Editor.prototype._isChildOf = function(node) {
    while (node) {
      if (node === this._element) {
        return true;
      }
      node = node.parentNode;
      if (node === document.body) {
        return false;
      }
    }
    return false;
  };
  Editor.prototype.getSelection = function() {
    var selection;
    selection = window.getSelection();
    if (selection == null) {
      return null;
    }
    if (!this._isChildOf(document.activeElement)) {
      return null;
    }
    return selection;
  };
  Editor.prototype.getRange = function() {
    var selection;
    selection = this.getSelection();
    if (selection == null) {
      return null;
    }
    if (selection.rangeCount < 1) {
      return null;
    }
    return selection.getRangeAt(0);
  };
  Editor.prototype.execCommand = function(command, showDefaultUI, args) {
    if (showDefaultUI == null) {
      showDefaultUI = false;
    }
    if (args == null) {
      args = null;
    }
    return document.execCommand(command, showDefaultUI, args);
  };
  Editor.prototype._keyDown = function(e) {
    var prevent;
    prevent = false;
    switch (e.keyCode) {
      case 13:
        if (e.metaKey) {
          prevent = true;
          this._execCommand('insertParagraph');
        }
    }
    if (prevent) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    return this.update();
  };
  return Editor;
})(BaseDOM);
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
slikland.Erlik = (function(_super) {
  __extends(Erlik, _super);
  Erlik.EDIT_PLUGIN = 'erlik_edit_plugin';
  Erlik.BASE_CSS = ".erlik .media-gallery{display:block;width:100%;position:relative;border:1px solid #ccc;padding:16px;box-sizing:border-box;}.erlik .media-gallery:hover,.erlik .media-gallery:focus{border-color:#000}.erlik .media-item{display:inline-block;border:1px solid #ccc;}.erlik .media-item:hover,.erlik .media-item:focus{border-color:#000}.erlik .media-item .item{display:none;}.erlik .media-item .item:first-child{display:inline-block}.erlik_blocker{font-family:Tahoma,Geneva,sans-serif;position:fixed;top:0;left:0;bottom:0;right:0;display:block;background-color:rgba(255,255,255,0.7);text-align:center;}.erlik_blocker:before{vertical-align:middle;content:'';display:inline-block;height:100%}.erlik_blocker .erlik_blocker_container{text-align:left;vertical-align:middle;display:inline-block;white-space:nowrap;position:relative;}.erlik_blocker .erlik_blocker_container .title{font-weight:bold}.erlik_blocker .erlik_blocker_container .text{font-size:.8em}.erlik_lightbox{font-family:Tahoma,Geneva,sans-serif;position:fixed;top:0;left:0;bottom:0;right:0;display:block;background-color:rgba(255,255,255,0.7);text-align:center;}.erlik_lightbox:before{vertical-align:middle;content:'';display:inline-block;height:100%}.erlik_lightbox .button,.erlik_lightbox .erlik_button,.erlik_lightbox button{appearance:none;outline:none;cursor:pointer;background-color:transparent;border:0;font-size:24px;}.erlik_lightbox .button:hover,.erlik_lightbox .erlik_button:hover,.erlik_lightbox button:hover{opacity:.6}.erlik_lightbox .close_btn{float:right}.erlik_lightbox .erlik_lightbox_wrapper{text-align:left;vertical-align:middle;display:inline-block;white-space:nowrap;position:relative;border:1px solid #666;border-radius:2px;box-shadow:1px 1px 1px 1px #ccc;background-color:#fff;min-width:400px;min-height:300px;max-height:99%;}.erlik_lightbox .erlik_lightbox_wrapper .erlik_lightbox_header{position:relative;height:2em;border-bottom:1px solid #ccc;}.erlik_lightbox .erlik_lightbox_wrapper .erlik_lightbox_header .erlik_lightbox_title{padding-left:.5em;line-height:2em;font-weight:bold}.erlik_lightbox .erlik_lightbox_wrapper .erlik_lightbox_container{position:absolute;overflow:auto;top:2em;left:0;right:0;bottom:0;}.erlik_lightbox .erlik_lightbox_wrapper .erlik_lightbox_container>*{display:inline-block}.erlik_progressbar{display:inline-block;font-size:10px;border-radius:1em;overflow:hidden;min-width:200px;min-height:1em;position:relative;box-shadow:1px 1px 1px 1px #ccc;}.erlik_progressbar .progress{animation-name:progressbar-pattern-animation;animation-duration:.4s;animation-iteration-count:infinite;animation-timing-function:linear;position:absolute;top:0;left:0;width:100%;height:100%;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKBAMAAAB/HNKOAAAAD1BMVEUAAAD5+flubm4BAQHf39/aLetdAAAABXRSTlMaGiMVEbCRADYAAAAoSURBVAjXYxAUMWBgYhB0ZmBQZAAxBRlATEEGEFOEAcQE8oFMA0wmAHYCA/0rayZfAAAAAElFTkSuQmCC\");background-size:10px 100%}@-moz-keyframes progressbar-pattern-animation{0%{background-position:0 0}100%{background-position:9px 0}}@-webkit-keyframes progressbar-pattern-animation{0%{background-position:0 0}100%{background-position:9px 0}}@-o-keyframes progressbar-pattern-animation{0%{background-position:0 0}100%{background-position:9px 0}}@keyframes progressbar-pattern-animation{0%{background-position:0 0}100%{background-position:9px 0}}.cropper .cropper_container{position:relative;}.cropper .cropper_container .cropper_image{position:absolute}.cropper .cropper_container .cropper_mask{position:absolute;top:0;left:0;bottom:0;right:0;}.cropper .cropper_container .cropper_mask .cropper_mask_item{position:absolute;background-color:rgba(128,128,128,0.4)}.cropper .cropper_container .cropper_mask .cropper_mask_dragger{position:absolute;cursor:pointer}.cropper .cropper_container .cropper_mask .cropper_mask_resizer{position:absolute;width:8px;height:8px;margin-top:-5px;margin-left:-5px;background-color:#999;border-top:1px solid #ccc;border-left:1px solid #ccc;border-bottom:1px solid #666;border-right:1px solid #666;}.cropper .cropper_container .cropper_mask .cropper_mask_resizer.tl,.cropper .cropper_container .cropper_mask .cropper_mask_resizer.br{cursor:nwse-resize}.cropper .cropper_container .cropper_mask .cropper_mask_resizer.tr,.cropper .cropper_container .cropper_mask .cropper_mask_resizer.bl{cursor:nesw-resize}.cropper .cropper_gallery .cropper_thumb{opacity:.6;cursor:pointer;padding:6px;vertical-align:top;width:120px;}.cropper .cropper_gallery .cropper_thumb.selected{opacity:1}.cropper .cropper_gallery .cropper_thumb .container{width:120px;height:120px;display:block;border:1px solid #ccc;position:relative}.cropper .cropper_gallery .cropper_thumb.selected .container{border-color:#999}.cropper .cropper_gallery .cropper_thumb .label{text-align:center;font-size:10px;vertical-align:top;max-width:100%;white-space:normal}.align_middle:before{content:'';display:inline-block;vertical-align:middle;height:100%}.align_middle >*{display:inline-block;vertical-align:middle}.align_center{text-align:center;}.align_center >*{display:inline-block}.erlik{font-family:Tahoma,Geneva,sans-serif;border:1px solid #666;border-radius:2px;box-shadow:1px 1px 1px 1px #ccc;min-width:400px;min-height:300px;position:relative;outline:none;}.erlik div{outline:none}.erlik .button,.erlik .erlik_button,.erlik button{appearance:none;outline:none;cursor:pointer;background-color:transparent;border-top:1px solid rgba(0,0,0,0);border-left:1px solid rgba(0,0,0,0.05);border-right:1px solid #ccc;border-bottom:1px solid #666;}.erlik .button:hover,.erlik .erlik_button:hover,.erlik button:hover{background-color:rgba(0,0,0,0.01)}.erlik .button.selected,.erlik .erlik_button.selected,.erlik button.selected,.erlik .button:active,.erlik .erlik_button:active,.erlik button:active{background-color:rgba(0,0,0,0.02);border-right:1px solid rgba(0,0,0,0.05);border-bottom:1px solid rgba(0,0,0,0);border-left:1px solid #ccc;border-top:1px solid #666}.erlik .erlik_toolbar{display:block;position:absolute;width:100%;border-bottom:1px solid #ccc;min-height:1em;font-size:14px;}.erlik .erlik_toolbar .button,.erlik .erlik_toolbar .erlik_button,.erlik .erlik_toolbar button{font-size:1em;text-align:center;width:2em;height:2em;position:relative}.erlik .erlik_toolbar .icon-container{margin-right:.4em;position:relative}.erlik .erlik_editor{padding:8px;position:absolute;display:block;outline:none;overflow:scroll;bottom:0;left:0;right:0}";
  Erlik.STYLES = ['display', 'position', 'width', 'height', 'top', 'left', 'bottom', 'right'];
  Erlik._init = function() {
    if (this._inited) {
      return;
    }
    this._inited = true;
    this._appendCSS(this.BASE_CSS);
    return this._checkDependencies();
  };
  Erlik._checkDependencies = function() {
    var c, d, r, rules, ss, _cssDependencies, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _results;
    _cssDependencies = [
      {
        rule: '.fa',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css'
      }
    ];
    _ref = document.styleSheets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ss = _ref[_i];
      rules = ss.rules || ss.cssRules;
      for (_j = 0, _len1 = rules.length; _j < _len1; _j++) {
        r = rules[_j];
        for (_k = 0, _len2 = _cssDependencies.length; _k < _len2; _k++) {
          d = _cssDependencies[_k];
          if (d.found) {
            continue;
          }
          if (r.selectorText === d.rule) {
            d.found = true;
          }
        }
      }
    }
    _results = [];
    for (_l = 0, _len3 = _cssDependencies.length; _l < _len3; _l++) {
      c = _cssDependencies[_l];
      if (c.found) {
        continue;
      }
      _results.push(Erlik._embedCSS(c.src));
    }
    return _results;
  };
  Erlik._embedCSS = function(href) {
    var head, link;
    link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = href;
    head = document.querySelector('head') || document.body;
    return head.appendChild(link);
  };
  Erlik._appendCSS = function(content, container) {
    var head, si;
    if (container == null) {
      container = null;
    }
    head = document.querySelector('head') || document.body;
    if (container == null) {
      container = document.createElement('style');
      container.type = "text/css";
      head.appendChild(container);
      if (document.all) {
        si = head.querySelectorAll('style').length - 1;
        container = document.styleSheets[si];
      }
    }
    if (document.all) {
      container.cssText = content;
    } else {
      container.appendChild(document.createTextNode(content));
    }
    return container;
  };
  /**
  	Spritesheet Animation class
  	This class will animate a spritesheet. It already handles responsiveness.<br>
  	So If the size of the SpriteSheetAnimation div is set, the animation will fit in the defined size.<br>
  	If a size is not set, it'll use the size defined in the JSON object.
  	@class Erlik
  	@constructor
  	@extends BaseDOM
  	@param {HTMLElement | String} [target = null] Target textarea element or querySelector.
  	@param {Object} [config = {}] Config object for editor.
  	The Spritesheet image and json needs to be generated by Adobe Flash.<br>
  	It also accepts *trim* and *border* parameters set when exporting the Spritesheet from Adobe Flash.
  	Name |Type|Default|Description
  	-----|----|:------|-----------
  	image|Image|null|Image of spritesheet. It can either be a Image Element or PreloadJS image loader, which gives *data.tag* as image.
  	json|Object|null|JSON object defining the spritesheet. It can either be an Object or PreloadJS json loader, which gives *data.tag* as object.
  	useBackground|Bool|false|Boolean indicating if the Spritesheet Animation should use as background-image or a image element. Default is **false**. It's safer using an Image element instead of background-image for cross-browser integration.
  	@example
  	```
  	spritesheet = new SpriteSheetAnimation({image: someImage, json: someJson});
  	document.body.appendChild(spritesheet.element);
  	sprithesheet.play({repeat: false});
  	```
   */
  function Erlik(target, config) {
    var _target;
    if (target == null) {
      target = null;
    }
    if (config == null) {
      config = {};
    }
    this._toolbarItemChange = __bind(this._toolbarItemChange, this);
    this._editorUpdateSelection = __bind(this._editorUpdateSelection, this);
    this._updateDirty = __bind(this._updateDirty, this);
    this._domChanged = __bind(this._domChanged, this);
    this._onFocus = __bind(this._onFocus, this);
    this._keyDown = __bind(this._keyDown, this);
    this._test = __bind(this._test, this);
    console.log('--');
    console.log(Plugin.test);
    console.log('--');
    this.constructor._init();
    this._dirtyCallbacks = {};
    this._fonts = [];
    if (target) {
      if (typeof target === 'string') {
        if (!(_target = document.querySelector(target))) {
          console.warn(target + ' was not found in document.');
        }
      } else if (target instanceof BaseDOM) {
        _target = target.element;
      } else {
        _target = target;
      }
    }
    if (!_target) {
      _target = document.createElement({
        element: 'textarea'
      });
    }
    this._target = _target;
    Erlik.__super__.constructor.call(this, {
      element: 'div',
      className: 'erlik'
    });
    this._copyCSS();
    this._target.style.display = 'none';
    if (this._target.parentNode) {
      this._target.parentNode.insertBefore(this.element, this._target);
    }
    this.element.appendChild(this._target);
    this.attr('tabindex', 0);
    this._toolbar = new slikland.erlik.Toolbar();
    this._toolbar.on(slikland.erlik.Toolbar.ITEM_CHANGE, this._toolbarItemChange);
    this.appendChild(this._toolbar);
    this._editor = new slikland.erlik.Editor();
    this._editor.value = this._target.innerText;
    this._editor.on(slikland.erlik.Editor.UPDATE_SELECTION, this._editorUpdateSelection);
    this._editor.on(slikland.erlik.Editor.DOM_CHANGED, this._domChanged);
    this.appendChild(this._editor);
    this._pluginController = new slikland.erlik.core.PluginController(this, this._editor, this._toolbar, config);
    this.element.on('focus', this._onFocus);
    this.element.on('keyup', this._keyDown);
    this.on(this.constructor.EDIT_PLUGIN, this._test);
  }
  Erlik.get({
    value: function() {
      return this._editor.value;
    }
  });
  Erlik.set({
    value: function(value) {
      return this._editor.value = value;
    }
  });
  Erlik.get({
    dom: function() {
      var container, i, l, nodes;
      nodes = this._editor.childNodes;
      container = document.createElement('div');
      l = nodes.length;
      i = -1;
      while (++i < l) {
        container.appendChild(nodes[i].cloneNode(true));
      }
      return container;
    }
  });
  Erlik.prototype._test = function() {
    return console.log("EDIT");
  };
  Erlik.prototype._keyDown = function(e) {
    return e.preventDefault();
  };
  Erlik.prototype._onFocus = function() {
    return this._editor.focus();
  };
  Erlik.prototype._domChanged = function() {
    return this._pluginController.parseDOM(this._editor.element);
  };
  Erlik.prototype._redraw = function() {
    return this._editor.css({
      top: this._toolbar.height + 'px'
    });
  };
  Erlik.prototype._dirty = function(type) {
    this._dirtyCallbacks[type] = true;
    clearTimeout(this._dirtyTimeout);
    return this._dirtyTimeout = setTimeout(this._updateDirty, 0);
  };
  Erlik.prototype._updateDirty = function() {
    var k;
    for (k in this._dirtyCallbacks) {
      if (typeof this[k] === "function") {
        this[k]();
      }
    }
    this._dirtyCallbacks = {};
    return this._redraw();
  };
  Erlik.prototype._copyCSS = function() {
    var css, k, _i, _len, _ref, _results;
    css = window.getComputedStyle(this._target);
    _ref = this.constructor.STYLES;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      if (k === 'position' && css[k] === 'static') {
        _results.push(this.element['style'][k] = 'relative');
      } else {
        _results.push(this.element['style'][k] = css[k]);
      }
    }
    return _results;
  };
  Erlik.prototype._addFonts = function() {
    var f, fontFace, fontFaces, fontNames, style, weight, _i, _len, _ref;
    fontNames = [];
    fontFaces = [];
    _ref = this._fonts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      fontNames.push(f.name);
      if (f.src) {
        weight = f.weight || 'normal';
        style = f.style || 'normal';
        fontFace = "@font-face {\n	font-family: " + f.name + ";\n	src: url('" + f.src + "'), url('" + f.src + "?#iefix') format('embedded-opentype'), url('" + f.src + "') format('woff'), url('" + f.src + "') format('truetype'), url('" + f.src + "#0e367a30b984427caad4ff30c417ba64') format('svg');\n	font-weight: " + weight + ";\n	font-style: " + style + ";\n}";
        fontFaces.push(fontFaces);
      }
    }
    fontFaces = fontFaces.join('\n');
    if (this._fontStyleContainer) {
      return this.constructor._appendCSS(fontFaces, this._fontStyleContainer);
    } else {
      return this._fontStyleContainer = this.constructor._appendCSS(fontFaces);
    }
  };
  Erlik.prototype.addFont = function(name, src, weight, style) {
    var f, _i, _len, _ref;
    if (src == null) {
      src = null;
    }
    if (weight == null) {
      weight = 'normal';
    }
    if (style == null) {
      style = 'normal';
    }
    _ref = this._fonts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      if (f.name === name) {
        return;
      }
    }
    this._fonts.push({
      name: name,
      src: src,
      weight: weight,
      style: style
    });
    return this._dirty('_addFonts');
  };
  Erlik.prototype.addFonts = function(arr) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      item = arr[_i];
      _results.push(this.addFont(item.name, item.src, item.weight, item.style));
    }
    return _results;
  };
  Erlik.prototype._editorUpdateSelection = function(e, data) {
    return this._pluginController.update(data);
  };
  Erlik.prototype._toolbarItemChange = function(e, target) {
    var command;
    command = target.data.command;
    if (command) {
      this._editor.execCommand(command, null, target.selected);
    }
    return this._editor.update();
  };
  return Erlik;
})(BaseDOM);
window.slikland.Erlik = slikland.Erlik;
var Embeded;
Embeded = (function() {
  function Embeded() {
    var config, textarea;
    app.body = new BaseDOM({
      element: document.body
    });
    textarea = new BaseDOM({
      element: 'textarea'
    });
    textarea.html = '<div class="image erlik_plugin media-item" contenteditable="false" tabindex="0" data="%7B%22image%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fuploads%2F57aa30d97285a.png%22%2C%22sizes%22%3A%5B%7B%22id%22%3A%22destaque%22%2C%22size%22%3A%5B100%2C130%5D%2C%22bounds%22%3A%7B%22x%22%3A0.11538461538462%2C%22y%22%3A0%2C%22w%22%3A0.76923076923077%2C%22h%22%3A1%7D%2C%22url%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fcropped%2F57aa30d97285adestaque.png%22%7D%2C%7B%22id%22%3A%22destaque1%22%2C%22size%22%3A%5B250%2C200%5D%2C%22bounds%22%3A%7B%22x%22%3A0%2C%22y%22%3A0.1%2C%22w%22%3A1%2C%22h%22%3A0.8%7D%2C%22url%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fcropped%2F57aa30d97285adestaque1.png%22%7D%2C%7B%22id%22%3A%22destaue2%22%2C%22size%22%3A%5B500%2C500%5D%2C%22bounds%22%3A%7B%22x%22%3A0%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%7D%2C%22url%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fcropped%2F57aa30d97285adestaue2.png%22%7D%2C%7B%22id%22%3A%22destaue3%22%2C%22size%22%3A%5B100%2C100%5D%2C%22bounds%22%3A%7B%22x%22%3A0%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%7D%2C%22url%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fcropped%2F57aa30d97285adestaue3.png%22%7D%5D%7D"><img class="item" src="http://local.slikland.com/s0.Slikland.Framework/plugins/erlik/deploy/dynamic/cropped/57aa30d97285adestaque.png"><img class="item" src="http://local.slikland.com/s0.Slikland.Framework/plugins/erlik/deploy/dynamic/cropped/57aa30d97285adestaque1.png"><img class="item" src="http://local.slikland.com/s0.Slikland.Framework/plugins/erlik/deploy/dynamic/cropped/57aa30d97285adestaue2.png"><img class="item" src="http://local.slikland.com/s0.Slikland.Framework/plugins/erlik/deploy/dynamic/cropped/57aa30d97285adestaue3.png"></div>asd as das das da<b>asdasdas</b>asdasdasd';
    textarea.css({
      width: '800px'
    });
    app.body.appendChild(textarea);
    config = {
      toolbar: [['font'], ['bold', 'italic', 'underline', 'strikethrough', 'color'], ['left', 'center', 'right', 'justify', 'indent', 'outdent'], ['orderedlist', 'unorderedlist'], ['image', 'video', 'gallery']],
      plugins: [],
      fonts: [
        {
          name: "Some font",
          src: "",
          tags: ['a', 'b', 'i']
        }, {
          name: "Some font",
          "default": true
        }
      ],
      image: {
        uploadService: "/api/image/upload",
        cropService: "/api/crop.php",
        type: "image/*",
        types: [
          {
            name: "Imagem destaque",
            id: "destaque",
            type: "image/*",
            size: [100, 130]
          }, {
            name: "Mobile",
            id: "destaque1",
            type: "image/*",
            size: [250, 200]
          }, {
            name: "Thumb",
            id: "destaue2",
            size: [500, 500]
          }, {
            name: "Imagem destaque3",
            id: "destaue3",
            type: "image/*",
            size: [100, 100]
          }
        ]
      }
    };
    this._erlik = new slikland.Erlik(textarea, config);
    this._erlik.addFont('Some font');
    this._erlik.addFonts([]);
  }
  return Embeded;
})();
app.on('windowLoad', function() {
  return new Embeded();
});
}).call(this);