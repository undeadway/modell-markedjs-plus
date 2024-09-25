import dayjs from "dayjs";
import utils from "../lib/utils";

const LETTERS = "ABCDEFGHIJKLIMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const LETTERS_DIGIT = "ABCDEFGHIJKLIMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";

async function execute (html, fileName, contentLocation) {
	// CSS
	const styles = getStyles();

	let input = urlEncode(html);
	input = input.replaceAll("=\"", "=3D\"");
	const inputs = [];
	inputs.push("<!DOCTYPE html><html lang=3D\"zh-CN\" class=3D\" \"><head><meta http-equiv=3D\"Content-Type\" content=3D\"text/html; charset=3DUTF-8\">");

	for (const style of styles) {
		inputs.push(`<link rel=3D"stylesheet" type=3D"text/css" href=3D"${style.cid}" />`);
	}

	inputs.push(`<body>${input}</body></html>`);

	const subjName = urlEncode(fileName);
	const date = "Date: " + dayjs.format(new Date(), "ddd, DD MMM yyyy hh:mm:ss +0800");
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
		"Content-ID: <frame-3394E9645D3080A4E4C635EC07ED414E@mhtml.blink>",
		"Content-Transfer-Encoding: quoted-printable",
		`Content-Location:${contentLocation}`,
		"",
		inputs.join(""),
		"",
	];

	output = output.concat(content);

	for (const style of styles) {
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
	const files = await getFilesBase64(html);

	for (const file of files) {
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

	return output;

	// const urlObject = window.URL || window.webkitURL || window;
	// const myFile = new Blob([output]);
	// var saveLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	// saveLink.href = urlObject.createObjectURL(myFile);
	// saveLink.download = `${name}.mhtml`;

	// const ev = document.createEvent("MouseEvents");
	// ev.initMouseEvent(
	// 	"click", true, false, window, 0, 0, 0, 0, 0
	// 	, false, false, false, false, 0, null
	// );
	// saveLink.dispatchEvent(ev);

}

function urlEncode (input) {
	const output = [];
	for (let i = 0, len = input.length; i < len; i++) {
		let ch = input[i];
		const chCode = ch.charCodeAt(0);
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

async function getFilesBase64 (html) {
	const regx = /<img id="#p(\d)+" src="(\S{1,})" \/>/;

	const arr = [];

	while (true) {
		const matched = html.match(regx);
		if (matched === null) break;

		const promise = new Promise((resolve, reject) => {
		fetch(matched[2]).then(async response => {
			if (response.ok) {
			const blob = await response.blob();
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = function (e) {
				// data:image/png;base64,iVBORw0KGgo...
				const { result } = e.target;
				const first = result.slice(5, 21).split(";");
				const base64Val = result.slice(22);
				resolve({name: matched[2], base64: base64Val, contentType: first[0], contentTransferEncoding: first[1]});
			}
			} else {
			reject(`HTTP 错误！状态：${response.status}`);
			}
		});
		});

		arr.push(promise);

		html = html.replace(matched[0], "");
	}

	const output = await Promise.all(arr);

	return output;
}

function getStyles () {
	const output = [];
	const styles = document.getElementsByTagName("style");
	for (const { innerText } of styles) {
		try {
		if (utils.checkObjectIsNotEmpty(innerText) && innerText.indexOf(".modell-") >= 0) {
			let random = (Math.random()).toString();
			random = random.replace(".", "-");
			output.push({
			contentType: "text/css",
			contentTransferEncoding: "quoted-printable",
			cid: `cid:css-${Date.now()}-${random}@mhtml.blink`,
			css: innerText
			})
		}
		}catch (err) {
		console.log(err);
		}
	}

	return output;
}

function createBoundary () {
	// 第一位字母
	const output = [ LETTERS[Math.floor(Math.random() * 52)]] ;

	// 后面是字母+数字，合计 43 位
	for (let i = 0; i < 42; i++) {
		const ch = LETTERS_DIGIT[Math.floor(Math.random() * 62)];
		output.push(ch);
	}

	return output.join("");
}

export default {
	execute
}