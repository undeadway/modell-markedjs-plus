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

const WEEK_DAYS = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
const MONTH_LIST = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

const getFormattedDate = () => {
	const dt = new Date();
	const day = dt.getDay();
	const month = dt.getMonth();
	const year = dt.getFullYear();
	let date = dt.getDate();
	if (date < 10) {
		date = `0${date}`;
	}
	let hours = dt.getHours();
	if (hours < 10) {
		hours = `0${hours}`;
	}
	let miinutes = dt.getMinutes();
	if (miinutes < 10) {
		miinutes = `0${miinutes}`;
	}
	let seconds = dt.getSeconds();
	if (seconds < 10) {
		seconds = `0${seconds}`;
	}

	const output = `Date: ${WEEK_DAYS[day]}, ${date} ${MONTH_LIST[month]} ${year} ${hours}:${miinutes}:${seconds} +0800`;
	return output;
}

module.exports = exports = {
	checkNumberIsNotEmpty,
	checkObjectIsNotEmpty,
	isBbrowser,
	getFormattedDate
};
