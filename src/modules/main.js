function _parse (marked, input) {
	try {
		let html = marked.parse(input);
		html = `<div class="modell-markedjs-plus-box"><div>${html}</div></div>`;
		return html;
	} catch (err) {
		console.log(err);
		return null;
	}
}

function create (marked) {

	const customExtensions = [];
	const imageMap = {}, tableMap = {}, levelMap = {}, anchorMap = {};

	let options = {};
	let tableIndex = 1, imgIndex = 1, anchorIndex = 1;
	let levelIndex = [ 0, 0, 0, 0, 0, 0 ], lastLevel = 0;
	let fileUrl = "", linkUrl = "", imgDefaultAlign = "left";

	let _highlight = (code) => {
		return code;
	}

	const rendererMD = new marked.Renderer();
	const lexer = new marked.Lexer();
	const parser = new marked.Parser();

	rendererMD.heading = function(text, level, raw) {
		if (options.heading !== false) {
			if (lastLevel > level) {
				for (let i = level; i < levelIndex.length; i++) {
					levelIndex[i] = 0;
				}
			}
	
			levelIndex[level - 1]++;
	
			const chapter = levelIndex.slice(0, level).join(".");
	
			levelMap[text.trim()] = chapter;
			lastLevel = level;
	
			const output = `\n<p class="plus-heading">${chapter}. ${text}</p>\n`;
			return output;
		} else {
			const output = `\n<h${level}>${text}</h${level}>\n`;
			return output;
		}

	}
	rendererMD.link = function(href, title, text) {
		text = text || href;
		title = text;

		let html = `<a href="${linkUrl}${href}">${text}</a>`;
		return html;
	};

	rendererMD.image = function(href, title, text) {
		if (options.image !== false) {
			if (text) {
				text = `：${text}`;
			}
	
			let [ _href, align ] = href.split("|");
			href = _href;
			align = align || imgDefaultAlign;
	
			let index = imageMap[href];

			if (!index) {
				index = imgIndex++;
				imageMap[href] = index;
			}

			const html = `\n<div class="plus-img obj-align__${align}"><img id="#p${index}" src="${fileUrl}${href}" /><div>图 ${index}${text}</div></div>\n`;
			return html;
		} else {
			return `<img src="${href}" />`;
		}
	}

	rendererMD.code = function (code, info, escaped) {
		info = info.replace("(", "");
		info = info.replace(")", "");
		const value = _highlight(code, info, escaped);

		return `\n<pre class="plus-code"><code class="language-html">${value}</code></pre>\n`;
	};

	rendererMD.table = function(thead, tbody) {
		const tableHtml = `<table>${thead}${tbody}</table>`;
		if (options.table !== false) {
			const html = `\n<div class="plus-table">${tableHtml}</div>\n`;
			return html;
		} else {
			return `\n${tableHtml}\n`;
		}
	}

	// TODO 忘了这是个什么功能了，暂时不做处理，或者用其他方式替换
	// rendererMD.strong = function(value) {
	// 	if (options.strong !== false) {
	// 		const arr = value.split("$");
	// 		let html = `<span class="plus-span-bold`;
	// 		for (let i = 1; i < arr.length; i++) {
	// 			const part = arr[i];
	// 			html += ` span-${part}`;
	// 		}
	
	// 		html = `${html}">${arr[0]}</span>`;
	
	// 		return html;
	// 	} else {
	// 		return `<em>${value}</em>`;
	// 	}
	// }

	const extractsAtItems = {
		name: "extractsAtItems",
		level: "inline",
		start: (src) => {
			const match = /@\[(image|icon|table|anchor)\]\{(\S+?)\}/.exec(src);
			if (match) {
				if (options[match[1]] === false) {
					return -1;
				}
				return match.index;
			} else {
				return -1;
			}
		},
		tokenizer: (src, tokens) => {
			const match = /@\[(image|icon|table|anchor)\]\{(\S+?)\}/.exec(src);
			if (match) {
				let [ raw, kind, value ] = match;
				const text = raw;
				const index = src.indexOf(raw);
				raw = src.slice(0, index) + raw;

				const token = {
					type: "extractsAtItems",
					raw, value, text, kind,
					tokens:	lexer.inline(text, tokens)
				}

				return token;
			}
		},
		renderer ({ raw, value, text, kind }) {
			let output = "";

			if (options[kind] === false) {
				return text;
			}

			switch (kind) {
				case "image":
					let index1 = imageMap[value];
					if (!index1) {
						index1 = imgIndex++;
						imageMap[value] = index1;
					}
	
					output = `<span class="plus-span-bold">图 ${index1}</span>`;

					break;
				case "icon":
					value = value.replace(",", " ");
					output = `<i class="plus-span-bold ${value}"></i>`;

					break;
				case "table":
					const isTable = value.indexOf(":") < 0;

					if (!isTable) {
						value = value.slice(1);
					}

					let index2 = tableMap[value];
					if (!index2) {
						index2 = tableIndex++;
						tableMap[value] = index2;
					}

					if (isTable) {
						return `\n<div class="obj-align__center plus-span-bold">表 ${index2}：${value}</div>\n`; // 在 输入为 @ 的时候，表示这里有个表格，不做任何处理
					} else {
						output = `<span class="plus-span-bold">表 ${index2}</span>`;
					}

					break;
				case "anchor":
					const isAnchor = value.indexOf(":") < 0;

					if (isAnchor) {
						let index = anchorMap[value];
						if (!index) {
							index = anchorMap[value] = anchorIndex++;
						}
						output = `<span id="a_${index}">${value}</span>`;
					} else {
						const [ key, tVal ] = value.split(":"); 
						let index = anchorMap[key];
						if (!index) {
							index = anchorMap[key] = anchorIndex++;
						}
						output = `<a href="#a_${index}">${tVal}</a>`;
					}

					break;
			}

			raw = raw.replace(text, output);
			raw = raw.replace("	", "<br />"); // TODO 这里是否只有这个问题还要再看
			return raw;
		}
	};

	const extractsColor = {
		name: "extractsColor",
		level: "inline",
		start: (src) => {
			if (options.color === false) {
				return -1;
			}
			const match = /#\[([0-9a-fA-F]{6})\]\{([\S\s]+?)\}/.exec(src);
			if (match) {
				return match.index;
			} else {
				return -1;
			}
		},
		tokenizer: (src, tokens) => {
			const match = /#\[([0-9a-fA-F]{6})\]\{([\S\s]+?)\}/.exec(src);
			if (match) {
				let [ raw, color, text ] = match;
				const value = raw;
				const index = src.indexOf(raw);
				raw = src.slice(0, index) + raw;

				const token = {
					type: "extractsColor",
					proto: value,
					raw, color, text,
					tokens: lexer.inlineTokens(text)
				}

				return token;
			}
		},
		renderer ({raw, proto, tokens, color}) {
			if (options.color === false) {
				return proto;
			}
			const value = parser.parseInline(tokens);
			const output = `<span style="color:#${color}">${value}</span>`;
			raw = raw.replace(proto, output);
			raw = raw.replace("	", "<br />"); // TODO 这里是否只有这个问题还要再看
			return raw;
		}
	};

	marked.setOptions({
		renderer: rendererMD,
		lexer: lexer,
		parser: parser
	});

	return {
		using: (opt) => {
			options = opt ? opt : options;
		},
		parse: (file) => {
				const extensions = [extractsAtItems, extractsColor].concat(customExtensions);

				marked.use({ extensions });
		
				return _parse(marked, file);
		},
		addCustomExtension (obj) {
			customExtensions.push(obj);
		},
		getLexer () {
			return lexer;
		},
		getParser () {
			return parser;
		},
		getRenderer () {
			return rendererMD;
		},
		codeHighlight (highlight) {
			_highlight = highlight;
		},
		setFileDefaultUrl (url) {
			fileUrl = url;
			if (url[url.length - 1] !== "/") {
				fileUrl += "/";
			}
		},
		setLinkDefaultUrl (url) {
			linkUrl = url;
			if (url[url.length - 1] !== "/") {
				linkUrl += "/";
			}
		},
		setImageDefaultAlign (align) {
			imgDefaultAlign = align;
		}
	}
}

module.exports = exports = {
    parse: _parse,
    create
}
