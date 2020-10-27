import {initState} from './state'
import {compileToFunction} from './compiler/index.js'
import { mountComponent, callHook} from './lifecycle';
import { mergeOptions, nextTick} from './util';
import { call } from 'function-bind';
export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
       const vm = this;
    //    vm.$options = options; // 实例中有个属性$options 表示的是用户传入的所有属性
    // vm.constructor可能指向的是儿子类 不一定是Vue
       vm.$options = mergeOptions(vm.constructor.options, options);
       console.log(vm.$options);
       // 初始化状态
       callHook(vm, 'beforeCreate');
       initState(vm);
       callHook(vm, 'created');
        console.log('666');
       if (vm.$options.el) { // 数据可以挂载到页面上
          vm.$mount(vm.$options.el);
       }
    }

    Vue.prototype.$nextTick = nextTick

    Vue.prototype.$mount = function(el) {
        console.log('进来了');
        el = document.querySelector(el);

        const vm = this;
        const options = vm.$options;
        vm.$el = el;
        // 如果有render 就直接使用render
        // 没有render 看有没有template属性
        // 没有template 就接着找外部模板
        if (!options.render) {
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML // 火狐不兼容 document.createElement('div').appendChild('app').innerHTML
            }
            // console.log(template);
            // 如何将模板编译成render函数
            const render = compileToFunction(template);
            options.render = render;
            console.log(options.render);
        }
        mountComponent(vm, el);
    }
   
}


