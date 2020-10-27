import serve from 'rollup-plugin-serve'
import babel from 'rollup-plugin-babel'

export default {
    input: './src/index.js',
    output: {
        file: './dist/vue.js',  // 输出文件
        name: 'Vue', //  全局的名字就是vue
        format: 'umd', // 支持commonJS es6规范 把Vue放在 上window.vue
        sourcemap: true, // es6->es5
    },
    plugins: [
        babel({
            exclude: 'node_modules/**', // 这个目录不需要用babel转化
            
        }),
        serve({
            open: true,
            openPage: '/public/index.html',
            port: 3000,
            contentBase: '' // 表示以当前根目录为基准 默认是空
        })
    ],
}