const fs = require("fs");
const sass = require("sass");

const inputFileName = __dirname + "/../dist/my-markedjs-plus.scss";
const outputFileName = __dirname + "/../dist/my-markedjs-plus.css";

const result = sass.compile(inputFileName);

fs.writeFileSync(outputFileName, result.css);