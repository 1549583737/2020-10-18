let callbacks = [];
let waiting = false;

function flushCallbacks() {
    for (let i = 0; i < callbacks.length; i++) {
        let callback = callbacks[i];
        callback();
    }
    waiting = false;
    
    // 1.promise先看支不支持
    // 2.mutationObserver
    // 3.setImmediate
    // 4.setTimeout  Vue3 next-tick就直接用了promise
}

// 批处理  第一次开定时器， 后续只更新列表，之后执行清空逻辑

// 1.第一次cb渲染watcher更新操作 （渲染watcher执行的过程肯定是同步的）
// 2.第二次cb用户传入的回调
export function nextTick(cb) {
    callbacks.push(cb); // 默认的cb 是渲染逻辑 用户的逻辑放到渲染逻辑之后即可
    if(!waiting) {
        waiting = true;
        Promise.resolve().then(flushCallbacks)
    }
}
// nextTick 肯定有异步功能

export const isObject = (val) => typeof val == 'object' && val != null
const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]


const strats = {};

strats.data = function() {}
strats.components = function(parentVal, childVal) {
    const res = Object.create(parentVal);
    if (childVal) {
        for(let key in childVal) {
            res[key] = childVal[key]
        }
    }
    return res;
}

function mergeHook(parentVal, childVal) {
    console.log(parentVal, childVal);
    if (childVal) { // 如果
        if (parentVal) {
            return parentVal.concat(childVal);
        } else { // 如果儿子有父亲没有
            return [childVal]
        }
    } else {
        return parentVal; // 儿子没有直接采用父亲
    }
}

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook;
})

export function mergeOptions(parent, child) {
    const options = {};
    // {a: 1} {a: 2} => {a: 2}
    // {a: 1} {} => {a: 1}
    // 自定义的策略
    // 1.如果父亲有的儿子也有，应该用儿子替换父亲
    // 2.如果父亲优质儿子没有，用父亲的
    for (let key in parent) {
        mergeField(key)
    }

    for (let key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key);
        }
    }

    function mergeField(key) {
        // 策略模式
        if (strats[key]) {
            return options[key] = strats[key](parent[key], child[key]);
        }


        if (isObject(parent[key]) && isObject(child)[key]) { // 父子的值都是对象
            options[key] = { ...parent[key], ...child[key] }
        } else {
            if (child[key]) { // 如果儿子有值
                options[key] = child[key];
            } else {
                options[key] = parent[key];
            }
        }
    }
    return options;
}

function makeUp(str) {
    const map = {

    }
    str.split(',').forEach(tagName => {
        map[tagName] = true;
    })
    return (tag)=> map[tag] || false;
}

export const isReservedTag = makeUp('a,p,div,ul,li,span,input,button')