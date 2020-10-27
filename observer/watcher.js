import { popTarget, pushTarget } from "./dep";
import {queueWatcher} from '../observer/schedular.js'
let id = 0;

class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.cb = cb;
        this.options = options;
        let id = id++;
        this.deps = [];
        this.depsId = new Set();
        this.getter = exprOrFn //调用传入的函数, 调用了render方法，此时会对模板中的数据取值
        this.get();
        
    }

    // 这个方法中会对属性进行取值操作
    get() {
        pushTarget(this); // Dep.target = watcher
        this.getter(); // 会取值 vm_update(vm_render())
        popTarget(); // Dep.target = null
    }

    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(id)) { // dep是非重复的，watcher肯定也不会重
            this.depsId.add(id);
            this.deps.push(dep);
            dep.addSub(this);
        }
    }

    run() {
        this.get();
    }

    update() { // 如果多次更改 我希望合并成一次 (防抖)
        this.get(); // 不停地渲染
        queueWatcher(this);
    }
            // 当属性取值时  需要记住这个watcher 稍后数据变化了，去执行自己记住的watcher即可
}
    

export default Watcher;