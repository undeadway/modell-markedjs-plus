function getInstance() {

  const customExtensions = [];

  const imageMap = {}, tableMap = {}, levelMap = {};
  let tableIndex = 1, imgIndex = 1;
  let levelIndex = [ 0, 0, 0, 0, 0, 0 ], lastLevel = 0;

  const rendererMD = new marked.Renderer();
  const lexer = new marked.Lexer();
  const parser = new marked.Parser();

  rendererMD.heading = function(text, level, raw) {
    if (lastLevel > level) {
      for (let i = level; i < levelIndex.length; i++) {
        levelIndex[i] = 0;
      }
    }

    levelIndex[level - 1]++;

    const chapter = levelIndex.slice(0, level).join(".");

    levelMap[text.trim()] = chapter;
    lastLevel = level;

    const output = `<p class="doc-heading">${chapter}. ${text}</p>`;
    return output;
  }
  rendererMD.link = function(href, title, text) {
    let html = `<a href="${href} title="${title}">${text}</a>`;
    return html;
  };
  rendererMD.image = function(href, title, text) {
    if (text) {
      text = `：${text}`;
    }

    let [ _href, align ] = href.split("|");
    href = _href;
    align = align || "left";

    let index = imageMap[href];
    if (!index) {
      index = imgIndex++;
      imageMap[href] = index;
    }
    const html = `<div class="doc-img obj-align__${align}"><img id="#p${index}" src="${href}" /><div>图 ${index}${text}</div></div>`;
    return html;
  }
  rendererMD.table = function(thead, tbody) {
    const html = `<div class="doc-table"><table>${thead}${tbody}</table></div>`;
    return html;
  }
  rendererMD.strong = function(value) {
    const arr = value.split("$");
    let html = `<span class="span-bold`;
    for (let i = 1; i < arr.length; i++) {
      const part = arr[i];
      html += ` span-${part}`;
    }

    html = `${html}">${arr[0]}</span>`;

    return html;
  }

  const extractsAt = {
    name: "extractsAt",
    level: "inline",
    start: (src) => {
      const match = /@\[(image|icon|table|title)\]\((\S+?)\)/.exec(src);
      if (match) {
        return match.index;
      } else {
        return -1;
      }
    },
    tokenizer: (src, tokens) => {
      const match = /@\[(image|icon|table|title)\]\((\S+?)\)/.exec(src);
      if (match) {
        let [ raw, kind, value ] = match;
        const text = raw;
        const index = src.indexOf(raw);
        raw = src.slice(0, index) + raw;

        const token = {
          type: "extractsAt",
          raw, value, text, kind,
          tokens:  lexer.inline(text, tokens)
        }

        return token;
      }
    },
    renderer ({ raw, value, text, kind }) {
      let output = null;
      switch (kind) {
        case "image":
          let index1 = imageMap[value];
          if (!index1) {
            index1 = imgIndex++;
            imageMap[value] = index1;
          }

          output = `<span class="span-bold">图 ${index1}</span>`;
          break;
        case "icon":
          value = value.replace(",", " ");
          output = `<i class="span-bold ${value}"></i>`;
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
            return `<div class="obj-align__center span-bold">表 ${index2}</div>`; // 在 输入为 @X 的时候，表示这里有个表格，不做任何处理
          } else {
            output = `<span class="span-bold">表 ${index2}</span>`;
          }

          break;
        case "title":
          const chapter = levelMap[value];
          output = `<span>${chapter}. 节《${value}》</span>`;
      }

      raw = raw.replace(text, output);
      raw = raw.replace("  ", "<br />"); // TODO 这里是否只有这个问题还要再看
      return raw;
    }
  };

  const extractsColor = {
    name: "extractsColor",
    level: "inline",
    start: (src) => {
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
      const value = parser.parseInline(tokens);
      const output = `<span style="color:#${color}">${value}</span>`;
      raw = raw.replace(proto, output);
      raw = raw.replace("  ", "<br />"); // TODO 这里是否只有这个问题还要再看
      return raw;
    }
  };

  marked.setOptions({
    renderer: rendererMD,
    lexer: parser
  });

  return {
    parse: (file) => {
      try {
        const extensions = [extractsAt, extractsColor].concat(customExtensions);

        marked.use({ extensions });
    
        let html = marked.parse(file);
        html = html.replace("\n", "<br />");
        html = `<div class="my-markedjs-plus-box">${html}</div>`;
        return html;
      } catch (err) {
        console.log(err);
        return null;
      }

    },
    addCutomExtension (obj) {
      customExtensions.push(obj);
    },
    getLexer () {
      return lexer;
    },
    getParser () {
      return parser;
    }
  }
}

module.exports = exports = {
  create: getInstance
};