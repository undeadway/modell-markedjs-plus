const BASE64 = "base64";
const BINARY = "binary";
const UPPER_CASE = "ABCDEFGHIJKLIMOPQRSTUVWXYZ";
const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "1234567890";

const WINDOWS_PATH_REGX = /^[a-zA-Z]:/;
const IMAGE_REGX = /<img id="#p(\d)+" src="(\S{1,})" \/>/;


module.exports = exports = {
    BASE64,
    BINARY,
    UPPER_CASE,
    LOWER_CASE,
    DIGIT,
    WINDOWS_PATH_REGX,
    IMAGE_REGX
};
