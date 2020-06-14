import Html from "@zykj/slate-html-serializer";
import { parseFragment } from "parse5";
import { assign } from "lodash-es";

export const blockTags = {
  div: "div",
  p: "paragraph",
  table: "table",
  tbody: "table-body",
  tr: "table-row",
  td: "table-cell",
  addreess: "address",
  article: "article",
  aside: "aside",
  audio: "audio",
  blockquote: "blockquote",
  canvas: "canvas",
  dd: "dd",
  dl: "dl",
  fieldset: "fieldset",
  figcaption: "figcaption",
  figure: "figure",
  footer: "footer",
  form: "form",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  header: "header",
  hgroup: "hgroup",
  hr: "hr",
  noscript: "noscript",
  ol: "ol",
  output: "ouput",
  pre: "pre",
  section: "section",
  tfoot: "tfoot",
  ul: "ul",
  video: "video",
};

export const inlineTags = {
  span: "span",
  ruby: "ruby",
  rt: "rt",
  rp: "rp",
  tt: "tt",
  abbr: "abbr",
  acronym: "acronym",
  cite: "cite",
  code: "code",
  dfn: "dfn",
  kbd: "kbd",
  samp: "samp",
  var: "var",
  a: "a",
  bdo: "bdo",
  img: "img",
  map: "map",
  object: "object",
  q: "q",
  script: "script",
  button: "button",
  input: "input",
  label: "label",
  select: "select",
  textarea: "textarea",
};

export const markTags = {
  b: "bold",
  bold: "bold",
  sub: "sub",
  sup: "sup",
  u: "u",
  i: "italic",
  em: "italic",
};

export const getAttr = (attrs: any, attrName: any) => {
  if (!attrs) {
    return null;
  }
  const a = attrs.find((attr: any) => {
    return attr.name === attrName;
  });
  if (a) {
    if (a.value === Number(a.value)) {
      return Number(a.value);
    }
    return a.value;
  }
  return null;
};

function getStyleFromString(str: string) {
  const style: any = {};
  if (str) {
    const temp = str
      .split(";")
      .filter((item: any) => item)
      .map((item: string) => {
        const a = item.split(":");
        // vertical-align   -> verticalAlign
        if (a[0].indexOf("-")) {
          const t = a[0].split("-");
          for (let i = 1; i < t.length; i++) {
            t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
          }
          a[0] = t.join("");
        }
        return {
          key: a[0],
          value: a[1],
        };
      });
    temp.forEach((item: any) => {
      style[item.key] = item.value;
    });
  }
  return style;
}

