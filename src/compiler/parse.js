// import { chartreuse } from "color-name";

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // aa-aa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // aa:aa 命名空间字符串
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名

// console.log('<div:aa>'.match(qnameCapture))
// console.log('<div:aa>'.match(qnameCapture))


const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>

// console.log('</div:xxx>'.match(endTag))

// style="xxx" style='xxx' style=xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

// console.log(`a="1"`.match(attribute));
// console.log(`a='1'`.match(attribute));
// console.log(`a=1`.match(attribute));

const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >


/*
  <div>
   <div style="color:red">
       <span>{{nae}}</span>
   </div>
  </div>
*/


export function parseHTML(html) {

    function createASTElement(tag, attrs) { // vue3里面支持多个根元素(外层加了一个空元素)，vue2中只有一个根节点
        return {
            tag,
            type: 1,
            children: [],
            attrs,
            parent: null
        }
    }
    let root = null;
    let currentParent;
    let stack = [];



    // 根据开始标签 结束标签 文本内容 生成ast语法树
    function start(tagName, attrs) {
        let element = createASTElement(tagName, attrs);
        if (!root) {
            root = element;
        }
        currentParent = element // div>span>a
        stack.push(element);
    }
    function end(tagName) { // [div, div, span] 遇到span标签弹出element = span,此时栈最后一个是div即currentParent
        let element = stack.pop();
        currentParent = stack[stack.length -1];
        if (currentParent) {
            element.parent = currentParent;
            currentParent.children.push(element)
        }
    }
    function chars(text) {
        text = text.replace(/\s/g, '');
        if (text) {
            currentParent.children.push({
                type: 3,
                text
            })
        }
    }

    function advance(n) {
        html = html.substring(n);
    }

    function parseStartTag() {
        let start = html.match(startTagOpen);
        if (start) {
            let match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length); // 获取元素
            // 查找属性
            let end, attr;
            // console.log(start, match)
            // 不是开头标签结尾就一直解析
            while(!(end=html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length); // a=1 a='1' a="1"
                // console.log(html,match);
                match.attrs.push({name:attr[1], value: attr[3] || attr[4] || attr[5] || true})
            }
            if (end) {
                advance(end[0].length);
                return match
            }
        }        
    }

    while(html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            let startTagMatch = parseStartTag();
            if (startTagMatch) { // 开始标签
                // console.log("开始: " + startTagMatch.tagName);
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            // 结束标签
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
                // console.log('结尾: ' + endTagMatch[1])
            }
            
            // console.log(startTagMatch)
        }
        let text;
        if (textEnd >= 0 ) {
            text = html.substring(0, textEnd);
            // console.log("文本: " + text);
        }
        if (text) {
            advance(text.length);
            chars[text];
        }
        // break;
    }
    return root;
}