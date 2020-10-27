// Vue2.0中就是一个构造函数 class
import {initMixin} from './init'
import {lifecycleMixin} from './lifecycle'
import {renderMixin} from './render'
import {initGlobalAPI} from './global-api/index'
import { compileToFunction } from './compiler/index';
import {createElm, patch} from './vdom/patch'
function Vue(options) {
    this._init(options); //当用户 new Vue时，就调用init方法进行vue的初始化方法
}

initMixin(Vue);
lifecycleMixin(Vue); // 扩展update方法 更新逻辑
renderMixin(Vue); // 扩展_render方法，调用render方法的逻辑
// 可以拆分逻辑到不同的文件中  更利于代码维护 模块化的概念

initGlobalAPI(Vue) // 混合全局的API


// 我们自己构建两个虚拟dom, 之后手动进行比对

let vm1 = new Vue({data(){return {name: 'zf'}}});
// 将模板变成render函数
let render1 = compileToFunction(`<div id="a" a="1" style="color: red">{{name}}</div>`) // 将模板编译成render函数
let render3 = compileToFunction(
    `
    <ul>
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
</ul>
    `
)

let oldVnode = render1.call(vm1); // 老的虚拟节点
let el = createElm(oldVnode);
document.body.appendChild(el);

let vm2 = new Vue({
    data() {
        return {name: 'jw'}
    }
})
let render2 = compileToFunction(`<div id="b" b="1" style="background: red">{{name}}</div>`);
let render4 = compileToFunction(
    `
        <ul>
            <li key="A">A</li>
            <li key="B">B</li>
            <li key="C">C</li>
            <li key="D">D</li>
            <li key="E">E</li>
        </ul>
    `
)
let newVnode = render2.call(vm2);
let el1 = createElm(newVnode);
document.body.appendChild(el1);

patch(oldVnode, newVnode); // 包括了初始渲染和diff算法的原理
export default Vue

// 库 => rollup 项目开发 webpack