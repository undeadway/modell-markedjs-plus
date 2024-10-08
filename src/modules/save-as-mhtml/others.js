const fs = require("fs");
const http = require("http");
const https = require("https");
const fileinfo = require("fileinfo");

const getStyles = () => {
	const data = fs.readFileSync(`${__dirname}/../../../dist/modell-markedjs-plus.css`);
	const output = [];

	let random = (Math.random()).toString();
	random = random.replace(".", "-");
	output.push({
		contentType: "text/css",
		contentTransferEncoding: "quoted-printable",
		contentLocation: `cid:css-${Date.now()}-${random}@mhtml.blink`,
		value: data
	});

	return output;
}

const getFilesBase64 = async (html, contentLocation) => {
	const regx = /<img id="#p(\d)+" src="(\S{1,})" \/>/;
	const arr = [];

	while (true) {
		const matched = html.match(regx);
		if (matched === null) break;

		const promise = new Promise((resolve, reject) => {
			let path = matched[2];
			let fileName = path.split("/");
			fileName = fileName[fileName.length - 1];
			if (path.indexOf("http") === 0) { // 非浏览器环境下，图片地址如果以 http 开头，则认为是网络图片，
				const server = path.indexOf("https") === 0 ? https : http; // TODO 请求 https 现在会出错，原因还要调查
				
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

					let data = "";
					response.setEncoding("binary");
					response.on('data', function (chunk) {
						data += chunk;
					});
					response.on("end", function () {
						data = Buffer.from(data, "binary");
						const contentType = getContentTypeFromBuffer(data);
						data = data.toString("base64");

						resolve({contentLocation: path, value: data, contentType, contentTransferEncoding: "base64"});
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
					if (path.indexOf("/") !== 0 && path.match(/^[a-zA-Z]:/) === null) {
						// 如果是绝对路径，则不做任何处理，只处理相对路径
						tmpPath =  process.cwd() + "/" + path;
					}

					let data = fs.readFileSync(tmpPath, "binary");
					data = Buffer.from(data, "binary");
					const contentType = getContentTypeFromBuffer(data);
					data = data.toString("base64");

					let ext = fileName.split(".");
					ext = ext[ext.length - 1];

					// TODO 不知道为什么，本地文件需要前面加一个 localhost 的前缀
					resolve({contentLocation: `${contentLocation}${path}`, value: data, contentType, contentTransferEncoding: "base64"});
				} catch (err) { // 此处包含文件获取失败
					resolve({}); // 如果获取文件失败,则返回一个空对象，至少让程序不中途崩溃
				}
			}
		});

		arr.push(promise);
		html = html.replace(matched[0], "");
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
