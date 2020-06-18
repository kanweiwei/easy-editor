import render from "./render";
import { DefaultTreeElement } from "parse5";
import * as React from "react";
import getAttr from "../../utils/getAttr";
import getStyleFromString from "../../utils/getStyleFromString";
import getStyleFromData from "../../utils/getStyleFromData";

const tablePlugin = {
  type: "node",
  object: "block",
  nodeType: "table",
  importer(el: DefaultTreeElement, next: Function): any {
    if (el.tagName.toLowerCase() === "table") {
      return {
        object: "block",
        type: "table",
        nodes: next(
          el.childNodes.filter(
            (childNode: any) =>
              childNode.nodeName === "tbody" || childNode.nodeName === "tr"
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
    }
  },
  exporter(node: any, children: any): any {
    let { style, className, ...otherAttrs } = node.data.toJS();
    style = getStyleFromData(node);
    return (
      <table {...otherAttrs} style={style} className={className}>
        {children}
      </table>
    );
  },
  render: render,
};

export default tablePlugin;
