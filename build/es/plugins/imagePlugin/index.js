import _setTimeout from "@babel/runtime-corejs3/core-js-stable/set-timeout";
import _extends from "@babel/runtime-corejs3/helpers/extends";
import { __assign, __rest } from "tslib";
import * as React from "react";
import getAttr from "../../utils/getAttr";
import getStyleFromString from "../../utils/getStyleFromString";
import ContextMenu from "../../hoverMenu/contextMenu";
import ResizeBox from "./ResizeBox";
var imagePlugin = {
  type: "node",
  nodeType: "image",
  object: "inline",
  schema: {
    isVoid: true
  },
  importer: function importer(el, next) {
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
  },
  exporter: function exporter(node, children) {
    var _a = node.data.toJS(),
        style = _a.style,
        otherAttrs = __rest(_a, ["style"]);

    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\u200B"), /*#__PURE__*/React.createElement("img", _extends({}, otherAttrs, {
      style: style,
      alt: ""
    })), /*#__PURE__*/React.createElement("span", null, "\u200B"));
  },
  render: function render(editor, props) {
    var node = props.node,
        isSelected = props.isSelected,
        attributes = props.attributes;
    var src = node.data.get("src");
    var isformula = node.data.get("data-isformula");
    var maxHeight = node.data.get("data-max-height");
    var onload;

    if (isformula) {
      onload = function onload(e) {
        e.target.style.display = "inline-block";

        if (maxHeight) {
          e.target.style.height = maxHeight + "px";
        }

        var change = editor.state.value.change();

        var data = __assign(__assign({}, node.data.toJS()), {
          src: node.data.get("src"),
          style: __assign(__assign({}, node.data.toJS().style), {
            display: "inline-block"
          })
        });

        if (maxHeight) {
          data.style.height = maxHeight + "px";
        }

        change = change.setNodeByKey(node.key, {
          data: data
        });
        editor.onChange(change);
      };
    }

    var className = isSelected ? "active" : null;
    var style = {
      display: "inline-block"
    };

    if (node.data.get("style")) {
      style = _extends(style, node.data.get("style"));
    }

    var image;

    var handleClickImg = function handleClickImg(e) {
      e.preventDefault();
      e.persist();

      if (editor.props.readOnly) {
        return;
      }

      var nodeKey = e.target.dataset.key;
      image = document.querySelector("img[data-key='" + node.key + "']");

      if (nodeKey) {
        var change = editor.state.value.change();
        var targetNode = change.value.document.findDescendant(function (item) {
          return item.key === nodeKey;
        });

        if (!targetNode) {
          return;
        }

        change = change.moveToRangeOfNode(targetNode);
        editor.onChange(change);
      }

      _setTimeout(function () {
        var menu = document.querySelector("#context-menu"); // todo 菜单显示位置

        if (menu && image) {
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
      var change = editor.state.value.change();
      change = change.setNodeByKey(node.key, {
        data: {
          src: node.data.get("src"),
          style: __assign(__assign({}, node.data.toJS().style), {
            float: "right"
          })
        }
      });
      change = change.deselect().blur();
      editor.onChange(change, "move-img");
      var menu = document.querySelector("#context-menu");
      menu.style.opacity = 0;
    };

    var setNoFloat = function setNoFloat(e) {
      e.preventDefault();
      var change = editor.state.value.change();

      var _a = node.data.toJS().style,
          _float = _a.float,
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
      editor.onChange(change, "move-img");
      var menu = document.querySelector("#context-menu");
      menu.style.opacity = 0;
    };

    var changeImg = function changeImg(width, height) {
      var change = editor.state.value.change();
      change = change.setNodeByKey(node.key, {
        data: {
          src: node.data.get("src"),
          style: __assign(__assign({}, node.data.toJS().style), {
            display: "inline-block",
            width: width + "px",
            height: height + "px"
          })
        }
      });
      editor.onChange(change, "qst");
    }; // @ts-ignore


    var imgForm;
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
      onLoad: onload,
      alt: ""
    }))));
  }
};
export default imagePlugin;