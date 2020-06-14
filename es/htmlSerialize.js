import _extends from "@babel/runtime-corejs3/helpers/extends";
import _filterInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/filter";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _indexOfInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/index-of";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import { __rest } from "tslib";
/* eslint-disable prefer-const */

import * as React from "react";
import Html from "@zykj/slate-html-serializer";
import { parseFragment } from "parse5";
import tableSerialize from "./plugins/tablePlugin/serialize.rules";
export function getStyleFromData(node) {
  var style = {};

  if (!node.get("data")) {
    return style;
  }

  var tempStyle = node.get("data").get("style");

  if (tempStyle) {
    var keys = _Object$keys(tempStyle);

    _forEachInstanceProperty(keys).call(keys, function (key) {
      var tempKey = key;

      if (_indexOfInstanceProperty(tempKey).call(tempKey, "-")) {
        var t = tempKey.split("-");

        for (var i = 1; i < t.length; i++) {
          t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
        }

        tempKey = t.join("");
      }

      style[tempKey] = tempStyle[key];
    });
  }

  return style;
}
export function getStyleFromString(str) {
  var style = {};

  if (str) {
    var _context, _context2;

    var temp = _mapInstanceProperty(_context = _filterInstanceProperty(_context2 = str.split(";")).call(_context2, function (item) {
      return item;
    })).call(_context, function (item) {
      var _context3;

      var a = item.split(":"); // vertical-align   -> verticalAlign

      if (_indexOfInstanceProperty(_context3 = a[0]).call(_context3, "-")) {
        var t = a[0].split("-");

        for (var i = 1; i < t.length; i++) {
          t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
        }

        a[0] = t.join("");
      }

      return {
        key: a[0],
        value: a[1]
      };
    });

    _forEachInstanceProperty(temp).call(temp, function (item) {
      style[item.key] = item.value;
    });
  }

  return style;
}
var rules = [{
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
rules.push(tableSerialize);

var HtmlSerialize =
/** @class */
function () {
  function HtmlSerialize() {
    this.rules = rules;
  }

  HtmlSerialize.prototype.converter = function () {
    if (this._converter) {
      return this._converter;
    }

    this._converter = new Html({
      rules: this.rules,
      parseHtml: parseFragment
    });
    return this._converter;
  };

  return HtmlSerialize;
}();

export default HtmlSerialize;