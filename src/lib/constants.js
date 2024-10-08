const BASE64 = "base64";
const BINARY = "binary";
const UPPER_CASE = "ABCDEFGHIJKLIMOPQRSTUVWXYZ";
const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "1234567890";

const MIME_TEXT_CSS = "text/css";
const QUOTED_PRINTABLE = "quoted-printable";

const WINDOWS_PATH_REGX = /^[a-zA-Z]:/;
const IMAGE_REGX = /<img id="#p(\d)+" src="(\S{1,})" \/>/;

const HTTP = "http", HTTPS = "https", STYLE = "style";
const W3_ORG_URL = "http://www.w3.org/1999/xhtml";

const MK_POINT = ".", MK_DASH = "-", MK_SLASH = "/", BLANK = "";


module.exports = exports = {
    BASE64,
    BINARY,
    UPPER_CASE,
    LOWER_CASE,
    DIGIT,
    WINDOWS_PATH_REGX,
    IMAGE_REGX,
    HTTP,
    HTTPS,
    STYLE,
    MIME_TEXT_CSS,
    QUOTED_PRINTABLE,
    W3_ORG_URL,
    MK_DASH,
    MK_POINT,
    MK_SLASH,
    BLANK
};
