const fs = require("fs");
const file = fs.readFileSync(__dirname + "./../demo/input.md",'utf8');

const plus = require("./../src/index");
const object = plus.create();
const html = object.parse(file);

const output = `<html>
<head>
<link rel="stylesheet" href="./../dist/modell-markedjs-plus.css" />
</head>
<body>
${html}
</body>
</html>`;

fs.writeFileSync(__dirname + "./../demo/output.html", output);