import _extends from "@babel/runtime-corejs3/helpers/extends";
import _filterInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/filter";
import { __rest } from "tslib";
import render from "./render";
import * as React from "react";
import getAttr from "../../utils/getAttr";
import getStyleFromString from "../../utils/getStyleFromString";
import getStyleFromData from "../../utils/getStyleFromData";
var tablePlugin = {
  type: "node",
  object: "block",
  nodeType: "table",
  importer: function importer(el, next) {
    if (el.tagName.toLowerCase() === "table") {
      var _context;

      return {
        object: "block",
        type: "table",
        nodes: next(_filterInstanceProperty(_context = el.childNodes).call(_context, function (childNode) {
          return childNode.nodeName === "tbody" || childNode.nodeName === "tr";
        })),
        data: {
          width: getAttr(el.attrs, "width"),
          border: getAttr(el.attrs, "border"),
          cellSpacing: getAttr(el.attrs, "cellspacing"),
          cellPadding: getAttr(el.attrs, "cellpadding"),
          style: getStyleFromString(getAttr(el.attrs, "style")),
          className: getAttr(el.attrs, "class")
        }
      };
    }
  },
  exporter: function exporter(node, children) {
    var _a = node.data.toJS(),
        style = _a.style,
        className = _a.className,
        otherAttrs = __rest(_a, ["style", "className"]);

    style = getStyleFromData(node);
    return /*#__PURE__*/React.createElement("table", _extends({}, otherAttrs, {
      style: style,
      className: className
    }), children);
  },
  render: render
};
export default tablePlugin;