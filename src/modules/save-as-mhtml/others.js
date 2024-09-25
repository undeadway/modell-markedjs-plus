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
    /*
     * 非浏览器环境下，图片地址如果以 http 开头，则认为是网络图片，
     * 不然一律以本体图片处理，而本地图片不管是否真是本地图片则不做考虑
     */
    return []; // TODO 暂时返回空
}

const write = (fileName, output, outputDir) => {
    outputDir = outputDir || `${__dirname}/../../../dist`;
    fs.writeFileSync(`${outputDir}/${fileName}.mhtml`, output);
}

module.exports = exports = {
	getStyles,
	getFilesBase64,
	write
}