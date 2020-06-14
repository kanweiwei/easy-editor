import { __assign, __awaiter, __generator } from "tslib";
import { Block } from "@zykj/slate";
import { getEventTransfer } from "@zykj/slate-react";
import { message } from "antd";
import { get, isEmpty } from "lodash-es";
import { parseFragment, serialize } from "parse5";
import hexToBase64 from "../utils/hexToBase64";
import htmlConvertor, { getAttr } from "../htmlConvertor";
import { getStyleFromString } from "../htmlSerialize";
// eslint-disable-next-line import/extensions
import filterWord from "../utils/filterWord.js";
function findDom(e, change, name) {
    var selection = change.value.selection;
    var anchor = selection.anchor;
    var anchors = change.value.document
        .getAncestors(anchor.key)
        .concat(change.value.blocks);
    if (anchors.some(function (a) { return a.type === name; })) {
        return true;
    }
    return false;
}
export default (function (e, change, self, options) { return __awaiter(void 0, void 0, void 0, function () {
    var maxImageHeight, maxImageWidth, onlyText, imgStyle, transfer, _a, file_1, url, html, reg, localeImgs, supportFileTypes, supportRtfTypes, result, ossConfig, client, _loop_1, i, rootDom, getInvalidImgs_1, invalidImgs, y, foundIndex, body, document, blocks, firstBlock;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                maxImageHeight = get(options, "maxImageHeight");
                maxImageWidth = get(options, "maxImageWidth");
                onlyText = get(options, "onlyText");
                imgStyle = {};
                if (maxImageHeight) {
                    imgStyle.maxHeight = maxImageHeight;
                }
                if (maxImageWidth) {
                    imgStyle.maxWidth = maxImageWidth;
                }
                transfer = getEventTransfer(e.nativeEvent);
                if (!transfer) {
                    return [2 /*return*/, change];
                }
                _a = transfer.type;
                switch (_a) {
                    case "files": return [3 /*break*/, 1];
                    case "html": return [3 /*break*/, 4];
                    case "fragment": return [3 /*break*/, 7];
                    case "node": return [3 /*break*/, 7];
                    case "rich": return [3 /*break*/, 7];
                    case "text": return [3 /*break*/, 7];
                }
                return [3 /*break*/, 8];
            case 1:
                file_1 = transfer.files[0];
                if (!(file_1 && file_1.type.includes("image"))) return [3 /*break*/, 3];
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function () {
                            resolve(reader.result);
                        };
                        reader.onerror = function (err) {
                            reject(err);
                        };
                        reader.readAsDataURL(file_1);
                    })];
            case 2:
                url = _b.sent();
                if (typeof url === "string") {
                    // TODO
                    // const url = await uploadFile(path, file)
                    change = change.insertInline({
                        object: "inline",
                        type: "image",
                        isVoid: true,
                        data: {
                            style: imgStyle,
                            src: url,
                        },
                    });
                    self.onChange(change);
                }
                _b.label = 3;
            case 3: return [2 /*return*/, false];
            case 4:
                html = filterWord(transfer.html);
                reg = /<(?=span|font|\/span|\/font).*?>/g;
                html = html.replace(reg, "");
                html = html.replace(/[．|．]/g, ".");
                if (!/file:[\s\S]*.\.(png|jpg|jpeg)/.test(html)) return [3 /*break*/, 6];
                localeImgs = [];
                supportFileTypes = [
                    {
                        rtfType: "pngblip",
                        imgType: "png",
                        fileType: "image/png",
                    },
                    {
                        rtfType: "jpegblip",
                        imgType: "jpg",
                        fileType: "image/jpg",
                    },
                    {
                        rtfType: "jpgblip",
                        imgType: "jpg",
                        fileType: "image/jpg",
                    },
                ];
                supportRtfTypes = supportFileTypes.map(function (n) { return n.rtfType; });
                reg = new RegExp("(" + supportRtfTypes.join("|") + ")[^}]*}([^}]*)}", "gim");
                result = transfer.rich.match(reg);
                return [4 /*yield*/, OssHelper.getOssConfig()];
            case 5:
                ossConfig = _b.sent();
                client = ossClientCreator(ossConfig);
                if (result && result.length > 0) {
                    _loop_1 = function (i) {
                        var m = result[i].replace(/\s/gm, "");
                        reg = new RegExp("(" + supportRtfTypes.join("|") + ")[^}]*}([^}]*)}", "i");
                        // @ts-ignore
                        var _a = m.match(reg), str = _a[0], type = _a[1], hexData = _a[2];
                        var imgType = "jpg";
                        var fileType = "image/jpg";
                        var typeIndex = supportFileTypes.findIndex(function (n) { return n.rtfType === type; });
                        if (typeIndex > -1) {
                            imgType = supportFileTypes[typeIndex].imgType;
                            fileType = supportFileTypes[typeIndex].fileType;
                        }
                        var base64Data = hexToBase64(hexData);
                        var dataURI = "data:" + fileType + ";base64," + base64Data;
                        var url = "";
                        // TODO
                        // const url = await uploadFile(path, getBlobByDataURI(dataURI, fileType))
                        localeImgs.push(url);
                    };
                    for (i = 0; i < result.length; i++) {
                        _loop_1(i);
                    }
                }
                rootDom = parseFragment(html);
                getInvalidImgs_1 = function (nodes, arr) {
                    nodes.forEach(function (node) {
                        if (node.childNodes && node.childNodes.length > 0) {
                            getInvalidImgs_1(node.childNodes, arr);
                        }
                        if (node.nodeName.toLowerCase() === "img") {
                            var src = getAttr(node.attrs, "src");
                            if (/file:[\s\S]*.\.(png|jpg|jpeg)/.test(src)) {
                                arr.push(node);
                            }
                        }
                    });
                };
                invalidImgs = [];
                getInvalidImgs_1(rootDom.childNodes, invalidImgs);
                if (invalidImgs.length > 0) {
                    for (y = 0; y < invalidImgs.length; y++) {
                        foundIndex = invalidImgs[y].attrs.findIndex(function (n) { return n.name === "src"; });
                        if (foundIndex > -1 && localeImgs[y]) {
                            invalidImgs[y].attrs[foundIndex].value = localeImgs[y];
                        }
                    }
                }
                html = serialize(rootDom);
                body = window.document.createElement("body");
                body.innerHTML = html;
                if (body.innerText.trim().length === 0 && invalidImgs.length > 0) {
                    invalidImgs.forEach(function (n) {
                        var width = getAttr(n.attrs, "width");
                        var height = getAttr(n.attrs, "height");
                        var style = "";
                        if (width) {
                            style += "width: " + (Number(width) ? width + "px" : width) + ";";
                        }
                        if (height) {
                            style += "height: " + (Number(height) ? height + "px" : height) + ";";
                        }
                        var data = {};
                        data.src = getAttr(n.attrs, "src");
                        if (style) {
                            data.style = getStyleFromString(style);
                        }
                        if (!isEmpty(imgStyle)) {
                            var maxWidth = (width / height) * maxImageHeight;
                            data.style = __assign(__assign(__assign({}, data.style), imgStyle), { maxWidth: maxWidth });
                        }
                        change.insertInline({
                            object: "inline",
                            type: "image",
                            isVoid: true,
                            data: data,
                        });
                    });
                    return [2 /*return*/, self.onChange(change)];
                }
                change = change.insertFragment(htmlConvertor.deserialize(html).document);
                return [2 /*return*/, self.onChange(change)];
            case 6:
                document = htmlConvertor.deserialize(html).document;
                blocks = change.value.blocks;
                firstBlock = blocks.first();
                if (firstBlock.text.length > 0 ||
                    firstBlock.findDescendant(function (n) { return n.type === "image"; })) {
                    change = change.insertBlock(Block.fromJSON({
                        type: "div",
                        object: "block",
                        nodes: [],
                    }));
                }
                change = change.insertFragment(document);
                return [3 /*break*/, 9];
            case 7:
                if (transfer.text) {
                    try {
                        change = change.insertText(transfer.text);
                    }
                    catch (err) {
                        message.error(err.message);
                    }
                }
                // return false;
                return [3 /*break*/, 9];
            case 8:
                if (transfer.text) {
                    try {
                        change = change.insertText(transfer.text);
                    }
                    catch (err) {
                        message.error(err.message);
                    }
                }
                _b.label = 9;
            case 9:
                e.preventDefault();
                if (transfer.type !== "files") {
                    self.onChange(change);
                }
                return [2 /*return*/, false];
        }
    });
}); });