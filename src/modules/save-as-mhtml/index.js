const dayjs = require("dayjs");
const utils = require("../../lib/utils");
const Client = utils.isBbrowser() ? require("./browser") : require("./others");

const UPPER_CASE = "ABCDEFGHIJKLIMOPQRSTUVWXYZ";
const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "1234567890";

const LETTERS = `${UPPER_CASE}${LOWER_CASE}`;
const UPPER_DIGIT = `${UPPER_CASE}${DIGIT}`;
const LETTER_DIGIT = `${LETTERS}${DIGIT}`;

const execute = async (html, fileName, contentLocation, outputDir) => {
	contentLocation = contentLocation || "http://localhost/"

	// CSS
	const styles = Client.getStyles();

	let input = urlEncode(html);
	input = input.replaceAll("=\"", "=3D\"");
	const inputs = [];
	inputs.push("<!DOCTYPE html><html lang=3D\"zh-CN\" class=3D\" \"><head><meta http-equiv=3D\"Content-Type\" content=3D\"text/html; charset=3DUTF-8\">");

	for (const style of styles) {
		inputs.push(`<link rel=3D"stylesheet" type=3D"text/css" href=3D"${style.cid}" />`);
	}

	inputs.push(`<body>${input}</body></html>`);

	let contentId = Date.now().toString(16).toUpperCase();
	contentId += Math.random().toString(16).slice(2).toUpperCase();

	for (let i = contentId.length; i < 32; i++) {
		const ch = UPPER_DIGIT[Math.floor(Math.random() * 36)];
		contentId += ch;
	}

	const subjName = urlEncode(fileName);
	const date = "Date: " + dayjs(new Date()).format("ddd, DD MMM yyyy hh:mm:ss +0800");
	const boundary = `----MultipartBoundary--${createBoundary()}----`;

	let output = [
		"From: <Saved by Blink>",
		`Snapshot-Content-Location:${contentLocation}`,
		`Subject: =?utf-8?Q?${subjName}?=`,
		date,
		"MIME-Version: 1.0",
		"Content-Type: multipart/related;",
		"	type=\"text/html\";",
		` boundary=${boundary}`,
		"", "" // 两个空行
	];

	const content = [
		`--${boundary}`,
		"Content-Type: text/html",
		`Content-ID: <frame-${contentId}@mhtml.blink>`,
		"Content-Transfer-Encoding: quoted-printable",
		`Content-Location:${contentLocation}`,
		"",
		inputs.join(""),
		"",
	];

	output = output.concat(content);

	for (const style of styles) {
		if (!style.css) continue;
		const arr = [
			`--${boundary}`,
			`Content-Type: ${style.contentType}`,
			`Content-Transfer-Encoding: ${style.contentTransferEncoding}`,
			`Content-Location: ${style.cid}`,
			"",
			style.css,
			"",
		];

		output = output.concat(arr);
	}

	// 图片
	const files = await Client.getFilesBase64(html, contentLocation);

	for (const file of files) {
		if (!file.base64) continue;
		const arr = [
			`--${boundary}`,
			`Content-Type: ${file.contentType}`,
			`Content-Transfer-Encoding: ${file.contentTransferEncoding}`,
			`Content-Location: ${file.name}`,
			"",
			file.base64,
			"",
		];

		output = output.concat(arr);
	}

	output.push(`--${boundary}--`);
	output = output.join("\r\n");

	Client.write(fileName, output, outputDir);
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

module.exports = exports = {
	execute
}
