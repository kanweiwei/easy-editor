import _extends from "@babel/runtime-corejs3/helpers/extends";
import _indexOfInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/index-of";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _trimInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/trim";
import _filterInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/filter";
import { __assign, __rest } from "tslib";
/* eslint-disable prefer-const */

import * as React from "react";
import Html from "@zykj/slate-html-serializer";
import { parseFragment } from "parse5";
import getStyleFromString from "./utils/getStyleFromString";
import getAttr from "./utils/getAttr";
import getStyleFromData from "./utils/getStyleFromData";
export var blockTags = {
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
  object: "object"
};
export var inlineTags = {
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
  textarea: "textarea"
};
export var markTags = {
  b: "bold",
  bold: "bold",
  sub: "sub",
  sup: "sup",
  u: "u",
  i: "italic",
  em: "italic"
};
var rules = [{
  deserialize: function deserialize(el, next) {
    var _context, _context2, _context3;

    // 块级标签
    var blockType = blockTags[el.tagName.toLowerCase()];

    if (blockType) {
      switch (blockType) {
        case "table-body":
          return {
            object: "block",
            type: blockType,
            nodes: next(_filterInstanceProperty(_context = el.childNodes).call(_context, function (childNode) {
              return childNode.nodeName === "tr";
            })),
            data: {
              width: getAttr(el.attrs, "width"),
              border: getAttr(el.attrs, "border"),
              rowSpan: getAttr(el.attrs, "rowspan"),
              colSpan: getAttr(el.attrs, "colspan"),
              style: getStyleFromString(getAttr(el.attrs, "style"))
            }
          };

        case "table-row":
          return {
            object: "block",
            type: blockType,
            nodes: next(_filterInstanceProperty(_context2 = el.childNodes).call(_context2, function (childNode) {
              return childNode.nodeName === "td";
            })),
            data: {
              style: getStyleFromString(getAttr(el.attrs, "style"))
            }
          };

        case "table-cell":
          return {
            object: "block",
            type: blockType,
            nodes: next(_filterInstanceProperty(_context3 = el.childNodes).call(_context3, function (childNode) {
              var _context4;

              if (childNode.nodeName === "#text" && _trimInstanceProperty(_context4 = childNode.value).call(_context4).length === 0) {
                return false;
              }

              return true;
            })),
            data: {
              width: getAttr(el.attrs, "width"),
              border: getAttr(el.attrs, "border"),
              rowSpan: getAttr(el.attrs, "rowspan"),
              colSpan: getAttr(el.attrs, "colspan"),
              style: getStyleFromString(getAttr(el.attrs, "style")),
              className: getAttr(el.attrs, "class")
            }
          };

        case "object":
          {
            return {
              object: "block",
              type: "object",
              isVoid: true,
              nodes: next(el.childNodes),
              data: {
                data: getAttr(el.attrs, "data")
              }
            };
          }

        default:
          {
            var _context5;

            var attrs_1 = {};

            _forEachInstanceProperty(_context5 = el.attrs).call(_context5, function (attr) {
              attrs_1[attr.name] = attr.value;
            });

            var tempStyle = getAttr(el.attrs, "style");
            var uuid = getAttr(el.attrs, "uuid");
            var content = getAttr(el.attrs, "content");
            var props = getAttr(el.attrs, "props");
            var style = getStyleFromString(tempStyle);
            var dataType = getAttr(el.attrs, "data-type");
            var className = getAttr(el.attrs, "class");
            delete attrs_1.style;
            delete attrs_1.class;

            var data = __assign(__assign({}, attrs_1), {
              style: style,
              className: className,
              uuid: uuid,
              content: content,
              props: props,
              data: getAttr(el.attrs, "data")
            });

            return {
              object: "block",
              type: dataType || blockType,
              nodes: next(el.childNodes),
              data: data
            };
          }
      }
    }
  }
}, {
  deserialize: function deserialize(el, next) {
    if (el.tagName.toLowerCase() === "img") {
      var tempStyle = getAttr(el.attrs, "style");
      var isformula = getAttr(el.attrs, "data-isformula");
      var maxHeight = getAttr(el.attrs, "data-max-height");
      var height = getAttr(el.attrs, "height");
      var style = getStyleFromString(tempStyle);

      if (!style) {
        style = {};
      }

      style.display = "inline-block";

      if (maxHeight) {
        style.height = maxHeight + "px";
      } else if (!maxHeight && height) {
        style.height = height + "px";
      }

      var data = {
        src: getAttr(el.attrs, "src"),
        style: style
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
        data: data
      };
    }
  }
}, {
  deserialize: function deserialize(el, next) {
    // 行内标签
    var inlineType = inlineTags[el.tagName.toLowerCase()];

    if (inlineType) {
      var inlineNode = {
        object: "inline",
        type: inlineType,
        nodes: next(el.childNodes),
        data: {}
      };
      var tempStyle = getAttr(el.attrs, "style");
      var className = getAttr(el.attrs, "class");
      var markType = null;

      if (className && _indexOfInstanceProperty(className).call(className, "dot") > -1) {
        markType = "dot";
      }

      var style = getStyleFromString(tempStyle);

      if (!style) {
        style = {};
      }

      inlineNode.data.style = style;

      if (className) {
        inlineNode.data.className = className;
      } // 着重号、下划线等


      if (markType) {
        inlineNode = {
          object: "mark",
          type: markType,
          nodes: next(el.childNodes)
        };
      }

      return inlineNode;
    }
  }
}, {
  deserialize: function deserialize(el) {
    if (el.nodeName && el.nodeName === "#text") {
      if (el.value) {
        var _context6, _context7;

        if (el.parentNode.nodeName === "u") {
          return {
            object: "text",
            leaves: [{
              text: el.value
            }]
          };
        }

        if (_trimInstanceProperty(_context6 = el.value).call(_context6).length > 0) {
          return {
            object: "text",
            leaves: [{
              text: el.value
            }]
          };
        }

        if (el.value.length >= 3 && _trimInstanceProperty(_context7 = el.value).call(_context7).length === 0) {
          return {
            object: "text",
            leaves: [{
              text: el.value
            }]
          };
        }

        return {
          object: "text",
          leaves: [{
            text: el.value
          }]
        };
      }

      return {
        object: "text",
        leaves: [{
          text: el.value
        }]
      };
    }
  }
}, {
  deserialize: function deserialize(el, next) {
    var markType = markTags[el.tagName.toLowerCase()];

    if (markType) {
      return {
        object: "mark",
        type: markType,
        nodes: next(el.childNodes)
      };
    }
  }
}, {
  serialize: function serialize(obj, children) {
    if (obj.object === "block") {
      var _a = obj.data.toJS(),
          style = _a.style,
          className = _a.className,
          otherAttrs = __rest(_a, ["style", "className"]);

      style = getStyleFromData(obj);

      switch (obj.type) {
        case "div":
          {
            return /*#__PURE__*/React.createElement("div", _extends({
              style: style,
              className: className
            }, otherAttrs), children);
          }

        case "paragraph":
          {
            return /*#__PURE__*/React.createElement("p", {
              style: style,
              className: className
            }, children);
          }

        case "table":
          {
            return /*#__PURE__*/React.createElement("table", _extends({}, otherAttrs, {
              style: style,
              className: className
            }), children);
          }

        case "table-body":
          {
            return /*#__PURE__*/React.createElement("tbody", _extends({}, otherAttrs, {
              style: style,
              className: className
            }), children);
          }

        case "table-row":
          {
            return /*#__PURE__*/React.createElement("tr", _extends({}, otherAttrs, {
              style: style,
              className: className
            }), children);
          }

        case "table-cell":
          {
            return /*#__PURE__*/React.createElement("td", _extends({}, otherAttrs, {
              style: style,
              className: className
            }), children);
          }

        case "embed":
          {
            return /*#__PURE__*/React.createElement("object", _extends({}, otherAttrs, {
              style: style,
              className: className
            }), children);
          }

        case "object":
          {
            return /*#__PURE__*/React.createElement("object", _extends({}, otherAttrs, {
              style: style,
              className: className
            }), children);
          }

        default:
          break;
      }
    }
  }
}, {
  serialize: function serialize(obj, children) {
    if (obj.object === "inline") {
      var _a = obj.data.toJS(),
          style = _a.style,
          otherAttrs = __rest(_a, ["style"]);

      style = getStyleFromData(obj);

      switch (obj.type) {
        case "span":
          return /*#__PURE__*/React.createElement("span", _extends({
            style: style
          }, otherAttrs), children);

        case "ruby":
          {
            return /*#__PURE__*/React.createElement("ruby", {
              style: style
            }, children);
          }

        case "rt":
          return /*#__PURE__*/React.createElement("rt", {
            style: style
          }, children);

        case "rp":
          return /*#__PURE__*/React.createElement("rp", {
            style: style
          }, children);

        case "image":
          {
            return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\u200B"), /*#__PURE__*/React.createElement("img", _extends({}, otherAttrs, {
              style: style,
              alt: ""
            })), /*#__PURE__*/React.createElement("span", null, "\u200B"));
          }

        default:
          break;
      }
    }
  }
}, {
  serialize: function serialize(obj, children) {
    if (obj.object === "mark") {
      switch (obj.type) {
        case "bold":
          return /*#__PURE__*/React.createElement("b", null, children);

        case "italic":
          return /*#__PURE__*/React.createElement("i", null, children);

        case "sub":
          return /*#__PURE__*/React.createElement("sub", null, children);

        case "sup":
          return /*#__PURE__*/React.createElement("sup", null, children);

        case "u":
          return /*#__PURE__*/React.createElement("u", null, children);

        case "dot":
          return /*#__PURE__*/React.createElement("span", {
            className: "dot"
          }, children);

        default:
          return /*#__PURE__*/React.createElement(obj.type, null, children);
      }
    }
  }
}];

var HtmlSerialize =
/** @class */
function () {
  function HtmlSerialize() {
    this.rules = rules;
  }

  HtmlSerialize.prototype.converter = function () {
    return new Html({
      rules: this.rules,
      parseHtml: parseFragment
    });
  };

  return HtmlSerialize;
}();

export default HtmlSerialize;