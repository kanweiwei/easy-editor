/* eslint-disable prefer-const */
import * as React from "react";
import Html from "@zykj/slate-html-serializer";
import { parseFragment } from "parse5";
import tableSerialize from "./plugins/tablePlugin/serialize.rules";

export function getStyleFromData(node: any) {
  const style: any = {};
  if (!node.get("data")) {
    return style;
  }
  const tempStyle: any = node.get("data").get("style");
  if (tempStyle) {
    const keys: string[] = Object.keys(tempStyle);
    keys.forEach((key: string) => {
      let tempKey: string = key;
      if (tempKey.indexOf("-")) {
        const t = tempKey.split("-");
        for (let i = 1; i < t.length; i++) {
          t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
        }
        tempKey = t.join("");
      }
      style[tempKey] = tempStyle[key];
    });
  }
  return style;
}

export function getStyleFromString(str: string) {
  const style = {};
  if (str) {
    const temp = str
      .split(";")
      .filter((item) => item)
      .map((item) => {
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
    temp.forEach((item) => {
      style[item.key] = item.value;
    });
  }
  return style;
}

let rules = [
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
          case "object": {
            return (
              <object {...otherAttrs} style={style} className={className}>
                {children}
              </object>
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
          default:
            break;
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

rules.push(tableSerialize as any);

class HtmlSerialize {
  public _converter: Html;

  public rules = rules;

  public converter() {
    if (this._converter) {
      return this._converter;
    }
    this._converter = new Html({
      rules: this.rules,
      parseHtml: parseFragment,
    });
    return this._converter;
  }
}

export default HtmlSerialize;
