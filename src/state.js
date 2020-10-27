import {observe} from '../observer/index'

// vue的数据 data computed watch...
export function initState(vm) {
    // 将所有数据都定义在vm属性上，并且后续更改 需要触发视图更新
    const opts = vm.$options; // 获取用户属性
    if (opts.data) { // 数据的初始化
        initData(vm);
    }
    if (opts.props) {}
    if (opts.methods) {}
    if (opts.data) {}
    if (opts.computed) {}
    if (opts.watch) {}
}

function proxy(vm, source, key) { // vm.name => vm._data.name
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key];
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    })
}

function initData(vm) {
    // 数据劫持 Object.defineProperty
    let data = vm.$options.data;
    data = vm._data = typeof data == 'function' ? data.call(vm) : data


    // 通过vm._data 获取劫持后的数据，用户就可以拿到_data了
    // 将_data中的数据全部放到vm上
    for (const key in data) {
        proxy(vm, '_data', key);
    }

    // 观测这个数据
    observe(data);
}