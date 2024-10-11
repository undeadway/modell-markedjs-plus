/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./build/js.js":
/*!*********************!*\
  !*** ./build/js.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const data = __webpack_require__(/*! ./../src/index */ \"./src/index.js\");\r\n\r\nif (typeof window) {\r\n    window.ModellMarkedjsPlus = data;\r\n}\n\n//# sourceURL=webpack://modell-markedjs-plus/./build/js.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, exports, __webpack_require__) => {

eval("const main = __webpack_require__(/*! ./modules/main */ \"./src/modules/main.js\");\r\n\r\nmodule.exports = exports = (Marked) => {\r\n\treturn {\r\n\t\tcreate: () => {\r\n\t\t\treturn main.create(new Marked());\r\n\t\t},\r\n\t\tparse (file) {\r\n\t\t\tconst marked = new Marked();\r\n\t\t\treturn main.parse(marked, file);\r\n\t\t}\r\n\t}\r\n};\r\n\n\n//# sourceURL=webpack://modell-markedjs-plus/./src/index.js?");

/***/ }),

/***/ "./src/modules/main.js":
/*!*****************************!*\
  !*** ./src/modules/main.js ***!
  \*****************************/
/***/ ((module, exports) => {

eval("const EXTRACTS_COLOR_REGX = /#\\[([0-9a-fA-F]{6})\\]\\{([\\S\\s]+?)\\}/;\r\nconst EXTRACTS_AT_ITEMS_REGX = /@\\[(image|icon|table|anchor)\\]\\{(\\S+?)\\}/;\r\n\r\nconst MK_POINT = \".\", MK_SLASH = \"/\", MK_COLON = \":\";\r\nconst BLANK = \"\", SPACE = \" \";\r\nconst HTML_BR = \"<br />\";\r\nconst LEFT = \"left\", RIGHT = \"right\", CENTER = \"center\"\r\n\r\nfunction _parse (marked, input) {\r\n\ttry {\r\n\t\tlet html = marked.parse(input);\r\n\t\thtml = `<div class=\"modell-markedjs-plus-box\"><div>${html}</div></div>`;\r\n\t\treturn html;\r\n\t} catch (err) {\r\n\t\tconsole.log(err);\r\n\t\treturn null;\r\n\t}\r\n}\r\n\r\nfunction create (marked) {\r\n\r\n\tconst customExtensions = [];\r\n\tconst imageMap = {}, tableMap = {}, levelMap = {}, anchorMap = {};\r\n\r\n\tlet options = {};\r\n\tlet tableIndex = 1, imgIndex = 1, anchorIndex = 1;\r\n\tlet levelIndex = [ 0, 0, 0, 0, 0, 0 ], lastLevel = 0;\r\n\tlet fileUrl = BLANK, linkUrl = BLANK, imgDefaultAlign = LEFT;\r\n\r\n\tlet _highlight = (code) => {\r\n\t\treturn code;\r\n\t}\r\n\r\n\tconst rendererMD = new marked.Renderer();\r\n\tconst lexer = new marked.Lexer();\r\n\tconst parser = new marked.Parser();\r\n\r\n\trendererMD.heading = function(text, level, raw) {\r\n\t\tif (options.heading !== false) {\r\n\t\t\tif (lastLevel > level) {\r\n\t\t\t\tfor (let i = level; i < levelIndex.length; i++) {\r\n\t\t\t\t\tlevelIndex[i] = 0;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\r\n\t\t\tlevelIndex[level - 1]++;\r\n\t\r\n\t\t\tconst chapter = levelIndex.slice(0, level).join(MK_POINT);\r\n\t\r\n\t\t\tlevelMap[text.trim()] = chapter;\r\n\t\t\tlastLevel = level;\r\n\t\r\n\t\t\tconst output = `\\n<p class=\"plus-heading\">${chapter}. ${text}</p>\\n`;\r\n\t\t\treturn output;\r\n\t\t} else {\r\n\t\t\tconst output = `\\n<h${level}>${text}</h${level}>\\n`;\r\n\t\t\treturn output;\r\n\t\t}\r\n\r\n\t}\r\n\trendererMD.link = function(href, title, text) {\r\n\t\ttext = text || href;\r\n\t\ttitle = text;\r\n\r\n\t\tlet html = `<a href=\"${linkUrl}${href}\">${text}</a>`;\r\n\t\treturn html;\r\n\t};\r\n\r\n\trendererMD.image = function(href, title, text) {\r\n\t\tif (options.image !== false) {\r\n\t\t\tif (text) {\r\n\t\t\t\ttext = `：${text}`;\r\n\t\t\t}\r\n\t\r\n\t\t\tlet [ _href, align ] = href.split(\"|\");\r\n\t\t\thref = _href;\r\n\t\t\talign = align || imgDefaultAlign;\r\n\t\r\n\t\t\tlet index = imageMap[href];\r\n\r\n\t\t\tif (!index) {\r\n\t\t\t\tindex = imgIndex++;\r\n\t\t\t\timageMap[href] = index;\r\n\t\t\t}\r\n\r\n\t\t\tconst html = `\\n<div class=\"plus-img obj-align__${align}\"><img id=\"#p${index}\" src=\"${fileUrl}${href}\" /><div>图 ${index}${text}</div></div>\\n`;\r\n\t\t\treturn html;\r\n\t\t} else {\r\n\t\t\treturn `<img src=\"${href}\" />`;\r\n\t\t}\r\n\t}\r\n\r\n\trendererMD.code = function (code, info, escaped) {\r\n\t\tinfo = info.replace(\"(\", BLANK);\r\n\t\tinfo = info.replace(\")\", BLANK);\r\n\t\tconst value = _highlight(code, info, escaped);\r\n\r\n\t\treturn `\\n<pre class=\"plus-code\"><code class=\"language-html\">${value}</code></pre>\\n`;\r\n\t};\r\n\r\n\trendererMD.table = function(thead, tbody) {\r\n\t\tconst tableHtml = `<table>${thead}${tbody}</table>`;\r\n\t\tif (options.table !== false) {\r\n\t\t\tconst html = `\\n<div class=\"plus-table\">${tableHtml}</div>\\n`;\r\n\t\t\treturn html;\r\n\t\t} else {\r\n\t\t\treturn `\\n${tableHtml}\\n`;\r\n\t\t}\r\n\t}\r\n\r\n\t// TODO 忘了这是个什么功能了，暂时不做处理，或者用其他方式替换\r\n\t// rendererMD.strong = function(value) {\r\n\t// \tif (options.strong !== false) {\r\n\t// \t\tconst arr = value.split(\"$\");\r\n\t// \t\tlet html = `<span class=\"plus-span-bold`;\r\n\t// \t\tfor (let i = 1; i < arr.length; i++) {\r\n\t// \t\t\tconst part = arr[i];\r\n\t// \t\t\thtml += ` span-${part}`;\r\n\t// \t\t}\r\n\t\r\n\t// \t\thtml = `${html}\">${arr[0]}</span>`;\r\n\t\r\n\t// \t\treturn html;\r\n\t// \t} else {\r\n\t// \t\treturn `<em>${value}</em>`;\r\n\t// \t}\r\n\t// }\r\n\r\n\tconst extractsAtItems = {\r\n\t\tname: \"extractsAtItems\",\r\n\t\tlevel: \"inline\",\r\n\t\tstart: (src) => {\r\n\t\t\tconst match = EXTRACTS_AT_ITEMS_REGX.exec(src);\r\n\t\t\tif (match) {\r\n\t\t\t\tif (options[match[1]] === false) {\r\n\t\t\t\t\treturn -1;\r\n\t\t\t\t}\r\n\t\t\t\treturn match.index;\r\n\t\t\t} else {\r\n\t\t\t\treturn -1;\r\n\t\t\t}\r\n\t\t},\r\n\t\ttokenizer: (src, tokens) => {\r\n\t\t\tconst match = EXTRACTS_AT_ITEMS_REGX.exec(src);\r\n\t\t\tif (match) {\r\n\t\t\t\tlet [ raw, kind, value ] = match;\r\n\t\t\t\tconst text = raw;\r\n\t\t\t\tconst index = src.indexOf(raw);\r\n\t\t\t\traw = src.slice(0, index) + raw;\r\n\r\n\t\t\t\tconst token = {\r\n\t\t\t\t\ttype: \"extractsAtItems\",\r\n\t\t\t\t\traw, value, text, kind,\r\n\t\t\t\t\ttokens:\tlexer.inline(text, tokens)\r\n\t\t\t\t}\r\n\r\n\t\t\t\treturn token;\r\n\t\t\t}\r\n\t\t},\r\n\t\trenderer ({ raw, value, text, kind }) {\r\n\t\t\tlet output = BLANK;\r\n\r\n\t\t\tif (options[kind] === false) {\r\n\t\t\t\treturn text;\r\n\t\t\t}\r\n\r\n\t\t\tswitch (kind) {\r\n\t\t\t\tcase \"image\":\r\n\t\t\t\t\tlet index1 = imageMap[value];\r\n\t\t\t\t\tif (!index1) {\r\n\t\t\t\t\t\tindex1 = imgIndex++;\r\n\t\t\t\t\t\timageMap[value] = index1;\r\n\t\t\t\t\t}\r\n\t\r\n\t\t\t\t\toutput = `<span class=\"plus-span-bold\">图 ${index1}</span>`;\r\n\r\n\t\t\t\t\tbreak;\r\n\t\t\t\tcase \"icon\":\r\n\t\t\t\t\tvalue = value.replace(\",\", SPACE);\r\n\t\t\t\t\toutput = `<i class=\"plus-span-bold ${value}\"></i>`;\r\n\r\n\t\t\t\t\tbreak;\r\n\t\t\t\tcase \"table\":\r\n\t\t\t\t\tconst isTable = value.indexOf(MK_COLON) < 0;\r\n\r\n\t\t\t\t\tif (!isTable) {\r\n\t\t\t\t\t\tvalue = value.slice(1);\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tlet index2 = tableMap[value];\r\n\t\t\t\t\tif (!index2) {\r\n\t\t\t\t\t\tindex2 = tableIndex++;\r\n\t\t\t\t\t\ttableMap[value] = index2;\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tif (isTable) {\r\n\t\t\t\t\t\treturn `\\n<div class=\"obj-align__center plus-span-bold\">表 ${index2}：${value}</div>\\n`; // 在 输入为 @ 的时候，表示这里有个表格，不做任何处理\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\toutput = `<span class=\"plus-span-bold\">表 ${index2}</span>`;\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tbreak;\r\n\t\t\t\tcase \"anchor\":\r\n\t\t\t\t\tconst isAnchor = value.indexOf(MK_COLON) < 0;\r\n\r\n\t\t\t\t\tif (isAnchor) {\r\n\t\t\t\t\t\tlet index = anchorMap[value];\r\n\t\t\t\t\t\tif (!index) {\r\n\t\t\t\t\t\t\tindex = anchorMap[value] = anchorIndex++;\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\toutput = `<span id=\"a_${index}\">${value}</span>`;\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tconst [ key, tVal ] = value.split(MK_COLON); \r\n\t\t\t\t\t\tlet index = anchorMap[key];\r\n\t\t\t\t\t\tif (!index) {\r\n\t\t\t\t\t\t\tindex = anchorMap[key] = anchorIndex++;\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\toutput = `<a href=\"#a_${index}\">${tVal}</a>`;\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tbreak;\r\n\t\t\t}\r\n\r\n\t\t\traw = raw.replace(text, output);\r\n\t\t\traw = raw.replace(SPACE, HTML_BR); // TODO 这里是否只有这个问题还要再看\r\n\t\t\treturn raw;\r\n\t\t}\r\n\t};\r\n\r\n\tconst extractsColor = {\r\n\t\tname: \"extractsColor\",\r\n\t\tlevel: \"inline\",\r\n\t\tstart: (src) => {\r\n\t\t\tif (options.color === false) {\r\n\t\t\t\treturn -1;\r\n\t\t\t}\r\n\t\t\tconst match = EXTRACTS_COLOR_REGX.exec(src);\r\n\t\t\tif (match) {\r\n\t\t\t\treturn match.index;\r\n\t\t\t} else {\r\n\t\t\t\treturn -1;\r\n\t\t\t}\r\n\t\t},\r\n\t\ttokenizer: (src, tokens) => {\r\n\t\t\tconst match = EXTRACTS_COLOR_REGX.exec(src);\r\n\t\t\tif (match) {\r\n\t\t\t\tlet [ raw, color, text ] = match;\r\n\t\t\t\tconst value = raw;\r\n\t\t\t\tconst index = src.indexOf(raw);\r\n\t\t\t\traw = src.slice(0, index) + raw;\r\n\r\n\t\t\t\tconst token = {\r\n\t\t\t\t\ttype: \"extractsColor\",\r\n\t\t\t\t\tproto: value,\r\n\t\t\t\t\traw, color, text,\r\n\t\t\t\t\ttokens: lexer.inlineTokens(text)\r\n\t\t\t\t}\r\n\r\n\t\t\t\treturn token;\r\n\t\t\t}\r\n\t\t},\r\n\t\trenderer ({raw, proto, tokens, color}) {\r\n\t\t\tif (options.color === false) {\r\n\t\t\t\treturn proto;\r\n\t\t\t}\r\n\t\t\tconst value = parser.parseInline(tokens);\r\n\t\t\tconst output = `<span style=\"color:#${color}\">${value}</span>`;\r\n\t\t\traw = raw.replace(proto, output);\r\n\t\t\traw = raw.replace(SPACE, HTML_BR); // TODO 这里是否只有这个问题还要再看\r\n\t\t\treturn raw;\r\n\t\t}\r\n\t};\r\n\r\n\tmarked.setOptions({\r\n\t\trenderer: rendererMD,\r\n\t\tlexer: lexer,\r\n\t\tparser: parser\r\n\t});\r\n\r\n\treturn {\r\n\t\tusing: (opt) => {\r\n\t\t\toptions = opt ? opt : options;\r\n\t\t},\r\n\t\tparse: (file) => {\r\n\t\t\t\tconst extensions = [extractsAtItems, extractsColor].concat(customExtensions);\r\n\r\n\t\t\t\tmarked.use({ extensions });\r\n\t\t\r\n\t\t\t\treturn _parse(marked, file);\r\n\t\t},\r\n\t\taddCustomExtension (obj) {\r\n\t\t\tcustomExtensions.push(obj);\r\n\t\t},\r\n\t\tgetLexer () {\r\n\t\t\treturn lexer;\r\n\t\t},\r\n\t\tgetParser () {\r\n\t\t\treturn parser;\r\n\t\t},\r\n\t\tgetRenderer () {\r\n\t\t\treturn rendererMD;\r\n\t\t},\r\n\t\tcodeHighlight (highlight) {\r\n\t\t\t_highlight = highlight;\r\n\t\t},\r\n\t\tsetFileDefaultUrl (url) {\r\n\t\t\tfileUrl = url;\r\n\t\t\tif (url[url.length - 1] !== MK_SLASH) {\r\n\t\t\t\tfileUrl += MK_SLASH;\r\n\t\t\t}\r\n\t\t},\r\n\t\tsetLinkDefaultUrl (url) {\r\n\t\t\tlinkUrl = url;\r\n\t\t\tif (url[url.length - 1] !== MK_SLASH) {\r\n\t\t\t\tlinkUrl += MK_SLASH;\r\n\t\t\t}\r\n\t\t},\r\n\t\tsetImageDefaultAlign (align) {\r\n\t\t\timgDefaultAlign = align ? align : imgDefaultAlign;\r\n\t\t},\r\n\t\tImageAlign: {\r\n\t\t\tLEFT, RIGHT, CENTER\r\n\t\t}\r\n\t}\r\n}\r\n\r\nmodule.exports = exports = {\r\n    parse: _parse,\r\n    create\r\n}\r\n\n\n//# sourceURL=webpack://modell-markedjs-plus/./src/modules/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./build/js.js");
/******/ 	
/******/ })()
;