const utils = require("../../lib/utils");
const Client = utils.isBbrowser() ? require("./browser") : require("./others");

const UPPER_CASE = "ABCDEFGHIJKLIMOPQRSTUVWXYZ", LOWER_CASE = "abcdefghijklmnopqrstuvwxyz", DIGIT = "1234567890";
const LETTERS = `${UPPER_CASE}${LOWER_CASE}`, UPPER_DIGIT = `${UPPER_CASE}${DIGIT}`, LETTER_DIGIT = `${LETTERS}${DIGIT}`;

const execute = async (html, fileName, contentLocation, outputDir) => {
	contentLocation = contentLocation || "http://localhost/"

	const styles = Client.getStyles(); 	// CSS

	let input = urlEncode(html);
	input = input.replaceAll("=\"", "=3D\"");
	const contents = [];
	contents.push("<!DOCTYPE html><html lang=3D\"zh-CN\" class=3D\" \"><head><meta http-equiv=3D\"Content-Type\" content=3D\"text/html; charset=3DUTF-8\">");

	for (const style of styles) {
		contents.push(`<link rel=3D"stylesheet" type=3D"text/css" href=3D"${style.contentLocation}" />`);
	}

	contents.push(`<body>${input}</body></html>`);

	let contentId = Date.now().toString(16).toUpperCase() + Math.random().toString(16).slice(2).toUpperCase();

	for (let i = contentId.length; i < 32; i++) {
		const ch = UPPER_DIGIT[Math.floor(Math.random() * 36)];
		contentId += ch;
	}

	const subjName = urlEncode(fileName);
	const boundary = `----MultipartBoundary--${createBoundary()}----`;

	const output = [
		"From: <Saved by Blink>",
		`Snapshot-Content-Location:${contentLocation}`,
		`Subject: =?utf-8?Q?${subjName}?=`,
		utils.getFormattedDate(),
		"MIME-Version: 1.0",
		"Content-Type: multipart/related;",
		"	type=\"text/html\";",
		` boundary=${boundary}`,
		"", "", // 两个空行
		// 文本内容部分
		`--${boundary}`,
		"Content-Type: text/html",
		`Content-ID: <frame-${contentId}@mhtml.blink>`,
		"Content-Transfer-Encoding: quoted-printable",
		`Content-Location:${contentLocation}`,
		"",
		contents.join(""),
		""
	];

	for (const style of styles) {
		if (!style.value) continue;
		createExtern(output, boundary, style);
	}

	const files = await Client.getFilesBase64(html, contentLocation); // 图片

	for (const file of files) {
		if (!file.value) continue;
		createExtern(output, boundary, file);
	}

	output.push(`--${boundary}--`);

	Client.write(fileName, output.join("\r\n"), outputDir);
}

function createExtern (output, boundary, { contentType, contentTransferEncoding, contentLocation, value }) {
	output.push(`--${boundary}`);
	output.push(`Content-Type: ${contentType}`);
	output.push(`Content-Transfer-Encoding: ${contentTransferEncoding}`);
	output.push(`Content-Location: ${contentLocation}`);
	output.push("");
	output.push(value);
	output.push("");
}

function urlEncode (input) {
	const output = [];
	for (let i = 0, len = input.length; i < len; i++) {
		let ch = input[i];
		const chCode = ch.charCodeAt(0);
		// 这里的用法来自 nodejs 的 _http_common.js 的 303-326 行（可能会随着版本不同，写法、位置都有所变化）
		// 调用函数是 ：checkInvalidHeaderChar
		if (((chCode <= 31 && chCode !== 9) || chCode > 255 || chCode === 127)) {
			ch = encodeURIComponent(ch);
			ch = ch.replaceAll("%", "=");
			output.push(ch);
		} else {
			output.push(ch);
		}
	}

	return output.join("");
}

function createBoundary () {
	// 第一位字母
	const output = [ LETTERS[Math.floor(Math.random() * 52)]] ;

	// 后面是字母+数字，合计 43 位
	for (let i = 0; i < 42; i++) {
		const ch = LETTER_DIGIT[Math.floor(Math.random() * 62)];
		output.push(ch);
	}

	return output.join("");
}

module.exports = exports = execute;
