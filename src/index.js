const main = require("./modules/main");
const saveAsMHTML = require("./modules/save-as-mhtml/index");

module.exports = exports = (Marked) => {
	return {
		create: () => {
			return main.create(new Marked());
		},
		parse (file) {
			const marked = new Marked();
			return main.parse(marked, file);
		},
		saveAsMHTML: saveAsMHTML.execute
	}
};
