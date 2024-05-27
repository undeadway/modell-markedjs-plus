const fs = require("fs");
const marked = require("marked");
global.marked = marked;

const me = require("./../src/index");
console.log(__dirname, __filename);
const file = fs.readFileSync(__dirname + "./../test/input.md",'utf8');

const object = me.create(marked);
const html = object.parse(file);

const output = `<html>
<head>
<link rel="stylesheet" href="./../dist/modell-markedjs-plus.css" />
</head>
<body>
${html}
</body>
</html>`;

fs.writeFileSync(__dirname + "./../test//output.html", output);