import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _someInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/some";
import { __assign, __extends } from "tslib";
import { Value } from "@zykj/slate";
import classnames from "classnames";
import { omit } from "lodash-es";
import * as React from "react";
import ReactDOM from "react-dom";
import "./style.css";

var Menu =
/** @class */
function (_super) {
  __extends(Menu, _super);

  function Menu() {
    var _this = _super !== null && _super.apply(this, arguments) || this; // When a mark button is clicked, toggle the current mark.


    _this.onClickMark = function (event, type) {
      var _a = _this.props,
          value = _a.value,
          onChange = _a.onChange;
      event.preventDefault();
      var change = value.change().toggleMark(type);
      onChange(change);
    };

    _this.onClickBlock = function (event, onClick, options) {
      if (options === void 0) {
        options = {};
      }

      event.preventDefault();
      var _a = _this.props,
          onChange = _a.onChange,
          value = _a.value;
      var change = value.change();

      try {
        if (onClick) {
          change = change.call(onClick(__assign({}, options)));
          change = Value.fromJSON(change.value.toJSON()).change();
          return onChange(change);
        }
      } catch (e) {
        change = change.blur();
        onChange(change);
      }
    }; // Render a mark-toggling toolbar button.


    _this.renderMarkButton = function (type, icon, title) {
      var activeMarks = _this.props.value.activeMarks.toArray();

      var isActive = _someInstanceProperty(activeMarks).call(activeMarks, function (m) {
        return m.type == type;
      });

      var onMouseDown = function onMouseDown(event) {
        return _this.onClickMark(event, type);
      };

      var btnClass = classnames({
        "tool-btn": true,
        isActive: isActive
      });
      return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        className: btnClass,
        title: title,
        onMouseDown: onMouseDown
      }, icon));
    };

    _this.renderIndentButton = function (type, icon, title) {
      var clickIndentButton = function clickIndentButton(e) {
        e.preventDefault();
        var _a = _this.props,
            onChange = _a.onChange,
            value = _a.value;
        var change = value.change();
        var blocks = change.value.blocks;

        _forEachInstanceProperty(blocks).call(blocks, function (block) {
          var originalData = block.get("data");
          var originStyle = originalData.get("style");

          if (!("textIndent" in originStyle)) {
            var data = block.data.set("style", __assign(__assign({}, originStyle), {
              textIndent: "2em"
            }));
            change = change.setNodeByKey(block.key, {
              data: data
            });
          } else {
            var style = omit(originStyle, ["textIndent"]);
            var data = block.data.set("style", style);
            change = change.setNodeByKey(block.key, {
              data: data
            });
          }
        });

        onChange(change);
      };

      var onMouseDown = function onMouseDown(event) {
        return clickIndentButton(event);
      };

      return (
        /*#__PURE__*/
        // eslint-disable-next-line react/jsx-no-bind
        React.createElement("span", {
          onMouseDown: onMouseDown,
          title: title
        }, /*#__PURE__*/React.createElement("img", {
          src: icon,
          alt: ""
        }))
      );
    };

    _this.setAlign = function (e, align) {
      e.preventDefault();
      var _a = _this.props,
          onChange = _a.onChange,
          value = _a.value;
      var change = value.change();
      var blocks = change.value.blocks;

      _forEachInstanceProperty(blocks).call(blocks, function (block) {
        var data = block.get("data");
        var style = data.get("style") || {};

        if ("textAlign" in style && style.textAlign === align) {
          delete style.textAlign;
        } else {
          style.textAlign = align;
          delete style.textAlignLast;
        }

        data = data.set("style", style);
        change = change.setNodeByKey(block.key, {
          data: data
        });
      });

      onChange(change);
    };

    _this.renderAlign = function (align, icon, title) {
      var _context;

      var isActive = _someInstanceProperty(_context = _this.props.value.blocks).call(_context, function (block) {
        var _a;

        return ((_a = block.data.get("style")) === null || _a === void 0 ? void 0 : _a["textAlign"]) === align;
      });

      var cls = classnames("tool-btn", {
        isActive: isActive
      });
      return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        className: cls,
        onMouseDown: function onMouseDown(e) {
          return _this.setAlign(e, align);
        },
        title: title
      }, icon));
    };

    _this.renderAlignJustify = function () {
      var setAlignJustify = function setAlignJustify(e) {
        e.preventDefault();
        var _a = _this.props,
            onChange = _a.onChange,
            value = _a.value;
        var change = value.change();
        var blocks = change.value.blocks;

        _forEachInstanceProperty(blocks).call(blocks, function (block) {
          var data = block.get("data");
          var style = data.get("style") || {};

          if ("textAlign" in style && style.textAlign === "justify") {
            delete style.textAlign;
            delete style.textAlignLast;
          } else {
            style.textAlign = "justify";
            style.textAlignLast = "justify";
          }

          data = data.set("style", style);
          change = change.setNodeByKey(block.key, {
            data: data
          });
        });

        onChange(change);
      };

      return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        className: "tool-btn",
        title: "\u4E24\u7AEF\u5BF9\u9F50",
        onMouseDown: setAlignJustify
      }, /*#__PURE__*/React.createElement("i", {
        className: "tool-icon ic-align-between"
      })));
    };

    _this.renderMarkBtns = function () {
      return /*#__PURE__*/React.createElement(React.Fragment, null, _this.renderMarkButton("bold", /*#__PURE__*/React.createElement("i", {
        className: "tool-icon ic-jiacu"
      }), "加粗"), _this.renderMarkButton("italic", /*#__PURE__*/React.createElement("i", {
        className: "tool-icon ic-xieti"
      }), "斜体"), _this.renderMarkButton("u", /*#__PURE__*/React.createElement("i", {
        className: "tool-icon ic-xiahuaxian"
      }), "下划线"), _this.renderAlign("left", /*#__PURE__*/React.createElement("i", {
        className: "tool-icon ic-align-left"
      }), "居左"), _this.renderAlign("center", /*#__PURE__*/React.createElement("i", {
        className: "tool-icon ic-align-center"
      }), "居中"), _this.renderAlign("right", /*#__PURE__*/React.createElement("i", {
        className: "tool-icon ic-align-right"
      }), "居右"), _this.renderAlignJustify());
    };

    return _this;
  } // Check if the current selection has a mark with `type` in it.


  Menu.prototype.hasMark = function (type) {
    var _context2;

    var value = this.props.value;

    if (!value) {
      return false;
    }

    return _someInstanceProperty(_context2 = value.activeMarks).call(_context2, function (mark) {
      return mark.type === type;
    });
  };

  Menu.prototype.renderBlockButton = function (type, icon, title, onClick) {
    var _this = this;

    var onMouseDown = function onMouseDown(event) {
      return _this.onClickBlock(event, onClick, {
        type: type
      });
    };

    return (
      /*#__PURE__*/
      // eslint-disable-next-line react/jsx-no-bind
      React.createElement("span", {
        onMouseDown: onMouseDown,
        title: title,
        key: type
      }, icon)
    );
  };

  Menu.prototype.render = function () {
    var root = window.document.getElementById("root");
    var _a = this.props,
        menuRef = _a.menuRef,
        className = _a.className;
    var rootClass = classnames("menu hover-menu easy-editor__hover-menu", className, {
      fixed: !menuRef
    });
    var childNode = /*#__PURE__*/React.createElement("div", {
      className: rootClass,
      ref: menuRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "tools"
    }, this.renderMarkBtns()));

    if (menuRef) {
      return /*#__PURE__*/ReactDOM.createPortal(childNode, root);
    }

    return childNode;
  };

  return Menu;
}(React.Component);

export default Menu;