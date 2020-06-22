import * as React from "react";
/**
 * marks
 */

function BoldMark(props) {
  return /*#__PURE__*/React.createElement("strong", null, props.children);
}

function SubMark(props) {
  return /*#__PURE__*/React.createElement("sub", null, props.children);
}

function SupMark(props) {
  return /*#__PURE__*/React.createElement("sup", null, props.children);
}

function UMark(props) {
  // return <span className="underline" style={{textDecoration: "underline"}}>{props.children}</span>
  return /*#__PURE__*/React.createElement("u", null, props.children);
}

function ItalicMark(props) {
  return /*#__PURE__*/React.createElement("i", null, props.children);
}

export default (function (props) {
  switch (props.mark.type) {
    case "bold":
      return /*#__PURE__*/React.createElement(BoldMark, props);

    case "sub":
      return /*#__PURE__*/React.createElement(SubMark, props);

    case "sup":
      return /*#__PURE__*/React.createElement(SupMark, props);

    case "u":
      return /*#__PURE__*/React.createElement(UMark, props);

    case "italic":
      return /*#__PURE__*/React.createElement(ItalicMark, props);

    case "dot":
      return /*#__PURE__*/React.createElement("span", {
        className: "dot"
      }, props.children);

    default:
      return null;
  }
});