(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author maczyt
 */

var prefix = "d";
var Directive = require("./Directive");
var Watcher = require("./Watcher");
var Dep = require("./Dep");

var Compile = function () {
  function Compile(vm, root) {
    _classCallCheck(this, Compile);

    this.vm = vm;
    this.parseNode(root, true);
  }

  /**
   * parse 元素
   * @param {*} node
   * @param {*} ifRoot
   */


  _createClass(Compile, [{
    key: "parseNode",
    value: function parseNode(node, ifRoot) {
      var self = this;
      if (node.nodeType === 3) {
        return this.parseTextNode(node);
      }
      if (!ifRoot) {
        this.cloneAttribute(node.attributes).forEach(function (attr) {
          if (RegExp("^" + prefix + "-").test(attr.name)) {
            self.bindDirective(node, attr);
          }
        });
      }
      Array.prototype.forEach.call(node.childNodes, function (el) {
        self.parseNode(el);
      });
    }

    /**
     * 处理文本节点
     * @param {*} node
     */

  }, {
    key: "parseTextNode",
    value: function parseTextNode(node) {
      var text = node.wholeText;
      var reg = /\{\{(.*?)\}\}/g;
      var exec = reg.exec(text);
      if (exec) {
        var value = exec[1];
        var pipeIndex = value.indexOf("|");
        var exp = pipeIndex !== "-1" ? value.slice(0, pipeIndex).trim() : value.trim();
        var filters = pipeIndex !== "-1" ? value.slice(pipeIndex + 1).split("|").map(function (filter) {
          return filter.trim();
        }) : [];
        var def = Directive["text"];
        def && def.call(Directive, node, this.vm, exp, filters);
      }
    }
  }, {
    key: "cloneAttribute",
    value: function cloneAttribute(attributes) {
      return Array.prototype.map.call(attributes, function (attr) {
        return {
          name: attr.name,
          value: attr.value
        };
      });
    }

    /**
     * 处理元素节点
     * 编译指令并添加watcher
     * @param {*} node
     * @param {*} attr
     */

  }, {
    key: "bindDirective",
    value: function bindDirective(node, attr) {
      node.removeAttribute(attr.name);
      var name = attr.name;
      var value = attr.value;
      var directive = name.slice(prefix.length + 1);
      var pipeIndex = value.indexOf("|");
      var exp = pipeIndex !== -1 ? value.slice(0, pipeIndex).trim() : value.trim();
      var filters = pipeIndex !== -1 ? value.slice(pipeIndex + 1).split("|").map(function (filter) {
        return filter.trim();
      }) : [];
      var def = Directive[directive];
      def && def.call(Directive, node, this.vm, exp, filters);
    }
  }]);

  return Compile;
}();

module.exports = Compile;

},{"./Dep":2,"./Directive":3,"./Watcher":7}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dep = function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.$watchers = [];
  }

  _createClass(Dep, [{
    key: "add",
    value: function add(watcher) {
      this.$watchers.push(watcher);
    }
  }, {
    key: "notify",
    value: function notify() {
      this.$watchers.forEach(function (watcher) {
        watcher.update();
      });
    }
  }]);

  return Dep;
}();

Dep.target = null;
module.exports = Dep;

},{}],3:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Watcher = require("./Watcher");
var Filters = require("./Filter");
var Utils = require("./Utils");

var Directive = {
  text: function text(node, vm, exp, filters) {
    this.bind(node, vm, exp, "text", filters);
  },
  show: function show(node, vm, exp) {
    this.bind(node, vm, exp, "show");
  },
  bind: function bind(node, vm, exp, prefix) {
    var filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    filters = filters.map(function (fn) {
      if (Filters[fn]) {
        return Filters[fn];
      }
    });
    var value = vm[exp];
    if (filters.length > 0) {
      value = Utils.compose.apply(Utils, _toConsumableArray(filters))(value);
    }
    var updater = Updater[prefix];
    // initial view
    updater(node, value);
    new Watcher(node, vm, exp, function (val) {
      if (filters.length > 0) {
        updater(node, Utils.compose.apply(Utils, _toConsumableArray(filters))(val));
      } else {
        updater(node, val);
      }
    });
  }
};

module.exports = Directive;

var Updater = {
  text: function text(node, val) {
    node.textContent = val;
  },
  show: function show(node, val) {
    node.style.display = val ? "" : "none";
  }
};

},{"./Filter":4,"./Utils":6,"./Watcher":7}],4:[function(require,module,exports){
"use strict";

module.exports = {
  upperCase: function upperCase(val) {
    return val.toUpperCase();
  }
};

},{}],5:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dep = require("./Dep");

var Observer = function Observer(data) {
  _classCallCheck(this, Observer);

  observe(data);
};

module.exports = Observer;

/**
 * 监听data
 * @param {*} data
 */
function observe(data) {
  if (!data || (typeof data === "undefined" ? "undefined" : _typeof(data)) !== "object") return;
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
}

/**
 * 监听key
 * @param {*} data
 * @param {*} key
 * @param {*} val
 */
function defineReactive(data, key, val) {
  var dep = new Dep();
  observe(val);
  Object.defineProperty(data, key, {
    enumerable: true,
    get: function get() {
      Dep.target && dep.add(Dep.target);
      return val;
    },
    set: function set(newVal) {
      val = newVal;
      dep.notify();
    }
  });
}

},{"./Dep":2}],6:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = {
  compose: function compose() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return fns.reduce(function (args, fn) {
        return fn.apply(undefined, _toConsumableArray([].concat(args)));
      }, [].concat(args));
    };
  }
};

},{}],7:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dep = require("./Dep");

var Watcher = function () {
  function Watcher(node, vm, exp, cb) {
    _classCallCheck(this, Watcher);

    this.node = node;
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
  }

  _createClass(Watcher, [{
    key: "update",
    value: function update() {
      this.run();
    }
  }, {
    key: "run",
    value: function run() {
      var value = this.get();
      this.cb.call(this.vm, value);
    }
  }, {
    key: "get",
    value: function get() {
      Dep.target = this;
      var value = this.vm[this.exp];
      Dep.target = null;
      return value;
    }
  }]);

  return Watcher;
}();

module.exports = Watcher;

},{"./Dep":2}],8:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observer = require("./Observer");
var Compile = require("./Compile");

var Dahua = function () {
  function Dahua(opts) {
    _classCallCheck(this, Dahua);

    this.$el = document.querySelector(opts.el);
    this.$data = opts.data;
    this.proxy();
    this.init();
  }

  _createClass(Dahua, [{
    key: "init",
    value: function init() {
      this.observe();
      this.compile();
    }
  }, {
    key: "proxy",
    value: function proxy() {
      var _this = this;

      Object.keys(this.$data).forEach(function (key) {
        Object.defineProperty(_this, key, {
          get: function get() {
            return this.$data[key];
          },
          set: function set(newVal) {
            this.$data[key] = newVal;
          }
        });
      });
    }
  }, {
    key: "observe",
    value: function observe() {
      this.$observer = new Observer(this.$data);
    }
  }, {
    key: "compile",
    value: function compile() {
      this.$compile = new Compile(this, this.$el);
    }
  }]);

  return Dahua;
}();

window.Dahua = Dahua;

},{"./Compile":1,"./Observer":5}]},{},[8]);
