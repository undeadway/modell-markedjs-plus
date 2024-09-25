const fs = require("fs");
const http = require("fs");

const getStyles = () => {
    const data = fs.readFileSync(`${__dirname}/../../../dist/modell-markedjs-plus.css`);
    const output = [];

    let random = (Math.random()).toString();
    random = random.replace(".", "-");
    output.push({
        contentType: "text/css",
        contentTransferEncoding: "quoted-printable",
        cid: `cid:css-${Date.now()}-${random}@mhtml.blink`,
        css: data
    });

    return output;
}

const getFilesBase64 = async (html) => {
    return []; // TODO 暂时返回空
}

const write = (fileName, output) => {
    fs.writeFileSync(`${__dirname}/../../../dist/${fileName}.mhtml`, output);
}

module.exports = exports = {
	getStyles,
	getFilesBase64,
	write
}