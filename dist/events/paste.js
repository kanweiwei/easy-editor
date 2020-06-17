import { __assign, __awaiter, __generator } from "tslib";
import { Block } from "@zykj/slate";
import { getEventTransfer } from "@zykj/slate-react";
import { get, isEmpty } from "lodash-es";
import { parseFragment, serialize } from "parse5";
import hexToBase64 from "../utils/hexToBase64";
import htmlConvertor, { getAttr } from "../htmlConvertor";
import { getStyleFromString } from "../htmlSerialize";
// eslint-disable-next-line import/extensions
import filterWord from "../utils/filterWord.js";
import getBlobByDataURI from "../utils/getBlobByDataURI";
export default (function (e, change, self, options, beforeUpload) { return __awaiter(void 0, void 0, void 0, function () {
    var maxImageHeight, maxImageWidth, imgStyle, transfer, _a, file_1, url, html, reg, localeImgs, supportFileTypes, supportRtfTypes, result, _loop_1, i, rootDom, getInvalidImgs_1, invalidImgs, y, foundIndex, body, document_1, blocks, firstBlock;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                maxImageHeight = get(options, "maxImageHeight");
                maxImageWidth = get(options, "maxImageWidth");
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
                    case "html": return [3 /*break*/, 6];
                    case "fragment": return [3 /*break*/, 12];
                    case "node": return [3 /*break*/, 12];
                    case "rich": return [3 /*break*/, 12];
                    case "text": return [3 /*break*/, 12];
                }
                return [3 /*break*/, 13];
            case 1:
                file_1 = transfer.files[0];
                if (!(file_1 && file_1.type.includes("image"))) return [3 /*break*/, 5];
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function () {
                            resolve(reader.result);
                        };
                        reader.onerror = function () {
                            reject(new Error("error"));
                        };
                        reader.readAsDataURL(file_1);
                    })];
            case 2:
                url = _b.sent();
                if (!(typeof url === "string")) return [3 /*break*/, 5];
                if (!beforeUpload) return [3 /*break*/, 4];
                return [4 /*yield*/, beforeUpload(file_1, url)];
            case 3:
                url = _b.sent();
                _b.label = 4;
            case 4:
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
                _b.label = 5;
            case 5: return [2 /*return*/, false];
            case 6:
                html = filterWord(transfer.html);
                reg = /<(?=span|font|\/span|\/font).*?>/g;
                html = html.replace(reg, "");
                html = html.replace(/[．|．]/g, ".");
                if (!/file:[\s\S]*.\.(png|jpg|jpeg)/.test(html)) return [3 /*break*/, 11];
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
                if (!(result && result.length > 0)) return [3 /*break*/, 10];
                _loop_1 = function (i) {
                    var m, _a, str, type, hexData, fileType, typeIndex, base64Data, dataURI, url;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                m = result[i].replace(/\s/gm, "");
                                reg = new RegExp("(" + supportRtfTypes.join("|") + ")[^}]*}([^}]*)}", "i");
                                _a = m.match(reg), str = _a[0], type = _a[1], hexData = _a[2];
                                fileType = "image/jpg";
                                typeIndex = supportFileTypes.findIndex(function (n) { return n.rtfType === type; });
                                if (typeIndex > -1) {
                                    // imgType = supportFileTypes[typeIndex].imgType;
                                    fileType = supportFileTypes[typeIndex].fileType;
                                }
                                base64Data = hexToBase64(hexData);
                                dataURI = "data:" + fileType + ";base64," + base64Data;
                                url = dataURI;
                                if (!beforeUpload) return [3 /*break*/, 2];
                                return [4 /*yield*/, beforeUpload(getBlobByDataURI(dataURI, fileType), dataURI)];
                            case 1:
                                url = _b.sent();
                                _b.label = 2;
                            case 2:
                                localeImgs.push(url);
                                return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _b.label = 7;
            case 7:
                if (!(i < result.length)) return [3 /*break*/, 10];
                return [5 /*yield**/, _loop_1(i)];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                i++;
                return [3 /*break*/, 7];
            case 10:
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
            case 11:
                document_1 = htmlConvertor.deserialize(html).document;
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
                change = change.insertFragment(document_1);
                return [3 /*break*/, 14];
            case 12:
                if (transfer.text) {
                    try {
                        change = change.insertText(transfer.text);
                    }
                    catch (err) {
                        console.error(err.message);
                    }
                }
                // return false;
                return [3 /*break*/, 14];
            case 13:
                if (transfer.text) {
                    try {
                        change = change.insertText(transfer.text);
                    }
                    catch (err) {
                        console.error(err.message);
                    }
                }
                _b.label = 14;
            case 14:
                e.preventDefault();
                if (transfer.type !== "files") {
                    self.onChange(change);
                }
                return [2 /*return*/, false];
        }
    });
}); });
