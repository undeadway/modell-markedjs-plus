const path = require("path");

module.exports = {
	entry: {"modell-markedjs-plus" : "./build/js.js"},
	output: {
		path:path.resolve(__dirname ,"dist"),
		filename:"[name].js"
	},
	mode:"development"
};

