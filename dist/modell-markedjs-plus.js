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

/***/ "./src/base.js":
/*!*********************!*\
  !*** ./src/base.js ***!
  \*********************/
/***/ ((module, exports) => {

eval("function getInstance() {\r\n\r\n  const customExtensions = [];\r\n\r\n  const imageMap = {}, tableMap = {}, levelMap = {};\r\n  let tableIndex = 1, imgIndex = 1;\r\n  let levelIndex = [ 0, 0, 0, 0, 0, 0 ], lastLevel = 0;\r\n\r\n  const rendererMD = new marked.Renderer();\r\n  const lexer = new marked.Lexer();\r\n  const parser = new marked.Parser();\r\n\r\n  rendererMD.heading = function(text, level, raw) {\r\n    if (lastLevel > level) {\r\n      for (let i = level; i < levelIndex.length; i++) {\r\n        levelIndex[i] = 0;\r\n      }\r\n    }\r\n\r\n    levelIndex[level - 1]++;\r\n\r\n    const chapter = levelIndex.slice(0, level).join(\".\");\r\n\r\n    levelMap[text.trim()] = chapter;\r\n    lastLevel = level;\r\n\r\n    const output = `<p class=\"doc-heading\">${chapter}. ${text}</p>`;\r\n    return output;\r\n  }\r\n  rendererMD.link = function(href, title, text) {\r\n    let html = `<a href=\"${href} title=\"${title}\">${text}</a>`;\r\n    return html;\r\n  };\r\n  rendererMD.image = function(href, title, text) {\r\n    if (text) {\r\n      text = `：${text}`;\r\n    }\r\n\r\n    const [ _href, align ] = href.split(\"|\");\r\n    href = _href;\r\n    align = align || \"left\";\r\n\r\n    let index = imageMap[href];\r\n    if (!index) {\r\n      index = imgIndex++;\r\n      imageMap[href] = index;\r\n    }\r\n    const html = `<div class=\"doc-img obj-align__${align}\"><img id=\"#p${index}\" src=\"${href}\" /><div>图 ${index}${text}</div></div>`;\r\n    return html;\r\n  }\r\n  rendererMD.table = function(thead, tbody) {\r\n    const html = `<div class=\"doc-table\"><table>${thead}${tbody}</table></div>`;\r\n    return html;\r\n  }\r\n  rendererMD.strong = function(value) {\r\n    const arr = value.split(\"$\");\r\n    let html = `<span class=\"span-bold`;\r\n    for (let i = 1; i < arr.length; i++) {\r\n      const part = arr[i];\r\n      html += ` span-${part}`;\r\n    }\r\n\r\n    html = `${html}\">${arr[0]}</span>`;\r\n\r\n    return html;\r\n  }\r\n\r\n  const extractsAt = {\r\n    name: \"extractsAt\",\r\n    level: \"inline\",\r\n    start: (src) => {\r\n      const match = /@\\[(image|icon|table|title)\\]\\((\\S+?)\\)/.exec(src);\r\n      if (match) {\r\n        return match.index;\r\n      } else {\r\n        return -1;\r\n      }\r\n    },\r\n    tokenizer: (src, tokens) => {\r\n      const match = /@\\[(image|icon|table|title)\\]\\((\\S+?)\\)/.exec(src);\r\n      if (match) {\r\n        let [ raw, kind, value ] = match;\r\n        const text = raw;\r\n        const index = src.indexOf(raw);\r\n        raw = src.slice(0, index) + raw;\r\n\r\n        const token = {\r\n          type: \"extractsAt\",\r\n          raw, value, text, kind,\r\n          tokens:  lexer.inline(text, tokens)\r\n        }\r\n\r\n        return token;\r\n      }\r\n    },\r\n    renderer ({ raw, value, text, kind }) {\r\n      let output = null;\r\n      switch (kind) {\r\n        case \"image\":\r\n          let index1 = imageMap[value];\r\n          if (!index1) {\r\n            index1 = imgIndex++;\r\n            imageMap[value] = index1;\r\n          }\r\n\r\n          output = `<span class=\"span-bold\">图 ${index1}</span>`;\r\n          break;\r\n        case \"icon\":\r\n          value = value.replace(\",\", \" \");\r\n          output = `<i class=\"span-bold ${value}\"></i>`;\r\n          break;\r\n        case \"table\":\r\n          const isTable = value.indexOf(\":\") < 0;\r\n\r\n          if (!isTable) {\r\n            value = value.slice(1);\r\n          }\r\n\r\n          let index2 = tableMap[value];\r\n          if (!index2) {\r\n            index2 = tableIndex++;\r\n            tableMap[value] = index2;\r\n          }\r\n\r\n          if (isTable) {\r\n            return `<div>表 ${index2}</div></div>`; // 在 输入为 @X 的时候，表示这里有个表格，不做任何处理\r\n          } else {\r\n            output = `<span class=\"span-bold\">表 ${index2}</span>`;\r\n          }\r\n\r\n          break;\r\n        case \"title\":\r\n          const chapter = levelMap[value];\r\n          output = `<span>${chapter}. 节《${value}》</span>`;\r\n      }\r\n\r\n      raw = raw.replace(text, output);\r\n      raw = raw.replace(\"  \", \"<br />\"); // TODO 这里是否只有这个问题还要再看\r\n      return raw;\r\n    }\r\n  };\r\n\r\n  const extractsColor = {\r\n    name: \"extractsColor\",\r\n    level: \"inline\",\r\n    start: (src) => {\r\n      const match = /#\\[([0-9a-fA-F]{6})\\]\\{([\\S\\s]+?)\\}/.exec(src);\r\n      if (match) {\r\n        return match.index;\r\n      } else {\r\n        return -1;\r\n      }\r\n    },\r\n    tokenizer: (src, tokens) => {\r\n      const match = /#\\[([0-9a-fA-F]{6})\\]\\{([\\S\\s]+?)\\}/.exec(src);\r\n      if (match) {\r\n        let [ raw, color, text ] = match;\r\n        const value = raw;\r\n        const index = src.indexOf(raw);\r\n        raw = src.slice(0, index) + raw;\r\n\r\n        const token = {\r\n          type: \"extractsColor\",\r\n          proto: value,\r\n          raw, color, text,\r\n          tokens: lexer.inlineTokens(text)\r\n        }\r\n\r\n        return token;\r\n      }\r\n    },\r\n    renderer ({raw, proto, tokens, color}) {\r\n      const value = parser.parseInline(tokens);\r\n      const output = `<span style=\"color:#${color}\">${value}</span>`;\r\n      raw = raw.replace(proto, output);\r\n      raw = raw.replace(\"  \", \"<br />\"); // TODO 这里是否只有这个问题还要再看\r\n      return raw;\r\n    }\r\n  };\r\n\r\n  marked.setOptions({\r\n    renderer: rendererMD,\r\n    lexer: parser\r\n  });\r\n\r\n  return {\r\n    parse: () => {\r\n      try {\r\n        const extensions = [extractsAt, extractsColor].concat(customExtensions);\r\n\r\n        marked.use({ extensions });\r\n    \r\n        let html = marked.parse(file);\r\n        html = html.replace(\"\\n\", \"<br />\");\r\n        html = `<div class=\"modell-markedjs-plus--box\">${html}</div>`;\r\n    \r\n        return html;\r\n      } catch (err) {\r\n        console.log(err);\r\n        return null;\r\n      }\r\n\r\n    },\r\n    addCutomExtension (obj) {\r\n      customExtensions.push(obj);\r\n    },\r\n    getLexer () {\r\n      return lexer;\r\n    },\r\n    getParser () {\r\n      return parser;\r\n    }\r\n  }\r\n}\r\n\r\nmodule.exports = exports = {\r\n  create: getInstance\r\n};\n\n//# sourceURL=webpack://modell-markedjs-plus/./src/base.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, exports, __webpack_require__) => {

eval("const base = __webpack_require__(/*! ./base */ \"./src/base.js\");\r\n\r\nconst parse = base.create();\r\n\r\n// 在这里引入其他的处理就可以不断增加各种自定义处理了\r\n\r\nmodule.exports = exports = parse;\n\n//# sourceURL=webpack://modell-markedjs-plus/./src/index.js?");

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
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;