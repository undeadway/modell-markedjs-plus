const main = require("./modules/main");

module.exports = exports = (Marked) => {
	return {
		create: () => {
			return main.create(new Marked());
		},
		parse (file) {
			const marked = new Marked();
			return main.parse(marked, file);
		}
	}
};
