import _extends from "@babel/runtime-corejs3/helpers/extends";
import * as React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import getAttr from "../../utils/getAttr";
import "./style.css";

var UAParser = require("ua-parser-js");

pdfjs.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjs.version + "/pdf.worker.js";

function PdfViewer(props) {
  var _a = React.useState(0),
      numPages = _a[0],
      setNumPages = _a[1];

  var _b = React.useState(1),
      pageNumber = _b[0],
      setPageNumber = _b[1];

  function onDocumentLoadSuccess(_a) {
    var numPages = _a.numPages;
    setNumPages(numPages);
    setPageNumber(1);
  }

  var preCls = "pdf-viewer-wrapper";
  return /*#__PURE__*/React.createElement("div", {
    className: preCls,
    style: {
      position: "fixed",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: preCls + "__header"
  }, /*#__PURE__*/React.createElement("span", null, "Page ", pageNumber, " of ", numPages), /*#__PURE__*/React.createElement("button", {
    className: "prev-btn",
    disabled: pageNumber === 1,
    onMouseDown: function onMouseDown() {
      return setPageNumber(pageNumber - 1);
    }
  }, "\u4E0A\u4E00\u9875"), /*#__PURE__*/React.createElement("button", {
    className: "prev-btn",
    disabled: pageNumber === numPages,
    onMouseDown: function onMouseDown() {
      return setPageNumber(pageNumber + 1);
    }
  }, "\u4E0B\u4E00\u9875"), /*#__PURE__*/React.createElement("div", {
    className: "close-btn",
    onMouseDown: props.onClose
  })), /*#__PURE__*/React.createElement(Document, {
    file: props.url,
    onLoadSuccess: onDocumentLoadSuccess
  }, /*#__PURE__*/React.createElement(Page, {
    pageNumber: pageNumber
  })));
}

function PdfWrapper(props) {
  var preCls = "easy-editor-upload";

  var _a = React.useState(false),
      visible = _a[0],
      setVisbile = _a[1];

  var handleRemove = function handleRemove() {
    if (props.onRemove) {
      props.onRemove(props.url);
    }
  };

  var _b = React.useState(),
      parserResult = _b[0],
      setParserResult = _b[1];

  React.useEffect(function () {
    var parser = new UAParser();
    setParserResult(parser.getResult());
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: preCls + " pdf-wrapper"
  }, /*#__PURE__*/React.createElement("i", {
    className: "easy-editor-icon ic_pdf"
  }), /*#__PURE__*/React.createElement("div", {
    className: preCls + "__name"
  }, /*#__PURE__*/React.createElement("a", null, props.name)), /*#__PURE__*/React.createElement("div", {
    className: preCls + "__clean",
    onMouseDown: handleRemove
  }), /*#__PURE__*/React.createElement("div", {
    className: preCls + "__see",
    style: {
      marginRight: 8,
      float: "right"
    },
    onMouseDown: function onMouseDown() {
      var _a;

      return parserResult && ((_a = parserResult === null || parserResult === void 0 ? void 0 : parserResult.os) === null || _a === void 0 ? void 0 : _a.name) === "Android" ? setVisbile(true) : window.open(props.url);
    }
  }), visible && /*#__PURE__*/React.createElement(PdfViewer, {
    url: props.url,
    key: "pdf-viewer",
    onClose: function onClose() {
      return setVisbile(false);
    }
  }));
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
      "data-url": encodeURIComponent(url)
    }, children);
  },
  render: function render(editor, props) {
    var url = props.node.data.get("url");
    var name = props.node.data.get("name");

    var handleRemove = function handleRemove(url) {
      var change = editor.state.value.change();
      change.removeNodeByKey(props.node.key);
      editor.onChange(change);
    };

    return /*#__PURE__*/React.createElement("div", _extends({}, props.attributes, {
      "data-url": url
    }), /*#__PURE__*/React.createElement(PdfWrapper, {
      url: url,
      name: name,
      onRemove: handleRemove
    }));
  }
};
export default pdfPlugin;