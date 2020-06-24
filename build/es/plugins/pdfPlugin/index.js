import _extends from "@babel/runtime-corejs3/helpers/extends";
import * as React from "react";
import getAttr from "../../utils/getAttr";
import "./style.css";

function PdfWrapper(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "easy-editor-upload pdf-wrapper"
  }, /*#__PURE__*/React.createElement("i", {
    className: "easy-editor-icon ic_pdf"
  }), /*#__PURE__*/React.createElement("div", {
    className: "easy-editor-upload__name"
  }, /*#__PURE__*/React.createElement("a", {
    href: props.url
  }, props.name)));
}

var pdfPlugin = {
  type: "node",
  nodeType: "pdf",
  object: "block",
  schema: {
    isVoid: true
  },
  importer: function importer(el, next) {
    if (getAttr(el.attrs, "data-type") === "pdf") {
      var url = getAttr(el.attrs, "data-url");
      var name_1 = getAttr(el.attrs, "data-name");
      return {
        object: "block",
        type: "pdf",
        isVoid: true,
        nodes: next(el.childNodes),
        data: {
          url: url,
          name: name_1
        }
      };
    }
  },
  exporter: function exporter(node, children) {
    var url = node.data.get("url");
    return /*#__PURE__*/React.createElement("div", {
      "data-type": "pdf",
      "data-url": url
    }, children);
  },
  render: function render(editor, props) {
    var url = props.node.data.get("url");
    var name = props.node.data.get("name");
    return /*#__PURE__*/React.createElement("div", _extends({}, props.attributes, {
      "data-url": url
    }), /*#__PURE__*/React.createElement(PdfWrapper, {
      url: url,
      name: name
    }));
  }
};
export default pdfPlugin;