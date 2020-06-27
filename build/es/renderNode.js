import _extends from "@babel/runtime-corejs3/helpers/extends";
import { __rest } from "tslib";
import { assign } from "lodash-es";
import { PlyrComponent } from "plyr-react";
import * as React from "react";
import getExt from "./utils/getExt";
import getStyleFromData from "./utils/getStyleFromData";
/**
 * nodes
 */

function ParagraphNode(props) {
  return /*#__PURE__*/React.createElement("p", _extends({}, props.attributes, {
    style: props.style,
    className: props.className
  }), props.children);
}

function SpanNode(props) {
  var _a = props.node.data.toJS(),
      style = _a.style,
      className = _a.className,
      otherAttrs = __rest(_a, ["style", "className"]);

  style = getStyleFromData(props.node);
  return /*#__PURE__*/React.createElement("span", _extends({}, props.attributes, otherAttrs, {
    style: style,
    className: className
  }), props.children);
}
/**
 * placeholder
 */


export function renderPlaceholder(text, tips, _a) {
  var style = (_a === void 0 ? {} : _a).style;

  if (!text || text.length === 1 && text.charCodeAt(0) === 8203) {
    style = assign({}, style);
    return /*#__PURE__*/React.createElement("div", {
      className: "description_placeholder",
      style: style
    }, tips);
  }

  return null;
}
export default (function (self, props) {
  var attributes = props.attributes,
      children = props.children,
      node = props.node;

  switch (node.type) {
    case "div":
      {
        var _a = node.data.toJS(),
            style = _a.style,
            className = _a.className,
            otherAttrs = __rest(_a, ["style", "className"]);

        style = getStyleFromData(node);
        return /*#__PURE__*/React.createElement("div", _extends({}, props.attributes, otherAttrs, {
          style: style,
          className: className
        }), children);
      }

    case "paragraph":
      {
        var style = getStyleFromData(node);
        var className = node.data.toJS().className;
        return /*#__PURE__*/React.createElement(ParagraphNode, _extends({}, props, {
          style: style,
          className: className
        }));
      }

    case "span":
      return /*#__PURE__*/React.createElement(SpanNode, props);

    case "ruby":
      {
        return /*#__PURE__*/React.createElement("ruby", props.attributes, props.children);
      }

    case "rp":
      return /*#__PURE__*/React.createElement("rp", null, props.children);

    case "rt":
      return /*#__PURE__*/React.createElement("rt", null, props.children);

    case "table-body":
      {
        var _b = node.data.toJS(),
            style = _b.style,
            className = _b.className,
            otherAttrs = __rest(_b, ["style", "className"]);

        style = getStyleFromData(node);
        return /*#__PURE__*/React.createElement("tbody", _extends({}, attributes, otherAttrs, {
          style: style,
          className: className
        }), children);
      }

    case "table-row":
      {
        var _c = node.data.toJS(),
            style = _c.style,
            className = _c.className,
            otherAttrs = __rest(_c, ["style", "className"]);

        style = getStyleFromData(node);
        return /*#__PURE__*/React.createElement("tr", _extends({}, attributes, otherAttrs, {
          style: style,
          className: className
        }), children);
      }

    case "table-cell":
      {
        var _d = node.data.toJS(),
            style = _d.style,
            className = _d.className,
            otherAttrs = __rest(_d, ["style", "className"]);

        style = getStyleFromData(node);
        return /*#__PURE__*/React.createElement("td", _extends({}, attributes, otherAttrs, {
          style: style,
          className: className
        }), children);
      }

    case "embed":
      {
        var _e = node.data.toJS(),
            style = _e.style,
            className = _e.className,
            otherAttrs = __rest(_e, ["style", "className"]);

        var src = node.data.get("src");
        var ext = getExt(src);
        return /*#__PURE__*/React.createElement("div", _extends({}, attributes, otherAttrs), /*#__PURE__*/React.createElement(PlyrComponent, {
          sources: {
            type: "video",
            sources: [{
              src: src,
              type: "video/" + ext
            }]
          }
        }));
      }

    case "object":
      {
        var _f = node.data.toJS(),
            style = _f.style,
            className = _f.className,
            otherAttrs = __rest(_f, ["style", "className"]);

        var data = node.data.get("data");
        var ext = getExt(data);
        return /*#__PURE__*/React.createElement("div", _extends({}, attributes, otherAttrs, {
          className: "easy-editor__video-wrapper"
        }), /*#__PURE__*/React.createElement(PlyrComponent, {
          sources: {
            type: "video",
            sources: [{
              src: data,
              type: "video/" + ext
            }]
          }
        }));
      }

    default:
      return null;
  }
});