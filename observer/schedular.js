import {nextTick} from '../src/util.js'

let has = {};
let queue = [];
// 多次调用queueWatcher 如果watcher不是同一个
let pending = false;

function flushSchedularQueue() {
    for (let i = 0; i < queue.length; i++) {
        let watcher = queue[i];
        watcher.run();
    }
    queue = [];
    has = {};
    pending = false;
}

export function queueWatcher(watcher) { // 调度更新几次
    // 更新时对watcher进行去重操作
    let id = watcher.id;
    if(has[id] == null) { // 没有id
        queue.push(watcher);
        has[id] = true;
        console.log(queue);

        // 让queue清空
        if (!pending) {
            pending = true;
            nextTick(flushSchedularQueue);
        }
        // setTimeout(flushSchedularQueue, 0)
    }
}    