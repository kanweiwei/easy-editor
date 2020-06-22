import _setTimeout from "@babel/runtime-corejs3/core-js-stable/set-timeout";
import _indexOfInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/index-of";
import _extends from "@babel/runtime-corejs3/helpers/extends";
import { __assign, __extends, __rest } from "tslib";
import { assign, debounce } from "lodash-es";
import * as React from "react";
import { findDOMNode } from "react-dom";
import ContextMenu from "./hoverMenu/contextMenu";
import getStyleFromData from "./utils/getStyleFromData";
import { PlyrComponent } from "plyr-react";
import getExt from "./utils/getExt";
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

export default (function (self, props) {
  var attributes = props.attributes,
      children = props.children,
      node = props.node,
      isSelected = props.isSelected;

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

    case "image":
      {
        var src = node.data.get("src");
        var isformula = node.data.get("data-isformula");
        var maxHeight_1 = node.data.get("data-max-height");
        var onload_1;

        if (isformula) {
          onload_1 = function onload_1(e) {
            e.target.style.display = "inline-block";

            if (maxHeight_1) {
              e.target.style.height = maxHeight_1 + "px";
            }

            var change = self.state.value.change();

            var data = __assign(__assign({}, node.data.toJS()), {
              src: node.data.get("src"),
              style: __assign(__assign({}, node.data.toJS().style), {
                display: "inline-block"
              })
            });

            if (maxHeight_1) {
              data.style.height = maxHeight_1 + "px";
            }

            change = change.setNodeByKey(node.key, {
              data: data
            });
            self.onChange(change);
          };
        }

        var className = isSelected ? "active" : null;
        var style = {
          display: "inline-block"
        };

        if (node.data.get("style")) {
          style = _extends(style, node.data.get("style"));
        }

        var image_1;

        var handleClickImg = function handleClickImg(e) {
          e.preventDefault();
          e.persist();

          if (self.props.readOnly) {
            return;
          }

          var nodeKey = e.target.dataset.key;
          image_1 = document.querySelector("img[data-key='" + node.key + "']");

          if (nodeKey) {
            var change = self.state.value.change();
            var targetNode = change.value.document.findDescendant(function (item) {
              return item.key === nodeKey;
            });

            if (!targetNode) {
              return;
            }

            change = change.moveToRangeOfNode(targetNode);
            self.onChange(change);
          }

          _setTimeout(function () {
            var menu = document.querySelector("#context-menu"); // todo 菜单显示位置

            if (menu && image_1) {
              menu.style.opacity = 1;
              menu.style.top = e.clientY + document.documentElement.scrollTop + "px";
              var left = e.clientX + document.documentElement.scrollLeft + 20;

              if (left <= 0) {
                left = 60;
              }

              menu.style.left = left + "px";
            }
          }, 0);
        };

        var setFloatRight = function setFloatRight(e) {
          e.preventDefault();
          var change = self.state.value.change();
          change = change.setNodeByKey(node.key, {
            data: {
              src: node.data.get("src"),
              style: __assign(__assign({}, node.data.toJS().style), {
                float: "right"
              })
            }
          });
          change = change.deselect().blur();
          self.onChange(change, "move-img");
          var menu = document.querySelector("#context-menu");
          menu.style.opacity = 0;
        };

        var setNoFloat = function setNoFloat(e) {
          e.preventDefault();
          var change = self.state.value.change();

          var _a = node.data.toJS().style,
              _float2 = _a.float,
              otherAttrs = __rest(_a, ["float"]);

          change = change.setNodeByKey(node.key, {
            data: {
              src: node.data.get("src"),
              style: __assign(__assign({}, otherAttrs), {
                display: "inline-block"
              })
            }
          });
          change = change.deselect().blur();
          self.onChange(change, "move-img");
          var menu = document.querySelector("#context-menu");
          menu.style.opacity = 0;
        };

        var changeImg = function changeImg(width, height) {
          var change = self.state.value.change();
          change = change.setNodeByKey(node.key, {
            data: {
              src: node.data.get("src"),
              style: __assign(__assign({}, node.data.toJS().style), {
                display: "inline-block",
                width: width + "px",
                height: height + "px"
              })
            }
          }); // change = Value.fromJSON(change.value.toJSON()).change();

          self.onChange(change, "qst");
        }; // @ts-ignore


        var imgForm = void 0;
        return /*#__PURE__*/React.createElement("span", {
          contentEditable: false
        }, /*#__PURE__*/React.createElement(ContextMenu, props, /*#__PURE__*/React.createElement("div", {
          onMouseDown: setFloatRight
        }, "\u9760\u53F3\u73AF\u7ED5"), /*#__PURE__*/React.createElement("div", {
          onMouseDown: setNoFloat
        }, "\u6E05\u9664\u73AF\u7ED5")), /*#__PURE__*/React.createElement(ResizeBox, _extends({
          isSelected: isSelected
        }, {
          style: style
        }, {
          onChange: changeImg
        }), /*#__PURE__*/React.createElement("img", _extends({
          onContextMenu: handleClickImg,
          src: src,
          className: className
        }, {
          style: style
        }, attributes, {
          onLoad: onload_1,
          alt: ""
        }))));
      }

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
        return /*#__PURE__*/React.createElement("div", _extends({}, attributes, otherAttrs), /*#__PURE__*/React.createElement(PlyrComponent, {
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