const rules = [
  {
    deserialize(el: any, next: any): any {
      // 块级标签
      const blockType = blockTags[el.tagName.toLowerCase()];
      if (blockType) {
        switch (blockType) {
          case "table":
            return {
              object: "block",
              type: blockType,
              nodes: next(
                el.childNodes.filter(
                  (childNode: any) =>
                    childNode.nodeName === "tbody" ||
                    childNode.nodeName === "tr"
                )
              ),
              data: {
                width: getAttr(el.attrs, "width"),
                border: getAttr(el.attrs, "border"),
                cellSpacing: getAttr(el.attrs, "cellspacing"),
                cellPadding: getAttr(el.attrs, "cellpadding"),
                style: getStyleFromString(getAttr(el.attrs, "style")),
                className: getAttr(el.attrs, "class"),
              },
            };
          case "table-body":
            return {
              object: "block",
              type: blockType,
              nodes: next(
                el.childNodes.filter(
                  (childNode: any) => childNode.nodeName === "tr"
                )
              ),
              data: {
                width: getAttr(el.attrs, "width"),
                border: getAttr(el.attrs, "border"),
                rowSpan: getAttr(el.attrs, "rowspan"),
                colSpan: getAttr(el.attrs, "colspan"),
                style: getStyleFromString(getAttr(el.attrs, "style")),
              },
            };
          case "table-row":
            return {
              object: "block",
              type: blockType,
              nodes: next(
                el.childNodes.filter(
                  (childNode: any) => childNode.nodeName === "td"
                )
              ),
              data: {
                style: getStyleFromString(getAttr(el.attrs, "style")),
              },
            };
          case "table-cell":
            return {
              object: "block",
              type: blockType,
              nodes: next(
                el.childNodes.filter((childNode: any) => {
                  if (
                    childNode.nodeName === "#text" &&
                    childNode.value.trim().length === 0
                  ) {
                    return false;
                  }
                  return true;
                })
              ),
              data: {
                width: getAttr(el.attrs, "width"),
                border: getAttr(el.attrs, "border"),
                rowSpan: getAttr(el.attrs, "rowspan"),
                colSpan: getAttr(el.attrs, "colspan"),
                style: getStyleFromString(getAttr(el.attrs, "style")),
                className: getAttr(el.attrs, "class"),
              },
            };
          default: {
            const attrs: any = {};
            el.attrs.forEach((attr: any) => {
              attrs[attr.name] = attr.value;
            });
            const tempStyle = getAttr(el.attrs, "style");
            const uuid = getAttr(el.attrs, "uuid");
            const content = getAttr(el.attrs, "content");
            const props = getAttr(el.attrs, "props");
            const style = getStyleFromString(tempStyle);
            const dataType = getAttr(el.attrs, "data-type");
            const className = getAttr(el.attrs, "class");
            const qstType = getAttr(el.attrs, "qst-type");
            delete attrs.style;
            delete attrs.class;
            const data = assign({}, attrs, {
              style,
              className,
              uuid,
              content,
              props,
              "qst-type": qstType,
            });
            return {
              object: "block",
              type: dataType || blockType,
              nodes: next(el.childNodes),
              data,
            };
          }
        }
      }
    },
  },
  {
    deserialize(el: any, next: any): any {
      if (el.tagName.toLowerCase() === "img") {
        const tempStyle = getAttr(el.attrs, "style");
        const isformula = getAttr(el.attrs, "data-isformula");
        const maxHeight = getAttr(el.attrs, "data-max-height");
        const height = getAttr(el.attrs, "height");

        let style = getStyleFromString(tempStyle);
        if (!style) {
          style = {};
        }
        style.display = "inline-block";
        if (maxHeight) {
          style.height = `${maxHeight}px`;
        } else if (!maxHeight && height) {
          style.height = `${height}px`;
        }
        const data: any = {
          src: getAttr(el.attrs, "src"),
          style,
        };
        if (isformula === "true") {
          data["data-isformula"] = true;
        }
        if (maxHeight) {
          data["data-max-height"] = Number(maxHeight);
        } else if (!maxHeight && height) {
          data["data-max-height"] = Number(height);
        }

        return {
          object: "inline",
          type: "image",
          isVoid: true,
          nodes: next(el.childNodes),
          data,
        };
      }
    },
  },
  {
    deserialize(el: any, next: any): any {
      // 行内标签
      const inlineType = inlineTags[el.tagName.toLowerCase()];
      if (inlineType) {
        let inlineNode: any = {
          object: "inline",
          type: inlineType,
          nodes: next(el.childNodes),
          data: {},
        };
        const dataType = getAttr(el.attrs, "data-type");
        const dataLabel = getAttr(el.attrs, "data-label");
        const tempStyle = getAttr(el.attrs, "style");
        const className = getAttr(el.attrs, "class");
        let markType = null;
        if (className && className.indexOf("dot") > -1) {
          markType = "dot";
        }
        let style = getStyleFromString(tempStyle);
        if (!style) {
          style = {};
        }
        inlineNode.data.style = style;
        if (className) {
          inlineNode.data.className = className;
        }

        // 着重号、下划线等
        if (markType) {
          inlineNode = {
            object: "mark",
            type: markType,
            nodes: next(el.childNodes),
          };
        }
        return inlineNode;
      }
    },
  },
  {
    deserialize(el: any): any {
      if (el.nodeName && el.nodeName === "#text") {
        if (el.value) {
          if (el.parentNode.nodeName === "u") {
            return {
              object: "text",
              leaves: [
                {
                  text: el.value,
                },
              ],
            };
          }
          if (el.value.trim().length > 0) {
            return {
              object: "text",
              leaves: [
                {
                  text: el.value,
                },
              ],
            };
          }
          if (el.value.length >= 3 && el.value.trim().length === 0) {
            return {
              object: "text",
              leaves: [
                {
                  text: el.value,
                },
              ],
            };
          }
          return null;
        }
        return null;
      }
    },
  },
  {
    deserialize(el: any, next: any): any {
      const markType = markTags[el.tagName.toLowerCase()];
      if (markType) {
        return {
          object: "mark",
          type: markType,
          nodes: next(el.childNodes),
        };
      }
    },
  },
];

const htmlConvertor = new Html({
  rules,
  parseHtml: parseFragment,
});

export default htmlConvertor;
