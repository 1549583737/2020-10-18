
import {generate} from "../compiler/generate.js";
import {parseHTML} from "../compiler/parse";
export function compileToFunction(template) {
    let ast = parseHTML(template);
    let code = generate(ast);
    let render = `with(this){return ${code}}`;
    let fn = new Function(render); // 可以让字符串变成一个函数
    console.log(fn); // eval不干净的执行
    return fn;

    // template.compiler 运行时
    // render 编译时
    // console.log(code);
    // console.log(generate(root));
}

// function a() {
//     with(this) {
//         console.log(bb)
//     }
// }

// a.call({bb: 66});