const utils = require("../../lib/utils");
const Client = utils.isBbrowser() ? require("./browser") : require("./others");

const { UPPER_CASE, LOWER_CASE, DIGIT, BLANK, MIME_TEXT_CSS, MIME_TEXT_HTML, QUOTED_PRINTABLE, AT_MHTML_BLINK } = require("./../../lib/constants");
const LETTERS = `${UPPER_CASE}${LOWER_CASE}`, UPPER_DIGIT = `${UPPER_CASE}${DIGIT}`, LETTER_DIGIT = `${LETTERS}${DIGIT}`;

const execute = async (html, fileName, contentLocation, outputDir) => {
	contentLocation = contentLocation || "http://localhost/"

	const styles = Client.getStyles(); 	// CSS

	const contents = [`<!DOCTYPE html><html lang=3D\"zh-CN\" class=3D\" \"><head><meta http-equiv=3D\"Content-Type\" content=3D\"${MIME_TEXT_HTML}; charset=3DUTF-8\">`];

	for (const style of styles) {
		contents.push(`<link rel=3D"stylesheet" type=3D"${MIME_TEXT_CSS}" href=3D"${style.contentLocation}" />`);
	}

	let input = urlEncode(html);
	input = input.replaceAll("=\"", "=3D\"");
	contents.push(`<body>${input}</body></html>`);

	let contentId = Date.now().toString(16).toUpperCase() + Math.random().toString(16).slice(2).toUpperCase();

	for (let i = contentId.length; i < 32; i++) {
		const ch = UPPER_DIGIT[Math.floor(Math.random() * 36)];
		contentId += ch;
	}

	const boundary = `----MultipartBoundary--${createBoundary()}----`;

	const output = [
		"From: <Saved by Blink>",
		`Snapshot-Content-Location:${contentLocation}`,
		`Subject: =?utf-8?Q?${urlEncode(fileName)}?=`,
		utils.getFormattedDate(),
		"MIME-Version: 1.0",
		"Content-Type: multipart/related;",
		`	type="${MIME_TEXT_HTML}";`,
		` boundary=${boundary}`,
		BLANK, BLANK, // 两个空行
		// 文本内容部分
		`--${boundary}`,
		`Content-Type: ${MIME_TEXT_HTML}`,
		`Content-ID: <frame-${contentId}${AT_MHTML_BLINK}>`,
		`Content-Transfer-Encoding: ${QUOTED_PRINTABLE}`,
		`Content-Location:${contentLocation}`,
		BLANK,
		contents.join(BLANK),
		BLANK
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
	output.push(BLANK);
	output.push(value);
	output.push(BLANK);
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

	return output.join(BLANK);
}

function createBoundary () {
	// 第一位字母
	const output = [ LETTERS[Math.floor(Math.random() * 52)]] ;

	// 后面是字母+数字，合计 43 位
	for (let i = 0; i < 42; i++) {
		const ch = LETTER_DIGIT[Math.floor(Math.random() * 62)];
		output.push(ch);
	}

	return output.join(BLANK);
}

module.exports = exports = execute;
