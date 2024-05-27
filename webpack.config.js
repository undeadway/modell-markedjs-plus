const path = require("path");

module.exports = {
	entry: {"modell-markedjs-plus" : "./src/index.js"},
	output: {
		path:path.resolve(__dirname ,"dist"),
		filename:"[name].js"
	},
	mode:"development"
};

