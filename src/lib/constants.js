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
const EXTRACTS_COLOR_REGX = /#\[([0-9a-fA-F]{6})\]\{([\S\s]+?)\}/;
const EXTRACTS_AT_ITEMS_REGX = /@\[(image|icon|table|anchor)\]\{(\S+?)\}/;

const HTTP = "http", HTTPS = "https";
const MK_POINT = ".", MK_DASH = "-", MK_SLASH = "/", MK_COLON = ":";
const BLANK = "", SPACE = " ";
const HTML_BR = "<br />";


module.exports = exports = {
    BASE64,
    BINARY,
    UPPER_CASE,
    LOWER_CASE,
    DIGIT,
    WINDOWS_PATH_REGX,
    HTML_IMAGE_REGX,
    EXTRACTS_COLOR_REGX,
    EXTRACTS_AT_ITEMS_REGX,
    HTTP,
    HTTPS,
    MIME_TEXT_CSS,
    MIME_TEXT_HTML,
    QUOTED_PRINTABLE,
    AT_MHTML_BLINK,
    MK_DASH,
    MK_POINT,
    MK_SLASH,
    MK_COLON,
    BLANK,
    SPACE,
    HTML_BR
};
