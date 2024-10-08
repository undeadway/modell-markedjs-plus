const BASE64 = "base64";
const BINARY = "binary";
const UPPER_CASE = "ABCDEFGHIJKLIMOPQRSTUVWXYZ";
const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "1234567890";

const MIME_TEXT_CSS = "text/css", MIME_TEXT_HTML = "text/html";
const QUOTED_PRINTABLE = "quoted-printable";
const AT_MHTML_BLINK = "@mhtml.blink";

const WINDOWS_PATH_REGX = /^[a-zA-Z]:/;
const HTML_IMAGE_REGX = /<img id="#p(\d)+" src="(\S{1,})" \/>/;

const HTTP = "http", HTTPS = "https", STYLE = "style";
const MK_POINT = ".", MK_DASH = "-", MK_SLASH = "/", BLANK = "";


module.exports = exports = {
    BASE64,
    BINARY,
    UPPER_CASE,
    LOWER_CASE,
    DIGIT,
    WINDOWS_PATH_REGX,
    HTML_IMAGE_REGX,
    HTTP,
    HTTPS,
    STYLE,
    MIME_TEXT_CSS,
    MIME_TEXT_HTML,
    QUOTED_PRINTABLE,
    AT_MHTML_BLINK,
    MK_DASH,
    MK_POINT,
    MK_SLASH,
    BLANK
};
