import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _someInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/some";
import { __assign, __extends } from "tslib";
import classnames from "classnames";
import { omit } from "lodash-es";
import * as React from "react";
import ImageExtension from "./extensions/image";
import "./style.css";
import VideoExtension from "./extensions/video";
import EditorTooltip from "./tooltip";
var defaultControls = {
  bold: {
    object: "mark",
    type: "bold",
    placeholder: "加粗",
    component: /*#__PURE__*/React.createElement("i", {
      className: "tool-icon ic-jiacu"
    })
  },
  italic: {
    object: "mark",
    type: "italic",
    placeholder: "斜体",
    component: /*#__PURE__*/React.createElement("i", {
      className: "tool-icon ic-xieti"
    })
  },
  u: {
    object: "mark",
    type: "u",
    placeholder: "下划线",
    component: /*#__PURE__*/React.createElement("i", {
      className: "tool-icon ic-xiahuaxian"
    })
  },
  sup: {
    object: "mark",
    type: "sup",
    placeholder: "上标",
    component: /*#__PURE__*/React.createElement("i", {
      className: "tool-icon ic-sup"
    })
  },
  sub: {
    object: "mark",
    type: "sub",
    placeholder: "下标",
    component: /*#__PURE__*/React.createElement("i", {
      className: "tool-icon ic-sub"
    })
  },
  left: {
    object: "align",
    type: "align",
    placeholder: "居左",
    component: /*#__PURE__*/React.createElement("i", {
      className: "tool-icon ic-align-left"
    })
  },
  center: {
    object: "align",
    type: "center",
    placeholder: "居中",
    component: /*#__PURE__*/React.createElement("i", {
      className: "tool-icon ic-align-center"
    })
  },
  right: {
    object: "align",
    type: "right",
    placeholder: "居右",
    component: /*#__PURE__*/React.createElement("i", {
      className: "tool-icon ic-align-right"
    })
  },
  justify: {
    object: "align",
    type: "justify",
    placeholder: "两端对齐",
    component: /*#__PURE__*/React.createElement("i", {
      className: "tool-icon ic-align-between"
    })
  },
  image: {
    type: "image",
    placeholder: "插入图片",
    component: function component(change, update, beforeUpload) {
      return /*#__PURE__*/React.createElement(ImageExtension, {
        change: change,
        update: update,
        beforeUpload: beforeUpload
      });
    }
  },
  video: {
    type: "video",
    placeholder: "插入音频",
    component: function component(change, update, beforeUpload) {
      return /*#__PURE__*/React.createElement(VideoExtension, {
        change: change,
        update: update,
        beforeUpload: beforeUpload
      });
    }
  }
};

var ToolBar =
/** @class */
function (_super) {
  __extends(ToolBar, _super);

  function ToolBar() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.onClickMark = function (event, type) {
      var _a = _this.props,
          value = _a.value,
          onChange = _a.onChange;
      event.preventDefault();
      var change = value.change().toggleMark(type);
      onChange(change);
    };

    _this.renderComponent = function (component) {
      if ("$$typeof" in component) {
        return component;
      }

      if (typeof component === "function") {
        return component();
      }

      return null;
    };

    _this.renderMarkBtn = function (item) {
      var type = item.type,
          component = item.component,
          placeholder = item.placeholder;

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
      return /*#__PURE__*/React.createElement("span", {
        key: item.type
      }, /*#__PURE__*/React.createElement(EditorTooltip, {
        placeholder: placeholder
      }, /*#__PURE__*/React.createElement("span", {
        className: btnClass,
        title: placeholder,
        onMouseDown: onMouseDown
      }, _this.renderComponent(component))));
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

      return /*#__PURE__*/React.createElement("span", {
        onMouseDown: onMouseDown,
        title: title
      }, /*#__PURE__*/React.createElement("img", {
        src: icon,
        alt: ""
      }));
    };

    _this.setAlign = function (e, align) {
      e.preventDefault();

      if (align == "justify") {
        return _this.setAlignJustify(e);
      }

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

    _this.setAlignJustify = function (e) {
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

    _this.renderAlign = function (control) {
      var _context;

      var type = control.type,
          component = control.component,
          placeholder = control.placeholder;

      var isActive = _someInstanceProperty(_context = _this.props.value.blocks).call(_context, function (block) {
        var _a;

        return ((_a = block.data.get("style")) === null || _a === void 0 ? void 0 : _a["textAlign"]) === type;
      });

      var cls = classnames("tool-btn", {
        isActive: isActive
      });
      return /*#__PURE__*/React.createElement("span", {
        key: type
      }, /*#__PURE__*/React.createElement(EditorTooltip, {
        placeholder: placeholder
      }, /*#__PURE__*/React.createElement("span", {
        className: cls,
        onMouseDown: function onMouseDown(e) {
          return _this.setAlign(e, type);
        },
        title: placeholder
      }, _this.renderComponent(component))));
    };

    _this.renderControls = function () {
      var _a = _this.props.controls,
          controls = _a === void 0 ? [["bold", "italic", "u", "sup", "sub"], ["left", "center", "right", "justify"], ["image", "video"]] : _a;
      return _mapInstanceProperty(controls).call(controls, function (toolGroup) {
        return _mapInstanceProperty(toolGroup).call(toolGroup, function (tool) {
          if (typeof tool === "string") {
            if (tool in defaultControls) {
              var t = defaultControls[tool];

              switch (t.object) {
                case "mark":
                  return _this.renderMarkBtn(t);

                case "align":
                  return _this.renderAlign(t);

                default:
                  {
                    if ("component" in t && typeof t.component === "function") {
                      return /*#__PURE__*/React.createElement("span", {
                        key: t.type
                      }, /*#__PURE__*/React.createElement(EditorTooltip, {
                        placeholder: t.placeholder
                      }, /*#__PURE__*/React.createElement("span", {
                        className: "tool-btn"
                      }, t.component(_this.props.value.change(), _this.props.onChange, _this.props.beforeUpload))));
                    }

                    return null;
                  }
              }
            }
          } else {
            // custom tool
            if ("component" in tool && typeof tool.component === "function") {
              return /*#__PURE__*/React.createElement("span", {
                key: tool.type,
                title: tool.placeholder || ""
              }, /*#__PURE__*/React.createElement(EditorTooltip, {
                placeholder: tool.placeholder
              }, /*#__PURE__*/React.createElement("span", {
                className: "tool-btn"
              }, tool.component(_this.props.value.change(), _this.props.onChange, _this.props.beforeUpload))));
            }
          }

          return null;
        });
      });
    };

    return _this;
  }

  ToolBar.prototype.hasMark = function (type) {
    var _context2;

    return _someInstanceProperty(_context2 = this.props.value.activeMarks).call(_context2, function (mark) {
      return mark.type === type;
    });
  };

  ToolBar.prototype.render = function () {
    var className = this.props.className;
    var rootClass = classnames("easy-editor__toolbar", className);
    return /*#__PURE__*/React.createElement("div", {
      className: rootClass
    }, /*#__PURE__*/React.createElement("div", {
      className: "tools"
    }, this.renderControls()));
  };

  return ToolBar;
}(React.Component);

export default ToolBar;