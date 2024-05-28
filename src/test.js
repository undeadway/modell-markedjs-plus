const fs = require("fs");
const file = fs.readFileSync(__dirname + "./../demo/input.md",'utf8');

const hljs = require('highlight.js');
const plus = require("./../src/index");
const object = plus.create();
object.codeHighlight((code) => {
    // 因为不知道各种语法高亮都是如何实现的，所以直接写一个回调函数，让使用者自行实现相关逻辑。
    const output = hljs.highlight(code, {
        language: "javascript"
    });

    return `<pre><code class="language-html">${output.value}</code></pre>`;
});
const html = object.parse(file);

const output = `<html>
<head>
<link rel="stylesheet" href="./../dist/modell-markedjs-plus.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
</head>
<body>
${html}
</body>
</html>`;

fs.writeFileSync(__dirname + "./../demo/output.html", output);