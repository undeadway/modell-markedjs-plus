import main from "./modules/main";
import saveAsMhtml from "./modules/save-as-mhtml";

module.exports = exports = (Marked) => {
	return {
		create: () => {
			return main.create(new Marked());
		},
		parse (file) {
			const marked = new Marked();
			return main.parse(marked, file);
		},
		saveAsMhtml: saveAsMhtml.execute
	}
};


