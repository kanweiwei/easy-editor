/* eslint-disable prefer-const */
import * as React from "react";
import Html from "@zykj/slate-html-serializer";
import { parseFragment } from "parse5";
import getStyleFromString from "./utils/getStyleFromString";
import getAttr from "./utils/getAttr";
import getStyleFromData from "./utils/getStyleFromData";

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
  // audio: "audio",
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
  embed: "embed",
  object: "object",
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

let rules = [
  {
    deserialize(el: any, next: any): any {
      // 块级标签
      const blockType = blockTags[el.tagName.toLowerCase()];
      if (blockType) {
        switch (blockType) {
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
          case "object": {
            return {
              object: "block",
              type: "object",
              isVoid: true,
              nodes: next(el.childNodes),
              data: {
                data: getAttr(el.attrs, "data"),
              },
            };
          }
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
            delete attrs.style;
            delete attrs.class;
            const data = {
              ...attrs,
              style,
              className,
              uuid,
              content,
              props,
              data: getAttr(el.attrs, "data"),
            };
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
          return {
            object: "text",
            leaves: [
              {
                text: el.value,
              },
            ],
          };
        }
        return {
          object: "text",
          leaves: [
            {
              text: el.value,
            },
          ],
        };
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
  {
    serialize(obj: any, children: any): any {
      if (obj.object === "block") {
        let { style, className, ...otherAttrs } = obj.data.toJS();
        style = getStyleFromData(obj);
        switch (obj.type) {
          case "div": {
            return (
              <div style={style} className={className} {...otherAttrs}>
                {children}
              </div>
            );
          }
          case "paragraph": {
            return (
              <p style={style} className={className}>
                {children}
              </p>
            );
          }

          case "table": {
            return (
              <table {...otherAttrs} style={style} className={className}>
                {children}
              </table>
            );
          }
          case "table-body": {
            return (
              <tbody {...otherAttrs} style={style} className={className}>
                {children}
              </tbody>
            );
          }
          case "table-row": {
            return (
              <tr {...otherAttrs} style={style} className={className}>
                {children}
              </tr>
            );
          }
          case "table-cell": {
            return (
              <td {...otherAttrs} style={style} className={className}>
                {children}
              </td>
            );
          }
          case "embed": {
            return (
              <object {...otherAttrs} style={style} className={className}>
                {children}
              </object>
            );
          }
          case "video": {
            return (
              <video {...otherAttrs} style={style} className={className}>
                {children}
              </video>
            );
          }
          case "object": {
            return (
              <object {...otherAttrs} style={style} className={className}>
                {children}
              </object>
            );
          }
          case "h1": {
            return (
              <h1 {...otherAttrs} style={style} className={className}>
                {children}
              </h1>
            );
          }
          case "h2": {
            return (
              <h2 {...otherAttrs} style={style} className={className}>
                {children}
              </h2>
            );
          }
          case "h3": {
            return (
              <h3 {...otherAttrs} style={style} className={className}>
                {children}
              </h3>
            );
          }
          case "h4": {
            return (
              <h4 {...otherAttrs} style={style} className={className}>
                {children}
              </h4>
            );
          }
          case "h5": {
            return (
              <h5 {...otherAttrs} style={style} className={className}>
                {children}
              </h5>
            );
          }
          case "h6": {
            return (
              <h6 {...otherAttrs} style={style} className={className}>
                {children}
              </h6>
            );
          }
          default:
            break;
        }
      }
    },
  },
  {
    serialize(obj: any, children: any): any {
      if (obj.object === "inline") {
        let { style, ...otherAttrs } = obj.data.toJS();
        style = getStyleFromData(obj);
        switch (obj.type) {
          case "span":
            return (
              <span style={style} {...otherAttrs}>
                {children}
              </span>
            );
          case "ruby": {
            return <ruby style={style}>{children}</ruby>;
          }
          case "rt":
            return <rt style={style}>{children}</rt>;
          case "rp":
            return <rp style={style}>{children}</rp>;

          case "image": {
            return (
              <>
                <span>&#8203;</span>
                <img {...otherAttrs} style={style} alt="" />
                <span>&#8203;</span>
              </>
            );
          }
          default: {
            const Tag = inlineTags[obj.type];
            if (Tag) {
              return (
                <Tag {...otherAttrs} style={style}>
                  {children}
                </Tag>
              );
            }
            return (
              <obj.type {...otherAttrs} style={style}>
                {children}
              </obj.type>
            );
          }
        }
      }
    },
  },
  {
    serialize(obj: any, children: any): any {
      if (obj.object === "mark") {
        switch (obj.type) {
          case "bold":
            return <b>{children}</b>;
          case "italic":
            return <i>{children}</i>;
          case "sub":
            return <sub>{children}</sub>;
          case "sup":
            return <sup>{children}</sup>;
          case "u":
            return <u>{children}</u>;
          case "dot":
            return <span className="dot">{children}</span>;
          default:
            return <obj.type>{children}</obj.type>;
        }
      }
    },
  },
];

class HtmlSerialize {
  public rules = rules;

  public converter() {
    return new Html({
      rules: this.rules,
      parseHtml: parseFragment,
    });
  }
}

export default HtmlSerialize;
