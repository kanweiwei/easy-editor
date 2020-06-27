import _extends from "@babel/runtime-corejs3/helpers/extends";
import _indexOfInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/index-of";
import { __extends } from "tslib";
import * as React from "react";
import { debounce } from "lodash-es";
import { findDOMNode } from "react-dom";
import "./style.css";

var ResizeBox =
/** @class */
function (_super) {
  __extends(ResizeBox, _super);

  function ResizeBox() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.debouncedChange = debounce(function (width, height) {
      if (_this.props.onChange) {
        _this.props.onChange(width, height);
      }
    }, 200);

    _this.startResize = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.target = e.target;
      window.addEventListener("mousemove", _this.resizing);
      window.addEventListener("mouseup", _this.endResize);
    };

    _this.endResize = function (e) {
      e.preventDefault();
      window.removeEventListener("mousemove", _this.resizing);
      window.removeEventListener("mouseup", _this.endResize);
    };

    _this.findParentBlockDom = function (child) {
      while (child = child.parentNode) {
        if (child.tagName.toLowerCase() === "div") {
          return child;
        }
      }
    };

    _this.resizing = function (e) {
      var _context, _context2, _context3, _context4;

      var $container = findDOMNode(_this);
      var mouse = {};

      var _a = $container.getBoundingClientRect(),
          width = _a.width,
          height = _a.height,
          left = _a.left;

      var originWidth = width;
      var originHeight = height;
      mouse.x = (e.touches && e.touches[0].clientX || e.clientX || e.pageX) + document.documentElement.scrollLeft;
      mouse.y = (e.touches && e.touches[0].clientY || e.clientY || e.pageY) + document.documentElement.scrollTop;

      if (_indexOfInstanceProperty(_context = _this.target.className).call(_context, "resize-handle-se") > -1) {
        width = mouse.x - left;
        height = width / originWidth * originHeight;
      } else if (_indexOfInstanceProperty(_context2 = _this.target.className).call(_context2, "resize-handle-sw") > -1) {
        width -= mouse.x - left;
        height = width / originWidth * originHeight;
        left = mouse.x;
      } else if (_indexOfInstanceProperty(_context3 = _this.target.className).call(_context3, "resize-handle-nw") > -1) {
        width -= mouse.x - left;
        height = width / originWidth * originHeight;
        left = mouse.x;
        top = mouse.y;
      } else if (_indexOfInstanceProperty(_context4 = _this.target.className).call(_context4, "resize-handle-ne") > -1) {
        width = mouse.x - left;
        height = width / originWidth * originHeight;
        top = mouse.y;
      }

      width = width >= _this.editorDom.offsetWidth ? _this.editorDom.offsetWidth : width;
      $container.style.width = width + "px";
      $container.style.height = height + "px";
      var img = $container.querySelector("img");

      if (img) {
        img.style.width = width + "px";
        img.style.height = height + "px";
      }

      _this.debouncedChange(width, height);
    };

    return _this;
  }

  ResizeBox.prototype.componentDidMount = function () {
    this.editorDom = this.findParentBlockDom(findDOMNode(this));
  };

  ResizeBox.prototype.render = function () {
    var _this = this;

    var _a = this.props,
        children = _a.children,
        isSelected = _a.isSelected,
        style = _a.style;
    var _float = style.float;
    var attrs = {};

    if (_float) {
      attrs.onMouseDown = this.startResize;
    }

    if (isSelected) {
      if (!_float) {
        return /*#__PURE__*/React.createElement("span", _extends({
          className: "resize-container",
          ref: function ref(n) {
            return _this.rootDom = n;
          }
        }, {
          style: style
        }), /*#__PURE__*/React.createElement("span", {
          className: "resize-handle resize-handle-ne active",
          onMouseDown: this.startResize
        }), /*#__PURE__*/React.createElement("span", {
          className: "resize-handle resize-handle-nw"
        }), children, /*#__PURE__*/React.createElement("span", {
          className: "resize-handle resize-handle-se active",
          onMouseDown: this.startResize
        }), /*#__PURE__*/React.createElement("span", {
          className: "resize-handle resize-handle-sw"
        }));
      }

      return /*#__PURE__*/React.createElement("span", _extends({
        className: "resize-container",
        ref: function ref(n) {
          return _this.rootDom = n;
        }
      }, {
        style: style
      }), /*#__PURE__*/React.createElement("span", {
        className: "resize-handle resize-handle-ne"
      }), /*#__PURE__*/React.createElement("span", {
        className: "resize-handle resize-handle-nw active",
        onMouseDown: this.startResize
      }), children, /*#__PURE__*/React.createElement("span", {
        className: "resize-handle resize-handle-se"
      }), /*#__PURE__*/React.createElement("span", {
        className: "resize-handle resize-handle-sw active",
        onMouseDown: this.startResize
      }));
    }

    return /*#__PURE__*/React.createElement(React.Fragment, null, children);
  };

  return ResizeBox;
}(React.Component);

export default ResizeBox;