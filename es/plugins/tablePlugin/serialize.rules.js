import _extends from "@babel/runtime-corejs3/helpers/extends";
import { __rest } from "tslib";
/* eslint-disable prefer-const */

import * as React from "react";
import { getStyleFromData } from "../../htmlSerialize";
import TablePlugin from ".";
export default [{
  serialize: function serialize(obj, children) {
    if (obj.object === "block") {
      var _a = obj.data.toJS(),
          style = _a.style,
          className = _a.className,
          otherAttrs = __rest(_a, ["style", "className"]);

      style = getStyleFromData(obj);

      if (obj.type === TablePlugin.nodeType) {
        return /*#__PURE__*/React.createElement("table", _extends({}, otherAttrs, {
          style: style,
          className: className
        }), children);
      }
    }
  }
}];