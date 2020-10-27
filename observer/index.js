import { arrayMethods } from "./array";

class Observer {
    constructor(value) { // 需要对整个value属性重新定义
        // value可能是对象 可能是数组 分类来处理
        // value.__obj__ = this;  这行会死循环

        this.dep = new Dep(); // 给数组本身和对象本身增加一个dep属性
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false, // 不能被枚举表示 不能被循环
            configurable: false, // 不能删除此属性
        })

        if (Array.isArray(value)) {
            // push shift reverse sort 我要重写这些方法增加更新逻辑
            // value.__proto__ = arrayMethods; // 有些浏览器不支持 __proto__写法
            Object.setPrototypeOf(value, arrayMethods); // 循环将属性赋予上去
            this.observeArray(value); // 原有数组中的对象   Object.freeze()
        } else {
            this.walk(value)
        }
    }

    observeArray(value) {
        for(let i = 0; i < value.length; i++) { // 如果数组中是对象的话，就回去递归观测
            // 观测的时候会增加__ob__属性
            observe(value[i])
        }
    }

    walk(data) {
        // 将对象中的所有key 重新用defineProperty定义成响应式的
        let keys = Object.keys(data)
        keys.forEach(key=>{
            defineReactive(data,  key, data[key]);
        })
    }
}
function dependArray(value) { // 就是让里层数组收集外层数组的依赖，这样修改里层数组也可以
    for (let i = 0; i < value.length; i++) {
        let current = value[i];
        current.__ob__ && current.__ob__.dep.depend();
        if (Array.isArray(current)) {
            dependArray(current);
        }
    }
}

export function defineReactive(data, key, value) { // vue2中数据不适合嵌套过深  过深浪费性能
    // value 可能也是一个对象
    let childOb = observe(value); // 对结果递归拦截

    let dep = new dep(); // 每次都会给属性创建一个dep
    Object.defineProperty(data, key, { // 需要给每个属性都增加一个dep
        get() {
            if (Dep.target) {
                dep.depend(); // 让这个属性自己的dep记住这个watcher，也要让watcher记住这个dep

                // childOb 可能是对象 也可能是数组
                if (childOb) { // 如果对数组取值 会将当前的watcher呵呵数组进行关联
                    childOb.dep.depend();
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newValue) {
            if (newValue === value) return;
            observe(data)
            // data[key] = newValue; // ?
            value = newValue;

            dep.notify(); //通知dep中记录的watcher让它去执行 
        }
    })
}

export function observe(data) {
    // 只对对象类型进行观测 非对象类型无法观测

    if (typeof data !== 'object' || data == null) return; // 不是对象或者是null 观测不了
    // 通过类来对实现对数据的观测 类可以方法扩展，会产生实例
    if(data.__ob__) { // 如果被观测过了 放弃循环引用了
        return
    }
    return new Observer(data);
}