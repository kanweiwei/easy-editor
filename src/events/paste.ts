import { Block, Change } from "@zykj/slate";
import { getEventTransfer } from "@zykj/slate-react";
import { get, isEmpty } from "lodash-es";
import { parseFragment, serialize } from "parse5";
import hexToBase64 from "../utils/hexToBase64";
// eslint-disable-next-line import/extensions
import filterWord from "../utils/filterWord.js";
import getBlobByDataURI from "../utils/getBlobByDataURI";
import getAttr from "../utils/getAttr";
import getStyleFromString from "../utils/getStyleFromString";

export default async (
  e: any,
  change: Change,
  editor: any,
  options?: any,
  beforeUpload?: (
    file: File | Blob | Buffer | ArrayBuffer,
    dataURI: string
  ) => string | Promise<string>
) => {
  const maxImageHeight = get(options, "maxImageHeight");
  const maxImageWidth = get(options, "maxImageWidth");
  // const onlyText = get(options, "onlyText");
  const imgStyle: any = {};
  if (maxImageHeight) {
    imgStyle.maxHeight = maxImageHeight;
  }
  if (maxImageWidth) {
    imgStyle.maxWidth = maxImageWidth;
  }
  const transfer = getEventTransfer(e.nativeEvent);

  if (!transfer) {
    return change;
  }
  switch (transfer.type) {
    case "files": {
      const file: File = transfer.files[0];
      if (file && file.type.includes("image")) {
        let url = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = () => {
            reject(new Error("error"));
          };
          reader.readAsDataURL(file);
        });
        if (typeof url === "string") {
          if (beforeUpload) {
            url = await beforeUpload(file, url);
          }
          change = change.insertInline({
            object: "inline",
            type: "image",
            isVoid: true,
            data: {
              style: imgStyle,
              src: url,
            },
          });
          editor.onChange(change);
        }
      }
      return false;
    }
    case "html":
      {
        let html: string = filterWord(transfer.html);
        let reg = /<(?=span|font|\/span|\/font).*?>/g;
        html = html.replace(reg, "");
        html = html.replace(/[．|．]/g, ".");

        if (/file:[\s\S]*.\.(png|jpg|jpeg)/.test(html)) {
          // 有本地图片
          const localeImgs = [];
          // 支持的 rft 内的图片文件类型
          const supportFileTypes = [
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
          const supportRtfTypes = supportFileTypes.map((n: any) => n.rtfType);
          reg = new RegExp(
            `(${supportRtfTypes.join("|")})[^}]*}([^}]*)}`,
            "gim"
          );
          const result = transfer.rich.match(reg);

          if (result && result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              const m = result[i].replace(/\s/gm, "");
              reg = new RegExp(
                `(${supportRtfTypes.join("|")})[^}]*}([^}]*)}`,
                "i"
              );
              const [, type, hexData] = m.match(reg);
              // let imgType = "jpg";
              let fileType = "image/jpg";
              const typeIndex = supportFileTypes.findIndex(
                (n: any) => n.rtfType === type
              );
              if (typeIndex > -1) {
                // imgType = supportFileTypes[typeIndex].imgType;
                fileType = supportFileTypes[typeIndex].fileType;
              }
              const base64Data = hexToBase64(hexData);
              const dataURI = `data:${fileType};base64,${base64Data}`;

              let url = dataURI;
              if (beforeUpload) {
                url = await beforeUpload(
                  getBlobByDataURI(dataURI, fileType),
                  dataURI
                );
              }

              localeImgs.push(url);
            }
          }
          const rootDom: any = parseFragment(html);
          const getInvalidImgs = (nodes: any[], arr: any[]) => {
            nodes.forEach((node: any) => {
              if (node.childNodes && node.childNodes.length > 0) {
                getInvalidImgs(node.childNodes, arr);
              }
              if (node.nodeName.toLowerCase() === "img") {
                const src = getAttr(node.attrs, "src");
                if (/file:[\s\S]*.\.(png|jpg|jpeg)/.test(src)) {
                  arr.push(node);
                }
              }
            });
          };
          const invalidImgs: any[] = [];
          getInvalidImgs(rootDom.childNodes, invalidImgs);
          if (invalidImgs.length > 0) {
            for (let y = 0; y < invalidImgs.length; y++) {
              const foundIndex = invalidImgs[y].attrs.findIndex(
                (n: any) => n.name === "src"
              );
              if (foundIndex > -1 && localeImgs[y]) {
                invalidImgs[y].attrs[foundIndex].value = localeImgs[y];
              }
            }
          }
          html = serialize(rootDom);
          const body = window.document.createElement("body");
          body.innerHTML = html;
          if (body.innerText.trim().length === 0 && invalidImgs.length > 0) {
            invalidImgs.forEach((n: any) => {
              const width = getAttr(n.attrs, "width");
              const height = getAttr(n.attrs, "height");
              let style = "";
              if (width) {
                style += `width: ${Number(width) ? `${width}px` : width};`;
              }
              if (height) {
                style += `height: ${Number(height) ? `${height}px` : height};`;
              }
              const data: any = {};
              data.src = getAttr(n.attrs, "src");
              if (style) {
                data.style = getStyleFromString(style);
              }
              if (!isEmpty(imgStyle)) {
                const maxWidth = (width / height) * maxImageHeight;
                data.style = {
                  ...data.style,
                  ...imgStyle,
                  maxWidth,
                };
              }
              change.insertInline({
                object: "inline",
                type: "image",
                isVoid: true,
                data,
              });
            });
            return editor.onChange(change);
          }
          change = change.insertFragment(
            editor.convertor.deserialize(html).document
          );
          return editor.onChange(change);
        }

        const document: any = editor.convertor.deserialize(html).document;
        const blocks: any = change.value.blocks;
        const firstBlock: Block = blocks.first();

        if (
          (firstBlock as any).text.length > 0 ||
          firstBlock.findDescendant((n: any) => n.type === "image")
        ) {
          change = change.insertBlock(
            Block.fromJSON({
              type: "div",
              object: "block",
              nodes: [],
            })
          );
        }
        change = change.insertFragment(document);
        // return false;
      }
      break;
    case "fragment":
    case "node":
    case "rich":
    case "text":
      if (transfer.text) {
        try {
          change = change.insertText(transfer.text);
        } catch (err) {
          console.error(err.message);
        }
      }
      // return false;
      break;
    default:
      if (transfer.text) {
        try {
          change = change.insertText(transfer.text);
        } catch (err) {
          console.error(err.message);
        }
      }
    // return false;
  }
  e.preventDefault();
  if (transfer.type !== "files") {
    editor.onChange(change);
  }
  return false;
  // this.postMessage(this.filterHtml(transfer.html));
};
