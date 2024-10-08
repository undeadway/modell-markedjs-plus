const fs = require("fs");
const http = require("http");
const https = require("https");
const fileinfo = require("fileinfo");
const { BASE64, BINARY, HTTP, HTTPS, WINDOWS_PATH_REGX, HTML_IMAGE_REGX, MIME_TEXT_CSS,
		MK_DASH, MK_POINT, MK_SLASH, BLANK, QUOTED_PRINTABLE, AT_MHTML_BLINK } = require("./../../lib/constants");

const getStyles = () => {
	const data = fs.readFileSync(`${__dirname}/../../../dist/modell-markedjs-plus.css`);
	const output = [];

	let random = (Math.random()).toString();
	random = random.replace(MK_POINT, MK_DASH);
	output.push({
		contentType: MIME_TEXT_CSS,
		contentTransferEncoding: QUOTED_PRINTABLE,
		contentLocation: `cid:css-${Date.now()}-${random}${AT_MHTML_BLINK}`,
		value: data
	});

	return output;
}

const getFilesBase64 = async (html, contentLocation) => {
	const arr = [];

	while (true) {
		const matched = html.match(HTML_IMAGE_REGX);
		if (matched === null) break;

		const promise = new Promise((resolve, reject) => {
			let path = matched[2];
			let fileName = path.split(MK_SLASH);
			fileName = fileName[fileName.length - 1];
			if (path.indexOf(HTTP) === 0) { // 非浏览器环境下，图片地址如果以 http 开头，则认为是网络图片，
				const server = path.indexOf(HTTPS) === 0 ? https : http; // TODO 请求 https 现在会出错，原因还要调查
				
				server.get(path, (response) => {

					const { statusCode } = response;
					// const contentType = response.headers['content-type']; // TODO 这里不知道是否还有用，暂时留着

					// 任何 2xx 状态码都表示成功响应，但这里只检查 200。
					if (statusCode !== 200) {
						// 消费响应数据以释放内存
						response.resume();
						resolve({}); // 如果获取文件失败,则返回一个空对象，至少让程序不中途崩溃
						return;
					}

					let data = BLANK;
					response.setEncoding(BINARY);
					response.on('data', function (chunk) {
						data += chunk;
					});
					response.on("end", function () {
						data = Buffer.from(data, BINARY);
						const contentType = getContentTypeFromBuffer(data);
						data = data.toString(BASE64);

						resolve({contentLocation: path, value: data, contentType, contentTransferEncoding: BASE64});
					});
				});
			} else { // 不然一律以本体图片处理，而本地图片不管是否真是本地图片则不做考虑
 				// / 开头，linux 绝对路径文件
				// 字母:\ 开头，windows 绝对路径文件
				// 其他 相对路径文件
				// TODO 因为 windows 的文件路径处理起来相当麻烦，所以暂时不对 windows 的文件路径进行处理
				// 或者说暂时智能处理 相对路径和网络路径
				try {
					let tmpPath = path;
					if (path.indexOf(MK_SLASH) !== 0 && path.match(WINDOWS_PATH_REGX) === null) {
						// 如果是绝对路径，则不做任何处理，只处理相对路径
						tmpPath =  process.cwd() + MK_SLASH + path;
					}

					let data = fs.readFileSync(tmpPath, BINARY);
					data = Buffer.from(data, BINARY);
					const contentType = getContentTypeFromBuffer(data);
					data = data.toString(BASE64);

					let ext = fileName.split(MK_POINT);
					ext = ext[ext.length - 1];

					// TODO 不知道为什么，本地文件需要前面加一个 localhost 的前缀
					resolve({contentLocation: `${contentLocation}${path}`, value: data, contentType, contentTransferEncoding: BASE64});
				} catch (err) { // 此处包含文件获取失败
					resolve({}); // 如果获取文件失败,则返回一个空对象，至少让程序不中途崩溃
				}
			}
		});

		arr.push(promise);
		html = html.replace(matched[0], BLANK);
	}

	const output = await Promise.all(arr);
	return output;
}

function getContentTypeFromBuffer (buffer) {
	const res = fileinfo.fromBuffer(buffer);
	return res.mime;
}

const write = (fileName, output, outputDir) => {
	outputDir = outputDir || `${__dirname}/../../../demo`;
	fs.writeFileSync(`${outputDir}/${fileName}.mhtml`, output);
}

module.exports = exports = {
	getStyles,
	getFilesBase64,
	write
}
