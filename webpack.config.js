var path = require("path");

module.exports = {
	entry: {"my-markedjs-plus" : "./src/index.js"},
	output: {
		path:path.resolve(__dirname ,"dist"),
		filename:"[name].js"
	},
	mode:"development"
};

