import * as React from "react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import "./style.css";

var EditorTooltip = function EditorTooltip(props) {
  var _a = props.placeholder,
      placeholder = _a === void 0 ? "" : _a;
  return /*#__PURE__*/React.createElement(Tooltip, {
    overlayClassName: "easy-editor__tooltip",
    placement: "bottom",
    overlay: placeholder
  }, props.children);
};

export default EditorTooltip;