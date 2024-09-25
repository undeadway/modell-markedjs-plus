const side = typeof (window) !== "undefined"; // 设置端点，side = true 浏览器环境 side = false 非浏览器环境
const isBbrowser = () => {
	return side;
}

const checkNumberIsNotEmpty = (input) => {
	if (checkObjectIsNotEmpty(input)) {
		return !isNaN(input);
	} else {
		return false;
	}
}

const checkObjectIsNotEmpty = (input) => {
	// 先去除掉 null、undefined、[]、""
	if (input === null || input === undefined) {
		return false;
	} else if (Array.isArray(input)) {
		return input.length > 0;
	} else if ( typeof(input) === "string") {
		return input.length > 0;
	} else if (typeof(input) === "object") {
		const keys = Object.keys(input);
		return keys.length > 0;
	} else {
		return true;
	}
}

module.exports = exports = {
	checkNumberIsNotEmpty,
	checkObjectIsNotEmpty,
	isBbrowser
};