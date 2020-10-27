(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash'), require('function-bind')) :
  typeof define === 'function' && define.amd ? define(['lodash', 'function-bind'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var oldArrayProtoMethods = Array.prototype; // oldArrayProtoMethods.push = function(){} 不能直接改写数组原有方法 不可靠，因为只有被Vue控制的数组才需要改写

  var arrayMethods = Object.create(Array.prototype);
  var methods = [// concat slice ... 都不能改变原数组
  'push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];
  methods.forEach(function (method) {
    // AOP切片编程
    arrayMethods[method] = function () {
      var _oldArrayProtoMethods;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 重写数组方法
      // todo ...
      // 有可能用户新增的数据时对象格式，也需要进行拦截
      var result = (_oldArrayProtoMethods = oldArrayProtoMethods[method]).call.apply(_oldArrayProtoMethods, [this].concat(args));

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // splice(0,1,xxx)
          inserted = args.slice(2);
      }

      if (inserted) {
        ob.observeArray(inserted);
      }
      ob.dep.notify(); // console.log('数组变化了');

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 需要对整个value属性重新定义
      // value可能是对象 可能是数组 分类来处理
      // value.__obj__ = this;  这行会死循环
      this.dep = new Dep(); // 给数组本身和对象本身增加一个dep属性

      Object.defineProperty(value, '__ob__', {
        value: this,
        enumerable: false,
        // 不能被枚举表示 不能被循环
        configurable: false // 不能删除此属性

      });

      if (Array.isArray(value)) {
        // push shift reverse sort 我要重写这些方法增加更新逻辑
        // value.__proto__ = arrayMethods; // 有些浏览器不支持 __proto__写法
        Object.setPrototypeOf(value, arrayMethods); // 循环将属性赋予上去

        this.observeArray(value); // 原有数组中的对象   Object.freeze()
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        for (var i = 0; i < value.length; i++) {
          // 如果数组中是对象的话，就回去递归观测
          // 观测的时候会增加__ob__属性
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        // 将对象中的所有key 重新用defineProperty定义成响应式的
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function dependArray(value) {
    // 就是让里层数组收集外层数组的依赖，这样修改里层数组也可以
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(data, key, value) {
    // vue2中数据不适合嵌套过深  过深浪费性能
    // value 可能也是一个对象
    var childOb = observe(value); // 对结果递归拦截

    var dep = new dep(); // 每次都会给属性创建一个dep

    Object.defineProperty(data, key, {
      // 需要给每个属性都增加一个dep
      get: function get() {
        if (Dep.target) {
          dep.depend(); // 让这个属性自己的dep记住这个watcher，也要让watcher记住这个dep
          // childOb 可能是对象 也可能是数组

          if (childOb) {
            // 如果对数组取值 会将当前的watcher呵呵数组进行关联
            childOb.dep.depend();

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(data); // data[key] = newValue; // ?

        value = newValue;
        dep.notify(); //通知dep中记录的watcher让它去执行 
      }
    });
  }
  function observe(data) {
    // 只对对象类型进行观测 非对象类型无法观测
    if (_typeof(data) !== 'object' || data == null) return; // 不是对象或者是null 观测不了
    // 通过类来对实现对数据的观测 类可以方法扩展，会产生实例

    if (data.__ob__) {
      // 如果被观测过了 放弃循环引用了
      return;
    }

    return new Observer(data);
  }

  function initState(vm) {
    // 将所有数据都定义在vm属性上，并且后续更改 需要触发视图更新
    var opts = vm.$options; // 获取用户属性

    if (opts.data) {
      // 数据的初始化
      initData(vm);
    }

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) ;

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function proxy(vm, source, key) {
    // vm.name => vm._data.name
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function initData(vm) {
    // 数据劫持 Object.defineProperty
    var data = vm.$options.data;
    data = vm._data = typeof data == 'function' ? data.call(vm) : data; // 通过vm._data 获取劫持后的数据，用户就可以拿到_data了
    // 将_data中的数据全部放到vm上

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 观测这个数据


    observe(data);
  }

  // import { last } from "lodash";
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    console.log('attrs', attrs);
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i]; // name, value

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj; // style: {color: red}
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ","); // {a: 'aaa'}
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      return "".concat(children.map(function (child) {
        return gen(child);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    // 区分是元素 还是文本
    if (node.type == 1) {
      return generate(node);
    } else {
      // 文本 逻辑不能用_c来处理
      // 有{{}}普通文本 混合文本 {{aa}} aaa {{bbb}} ccc
      var text = node.text;

      if (defaultStatus.test(text)) {
        // _v(_s(name) + 'aa' + _s(age) + '哈哈'
        var tokens = [];
        var match;
        var index = 0;
        var lastIndex = defaultTagRE.lastIndex = 0; // let str = /a/g  
        // str.test('abc')
        // str.test('abc')
        // console.log(lastIndex)

        while (match = defaultTagRE.exec(text)) {
          // console.log(match);
          index = match.index;

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        } // tokens


        return "_v(".concat(tokens.join('+'), ")"); // 是带有{{}}
      } else {
        return "_v(".concat(JSON.stringify(text), ")");
      }
    }
  }

  function generate(el) {
    var children = genChildren(el); // console.log(children);
    // console.log(el); // 转换成render代码

    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ", ".concat(children) : '', ")");
    console.log(code); // let code = `_c('${el.tag}',${
    //     el.attrs.length?`${genProps(el.attrs)}`:'undefined'
    // }${
    //     children? `,${children}`:''
    // })`;
    // => js代码 html=> js代码 字符串拼接

    return code;
  }
  /* 

  <div>
      <span style="color:red">{{name}} <a>hello</a></span>
  </div> 

  render() {
      return _c(
          'div', {id: 'app', a:1, b:2}
          , _c(
              'span',
               {style: {color: 'red'}},
                _s(_v(name)),
                 _c(a,undefined,'hello'))
                 )
  }

  */

  // import { chartreuse } from "color-name";
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // aa-aa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // aa:aa 命名空间字符串

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名
  // console.log('<div:aa>'.match(qnameCapture))
  // console.log('<div:aa>'.match(qnameCapture))

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
  // console.log('</div:xxx>'.match(endTag))
  // style="xxx" style='xxx' style=xxx

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
  // console.log(`a="1"`.match(attribute));
  // console.log(`a='1'`.match(attribute));
  // console.log(`a=1`.match(attribute));

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  /*
    <div>
     <div style="color:red">
         <span>{{nae}}</span>
     </div>
    </div>
  */

  function parseHTML(html) {
    function createASTElement(tag, attrs) {
      // vue3里面支持多个根元素(外层加了一个空元素)，vue2中只有一个根节点
      return {
        tag: tag,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    var root = null;
    var currentParent;
    var stack = []; // 根据开始标签 结束标签 文本内容 生成ast语法树

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // div>span>a

      stack.push(element);
    }

    function end(tagName) {
      // [div, div, span] 遇到span标签弹出element = span,此时栈最后一个是div即currentParent
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 获取元素
        // 查找属性

        var _end, attr; // console.log(start, match)
        // 不是开头标签结尾就一直解析


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length); // a=1 a='1' a="1"
          // console.log(html,match);

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          // 开始标签
          // console.log("开始: " + startTagMatch.tagName);
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue; // console.log('结尾: ' + endTagMatch[1])
        } // console.log(startTagMatch)

      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd); // console.log("文本: " + text);
      }

      if (text) {
        advance(text.length);
      } // break;

    }

    return root;
  }

  function compileToFunction(template) {
    var ast = parseHTML(template);
    var code = generate(ast);
    var render = "with(this){return ".concat(code, "}");
    var fn = new Function(render); // 可以让字符串变成一个函数

    console.log(fn); // eval不干净的执行

    return fn; // template.compiler 运行时
    // render 编译时
    // console.log(code);
    // console.log(generate(root));
  } // function a() {
  //     with(this) {
  //         console.log(bb)
  //     }
  // }
  // a.call({bb: 66});

  var callbacks = [];
  var waiting = false;

  function flushCallbacks() {
    for (var i = 0; i < callbacks.length; i++) {
      var callback = callbacks[i];
      callback();
    }

    waiting = false; // 1.promise先看支不支持
    // 2.mutationObserver
    // 3.setImmediate
    // 4.setTimeout  Vue3 next-tick就直接用了promise
  } // 批处理  第一次开定时器， 后续只更新列表，之后执行清空逻辑
  // 1.第一次cb渲染watcher更新操作 （渲染watcher执行的过程肯定是同步的）
  // 2.第二次cb用户传入的回调


  function nextTick(cb) {
    callbacks.push(cb); // 默认的cb 是渲染逻辑 用户的逻辑放到渲染逻辑之后即可

    if (!waiting) {
      waiting = true;
      Promise.resolve().then(flushCallbacks);
    }
  } // nextTick 肯定有异步功能

  var isObject = function isObject(val) {
    return _typeof(val) == 'object' && val != null;
  };
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {};

  strats.data = function () {};

  strats.components = function (parentVal, childVal) {
    var res = Object.create(parentVal);

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }

    return res;
  };

  function mergeHook(parentVal, childVal) {
    console.log(parentVal, childVal);

    if (childVal) {
      // 如果
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        // 如果儿子有父亲没有
        return [childVal];
      }
    } else {
      return parentVal; // 儿子没有直接采用父亲
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  function mergeOptions(parent, child) {
    var options = {}; // {a: 1} {a: 2} => {a: 2}
    // {a: 1} {} => {a: 1}
    // 自定义的策略
    // 1.如果父亲有的儿子也有，应该用儿子替换父亲
    // 2.如果父亲优质儿子没有，用父亲的

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      // 策略模式
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (isObject(parent[key]) && isObject(child)[key]) {
        // 父子的值都是对象
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else {
        if (child[key]) {
          // 如果儿子有值
          options[key] = child[key];
        } else {
          options[key] = parent[key];
        }
      }
    }

    return options;
  }

  function makeUp(str) {
    var map = {};
    str.split(',').forEach(function (tagName) {
      map[tagName] = true;
    });
    return function (tag) {
      return map[tag] || false;
    };
  }

  var isReservedTag = makeUp('a,p,div,ul,li,span,input,button');

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    // 需要对标签名做过滤 因为有可能标签名是一个自定义组件
    if (isReservedTag(tag)) {
      return vnode(vm, tag, data, data.key, children, undefined);
    } else {
      // 组件
      var Ctor = vm.$options.components[tag]; // 对象或者函数

      return createComponent(vm, tag, data, data.key, children, Ctor);
    }
  } // const hook = {
  //     init (vnode) {
  //     }
  // }

  function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor);
      console.log(Ctor);
    } // 给组件增加生命周期


    data.hook = {
      init: function init(vnode) {
        // 调用子组件的构造函数
        var child = vnode.componentInstance = new vnode.componentOptions.Ctor({});
        child.$mount(); // 手动挂载  chid.$el = 真实的元素
      } // 初始化狗子

    }; // 组件的虚拟节点拥有hook和当前组件的componentOptions 中存放了组件的狗子函数
    // vue-component-my-button

    return vnode(vm, "vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, undefined, {
      Ctor: Ctor
    });
  }

  function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
  }

  function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
      vm: vm,
      tag: tag,
      children: children,
      data: data,
      key: key,
      text: text,
      componentOptions: componentOptions
    };
  }

  function patch(oldVnode, vnode) {
    // oldVnode是一个真实的节点
    // 1.组件oldVnode是null  $mount()
    if (!oldVnode) {
      return createElm(vnode); // 根据虚拟节点创建元素
    }

    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 2.初次渲染 oldVnode 是一个真实的dom
      var oldElm = oldVnode; // id="app"

      var parentElm = oldElm.parentNode; // body

      var el = createElm(vnode); // 根据虚拟节点创建真实的节点

      parentElm.insertBefore(el, oldElm.nextSibling); // 将创建的节点插到原有的节点的下一个

      parentElm.removeChild(oldElm);
      return el; // vm.$el;
    } else {
      // 3. diff算法 两个虚拟节点的比对
      // 1.如果两个虚拟节点的标签不一致, 那就直接替换掉就结束
      // div=>p 标签不一样
      if (oldVnode.tag !== vnode.tag) {
        // 真实dom操作
        return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
      } // 2. 标签一样 但是是两个文本元素 {tag: undefined, text} {tag: undefined, text}


      if (!oldVnode.tag) {
        // 标签相同并且是文本
        if (oldVnode.text !== vnode.text) {
          return oldVnode.el.textContent = vnode.text;
        }
      } // 3. 元素相同, 复用老节点， 并且更新属性


      var _el = vnode.el = oldVnode.el; // div div相同 复用老的真实节点
      // 用老的属性和新的虚拟节点进行比对


      updateProperties(vnode, oldVnode.data); // 4.更新儿子

      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || [];

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 1. 老的有儿子新的也有儿子 dom-diff
        updateChildren(_el, oldChildren, newChildren);
      } else if (oldChildren.length > 0) {
        // 2. 老的有儿子 新的没儿子 => 删除老儿子
        _el.innerHTML = '';
      } else if (newChildren.length > 0) {
        // 3. 新的有儿子 老的没儿子 => 在老节点上面增加
        newChildren.forEach(function (child) {
          return _el.appendChild(createElm(child));
        });
      }
    }
  } // 1.diff算法 双指针 2.乱序怎么排序优化 

  function updateChildren(parent, oldChildren, newChildren) {
    var oldStartIndex = 0;

    var oldEndIndex = oldChildren.length - 1; // 老的尾索引

    var oldStartVnode = oldChildren[0]; // 老的开始节点

    var oldEndVnode = oldChildren[oldEndIndex]; // 老的结束节点

    var newStartIndex = 0;

    var newEndIndex = newChildren.length - 1; // 新的为索引

    var newStartVnode = newChildren[0]; // 新的开始节点

    var newEndVnode = newChildren[newEndIndex]; // 新的结束节点

    function makeIndexByKey(oldChildren) {
      var map = {};
      oldChildren.forEach(function (item, index) {
        map[item.key] = index; // [A:0,B:1,C:2]
      });
      return map;
    }

    var map = makeIndexByKey(oldChildren); // 越界了就不用比较了

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      // 1.前端中比较常见的操作有 向尾部插入 头部插入 头移动到尾部 尾部移动头部， 正序和反序
      // 1) 向后插入操作
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        // 最后一个往前以移动可能是undefined不存在
        oldEndVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 头和头比对
        patch(oldStartVnode, newStartVnode); // 递归比对节点

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        // 尾和尾比对
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        // 
        patch(oldStartVnode, newEndVnode); // dom 操作时具备移动性的 会移动

        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        // 1.需要先查找当前 老节点索引和key的关系
        // 移动的时候通过新的key 去找对应的老节点索引 => 获取老节点， 可以移动老节点
        var moveIndex = map[newStartVnode.key];

        if (moveIndex == undefined) {
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var moveVnode = oldChildren[moveIndex];
          oldChildren[moveIndex] = undefined;
          patch(moveVnode, newStartVnode); // 如果找到了 需要两个虚拟节点比对

          parent.insertBefore(moveVnode.el, oldStartVnode.el);
        }

        newStartVnode = newChildren[++newStartIndex];
      } // 2) 向前插入操作
      // 为什么key不建议用index 为什么v-for要增加key 属性

    } // 头指针和尾指针重合


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i < newEndIndex; i++) {
        // 新的比老的多， 插入新节点
        // 向前插入 向后插入
        // 看一眼newEndIndex 下一个节点有没有值
        var nextEle = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el; // appendChild和insertBefore也可以进行合并
        // 如果insertBefore传入null 等价于 appendChild

        parent.insertBefore(createElm(newChildren[i])); // parent.appendChild(createElm(newChildren[i]));
      }
    }

    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i < oldEndIndex; _i++) {
        var child = oldChildren[_i];

        if (child != undefined) {
          parent.removeChild(child.el); // 用父亲移除儿子即可
        }
      }
    }
  }

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {}; // 属性

    var el = vnode.el; // dom元素
    // 1. 老的属性 新的没有 删除属性

    for (var key in oldProps) {
      if (!newProps[key]) {
        el.removeAttribute(key);
      }
    }

    var newStyle = newProps.style || {}; // {color: red}

    var oldStyle = oldProps.style || {}; // {background: red}

    console.log(newStyle, oldStyle);

    for (var _key in oldStyle) {
      // 判断样式根据 新老先比对一下
      if (!newStyle[_key]) {
        el.style[_key] = '';
      }
    } // 2. 新的属性 老的没有, 直接用新的覆盖 不考虑有没有


    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function createComponent$1(vnode) {
    var i = vnode.data; // i = vnode.data.hook
    // i = i.init

    if ((i = i.hook) && (i = i.init)) {
      i(vnode); // 调用组件的初始化方法 // vnode.componentInstance.$el
    }

    if (vnode.componentInstance) {
      // 如果虚拟节点上有
      return true;
    }

    return false;
  }

  function createElm(vnode) {
    // 根据虚拟节点创建真实的节点
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text,
        vm = vnode.vm;

    if (typeof tag === 'string') {
      // 两种可能 可能是一个组件
      // 可能是组件, 如果是组件 就直接根据组件创建出组件对应的真实节点
      if (createComponent$1(vnode)) {
        // 如果返回true 说明这个虚拟节点是组件
        // 如果是组件，就将组件渲染后的真实元素给我
        return vnode.componentInstance.$el;
      }

      vnode.el = document.createElement(tag); // 用Vue的指令时可以通过vnode拿到真实dom

      updateProperties(vnode);
      children.forEach(function (child) {
        // 如果有儿子节点，就进行递归操作
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  var has = {};
  var queue = []; // 多次调用queueWatcher 如果watcher不是同一个

  var pending = false;

  function flushSchedularQueue() {
    for (var i = 0; i < queue.length; i++) {
      var watcher = queue[i];
      watcher.run();
    }

    queue = [];
    has = {};
    pending = false;
  }

  function queueWatcher(watcher) {
    // 调度更新几次
    // 更新时对watcher进行去重操作
    var id = watcher.id;

    if (has[id] == null) {
      // 没有id
      queue.push(watcher);
      has[id] = true;
      console.log(queue); // 让queue清空

      if (!pending) {
        pending = true;
        nextTick(flushSchedularQueue);
      } // setTimeout(flushSchedularQueue, 0)

    }
  }

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.cb = cb;
      this.options = options;
      this.deps = [];
      this.depsId = new Set();
      this.getter = exprOrFn; //调用传入的函数, 调用了render方法，此时会对模板中的数据取值

      this.get();
    } // 这个方法中会对属性进行取值操作


    _createClass(Watcher, [{
      key: "get",
      value: function get() {

        this.getter(); // 会取值 vm_update(vm_render())
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          // dep是非重复的，watcher肯定也不会重
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }, {
      key: "update",
      value: function update() {
        // 如果多次更改 我希望合并成一次 (防抖)
        this.get(); // 不停地渲染

        queueWatcher(this);
      } // 当属性取值时  需要记住这个watcher 稍后数据变化了，去执行自己记住的watcher即可

    }]);

    return Watcher;
  }();

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // 将虚拟节点转换成真实的dom
      var vm = this; // 首次渲染 需要用虚拟节点 来更新真实的dom
      // 初始化渲染的时候 会创建一个新节点并且将老节点删除
      // 1.第一次渲染完毕后 拿到新的节点，下次渲染时替换上次渲染的结果
      // 第一次初始化 第二次走diff算法

      var prevVnode = vm._vnode; // 先取上一次的vnode 看下一次是否有

      vm._vnode = vnode; // 保存上一次的虚拟节点

      if (!prevVnode) {
        vm.$el = patch(vm.$el, vnode); // 组件调用patch方法后会产生$el属性    
      } else {
        vm.$el = patch(prevVnode, vnode);
      } // console.log('update', vnode)

    };
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (handler) {
        return handlers.call(vm);
      });
    }
  }
  function mountComponent(vm, el) {
    console.log(vm, el); // 默认Vue是通过watcher来进行渲染  = 渲染watcher （每一个组件都有一个渲染watcher）

    var updateComponent = function updateComponent() {
      vm._update(vm._render()); // 把虚拟节点渲染成真正的节点

    };

    new Watcher(vm, updateComponent, function () {}, true); // updateComponent();
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; //    vm.$options = options; // 实例中有个属性$options 表示的是用户传入的所有属性
      // vm.constructor可能指向的是儿子类 不一定是Vue

      vm.$options = mergeOptions(vm.constructor.options, options);
      console.log(vm.$options); // 初始化状态

      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');
      console.log('666');

      if (vm.$options.el) {
        // 数据可以挂载到页面上
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$nextTick = nextTick;

    Vue.prototype.$mount = function (el) {
      console.log('进来了');
      el = document.querySelector(el);
      var vm = this;
      var options = vm.$options;
      vm.$el = el; // 如果有render 就直接使用render
      // 没有render 看有没有template属性
      // 没有template 就接着找外部模板

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML; // 火狐不兼容 document.createElement('div').appendChild('app').innerHTML
        } // console.log(template);
        // 如何将模板编译成render函数


        var render = compileToFunction(template);
        options.render = render;
        console.log(options.render);
      }

      mountComponent(vm, el);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 创建元素的虚拟节点
      return createElement.apply(void 0, [this].concat(args));
    };

    Vue.prototype._v = function (text) {
      // 创建文本的虚拟节点
      return createTextVnode(this, text);
    };

    Vue.prototype._s = function (value) {
      // 转化成字符串
      return val == null ? '' : (typeof val === "undefined" ? "undefined" : _typeof(val)) == 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      // render
      var vm = this;
      var render = vm.$options.render; // 获取编译后的render方法

      var vnode = render.call(vm); // _(xxx,xxx,xxx,xxx) 调用时会自动将变量进行取值，将实例结果进行渲染

      return vnode; // 虚拟节点
      // _c('div',{},_c())
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {}; // 用来存储全局的配置
    // filter directive component

    Vue.mixin = function (mixin) {
      // mergeOptions
      this.options = mergeOptions(this.options, mixin);
      console.log(this.options);
      return this;
    }; // this.options_base 表示父类的不是子类的this


    Vue.options._base = Vue; // Vue的构造函数 后面会用到

    Vue.options.components = {}; // 用来存放组件的定义

    Vue.component = function (id, definition) {
      definition.name = definition.name || id;
      definition = this.options._base.extend(definition); // 通过对象产生一个构造函数

      this.options.components[id] = definition;
      console.log(this.options);
    };

    var cid = 0; // 防止不同的构造函数名字相同

    Vue.extend = function (options) {
      // 子组件初始化时会 new VueComponent(options)
      var Super = this; // 产生一个子组件

      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.cid = cid++; //防止不同的构造函数名字相同

      Sub.prototype = Object.create(Super.prototype); // 都是通过Vue继承来的

      Sub.prototype.constructor = Sub; // 继承

      Sub.component = Super.component; // ... 每次声明一个组件 都会把父级的定义放在自己的身上

      Sub.options = mergeOptions(Super.options, options);
      return Sub; // 这个构造函数是由对象产生而来的
    }; // Sub.component();

  }

  // Vue2.0中就是一个构造函数 class

  function Vue(options) {
    this._init(options); //当用户 new Vue时，就调用init方法进行vue的初始化方法

  }

  initMixin(Vue);
  lifecycleMixin(Vue); // 扩展update方法 更新逻辑

  renderMixin(Vue); // 扩展_render方法，调用render方法的逻辑
  // 可以拆分逻辑到不同的文件中  更利于代码维护 模块化的概念

  initGlobalAPI(Vue); // 混合全局的API
  // 我们自己构建两个虚拟dom, 之后手动进行比对

  var vm1 = new Vue({
    data: function data() {
      return {
        name: 'zf'
      };
    }
  }); // 将模板变成render函数

  var render1 = compileToFunction("<div id=\"a\" a=\"1\" style=\"color: red\">{{name}}</div>"); // 将模板编译成render函数

  var render3 = compileToFunction("\n    <ul>\n    <li key=\"A\">A</li>\n    <li key=\"B\">B</li>\n    <li key=\"C\">C</li>\n    <li key=\"D\">D</li>\n</ul>\n    ");
  var oldVnode = render1.call(vm1); // 老的虚拟节点

  var el = createElm(oldVnode);
  document.body.appendChild(el);
  var vm2 = new Vue({
    data: function data() {
      return {
        name: 'jw'
      };
    }
  });
  var render2 = compileToFunction("<div id=\"b\" b=\"1\" style=\"background: red\">{{name}}</div>");
  var render4 = compileToFunction("\n        <ul>\n            <li key=\"A\">A</li>\n            <li key=\"B\">B</li>\n            <li key=\"C\">C</li>\n            <li key=\"D\">D</li>\n            <li key=\"E\">E</li>\n        </ul>\n    ");
  var newVnode = render2.call(vm2);
  var el1 = createElm(newVnode);
  document.body.appendChild(el1);
  patch(oldVnode, newVnode); // 包括了初始渲染和diff算法的原理
   // 库 => rollup 项目开发 webpack

  return Vue;

})));
//# sourceMappingURL=vue.js.map
