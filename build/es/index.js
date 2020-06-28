import _findInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/find";
import _filterInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/filter";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _Array$isArray from "@babel/runtime-corejs3/core-js-stable/array/is-array";
import { __assign, __extends, __spreadArrays } from "tslib";
import { Value } from "@zykj/slate";
import { Editor } from "@zykj/slate-react";
import classnames from "classnames";
import { get } from "lodash-es";
import raf from "raf";
import * as React from "react";
import handlePaste from "./events/paste";
import HoverMenu from "./hoverMenu";
import initValue from "./initValue";
import basePlugins from "./plugins";
import renderMark from "./renderMark";
import renderNode from "./renderNode";
import schemas from "./schema";
import "./style.css";
import ToolBar from "./toolbar";
import HtmlSerialize from "./htmlSerialize";

var findRealDoms = function findRealDoms(dom, realDom) {
  if (dom.childNodes && _Array$isArray(dom.childNodes)) {
    if (dom.childNodes.length === 1) {
      return findRealDoms(dom.childNodes[0], realDom);
    }

    if (dom.childNodes.length > 1) {
      realDom = dom;
      return realDom;
    }
  } else {
    realDom = dom;
    return realDom;
  }
}; // 定义编辑器


var EasyEditor =
/** @class */
function (_super) {
  __extends(EasyEditor, _super);

  function EasyEditor(props) {
    var _a;

    var _this = _super.call(this, props) || this;

    _this.isComposing = false;

    _this.onChange = function (change) {
      if (_this.props.onChange) {
        var res = _this.props.onChange({
          change: change
        });

        if (typeof res === "boolean" && !res) {
          return;
        }
      }

      if (_this.rafHandle) {
        raf.cancel(_this.rafHandle);
      }

      if (_this.props.onSaveHtml) {
        _this.props.onSaveHtml(change.value);
      }

      _this.setState({
        value: change.value
      });
    };

    _this.update = function (change) {
      return _this.onChange(change);
    };

    _this.onCompositionStart = function (e, change) {
      _this.isComposing = true;

      if (_this.props.onCompositionStart) {
        var res = _this.props.onCompositionStart(e, change);

        if (typeof res === "boolean" && !res) {
          return res;
        }
      }
    };

    _this.onCompositionEnd = function (e, change) {
      _this.isComposing = false;

      if (_this.props.onCompositionEnd) {
        var res = _this.props.onCompositionEnd(e, change);

        if (typeof res === "boolean" && !res) {
          return res;
        }
      }

      if (_this.props.forbidIME) {
        e.preventDefault();
        var value_1 = Value.fromJSON(change.value.toJSON());
        _this.rafHandle = raf(function () {
          _this.onChange({
            value: value_1
          });
        });
      }
    };

    _this.onBlur = function (e, change) {
      var onBlur = _this.props.onBlur;

      if (onBlur) {
        onBlur(e, change);
      }
    };
    /** 更新悬浮菜单位置 */


    _this.updateMenu = function () {
      var menu = _this.menu;

      if (!menu) {
        return;
      }

      var value = _this.state.value;
      var selection = value.selection;

      if (selection.isBlurred || selection.isCollapsed) {
        menu.removeAttribute("style");
        return;
      }

      var _native = window.getSelection();

      if (!_native) {
        return;
      }

      try {
        var nodeElement = _native.focusNode;

        if (nodeElement) {
          if (nodeElement.nodeName === "#text") {
            nodeElement = nodeElement.parentNode;

            if (!nodeElement) {
              nodeElement = _native.getRangeAt(0);
            }
          }

          var rect = nodeElement.getBoundingClientRect();
          menu.style.opacity = 1;
          menu.style.zIndex = 1000;
          menu.style.top = rect.top + window.pageYOffset - menu.offsetHeight - 20 + "px";
          var left = rect.left + window.pageXOffset - menu.offsetWidth / 2 + rect.width / 2;

          if (left <= 0) {
            left = 60;
          }

          menu.style.left = left + "px";
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    };

    _this.resetByHtml = function (html) {
      var change = _this.convertor.deserialize(html).change();

      _this.update(change);
    };

    _this.getValueByHtml = function (html) {
      var _a;

      var b = document.createElement("body");
      b.innerHTML = html;

      if ((_a = b.textContent) === null || _a === void 0 ? void 0 : _a.length) {
        var htmlValue = _this.convertor.deserialize(html, {
          toJSON: true
        });

        return Value.fromJSON(htmlValue);
      }

      return initValue;
    };

    _this.getHtml = function () {
      return _this.convertor.serialize(_this.state.value);
    };
    /** 编辑器中插入Blocks */


    _this.insertBlocks = function (blocks) {
      var value = _this.state.value;
      var change = value.change().moveToRangeOfDocument().moveToEnd();

      _forEachInstanceProperty(blocks).call(blocks, function (block) {
        change.insertBlock(block);
      });

      _this.onChange(change);
    };
    /** 菜单ref */


    _this.menuRef = function (menu) {
      _this.menu = menu;
    };
    /** 失去焦点 */


    _this.handleBlur = function (e) {
      var value = _this.state.value;
      var onBlur = _this.props.onBlur;

      if (onBlur) {
        onBlur(e, value);
      }
    };

    _this.renderMenu = function (fixed) {
      if (fixed === void 0) {
        fixed = false;
      }

      var _a = _this.props.showMenu,
          showMenu = _a === void 0 ? true : _a;

      if (showMenu) {
        if (fixed) {
          return /*#__PURE__*/React.createElement(HoverMenu, {
            value: _this.state.value,
            onChange: _this.onChange,
            plugins: _this.plugins
          });
        } else {
          return /*#__PURE__*/React.createElement(HoverMenu, {
            menuRef: _this.menuRef,
            value: _this.state.value,
            onChange: _this.onChange,
            plugins: _this.plugins
          });
        }
      }

      return null;
    };

    _this.renderNode = function (props) {
      if (_this.plugins.length) {
        var _context;

        var nodePlugins = _filterInstanceProperty(_context = _this.plugins).call(_context, function (p) {
          return p.type === "node";
        });

        var r = _findInstanceProperty(nodePlugins).call(nodePlugins, function (n) {
          return props.node.type === n.nodeType;
        });

        if (r) {
          return r.render(_this, props);
        }
      }

      return renderNode(_this, props);
    };

    _this.renderEditor = function () {
      var _a;

      var value = _this.state.value;
      var _b = _this.props,
          readOnly = _b.readOnly,
          placeholder = _b.placeholder,
          pasteOptions = _b.pasteOptions,
          _c = _b.minHeight,
          minHeight = _c === void 0 ? 300 : _c;
      return /*#__PURE__*/React.createElement(Editor, {
        placeholder: placeholder,
        value: value,
        onChange: _this.onChange,
        onCompositionStart: _this.onCompositionStart,
        onCompositionEnd: _this.onCompositionEnd,
        onBlur: _this.onBlur,
        onPaste: function onPaste(e, change) {
          return handlePaste(e, change, _this, pasteOptions, _this.props.beforeUpload);
        },
        onContextMenu: function onContextMenu(e) {
          return e.preventDefault();
        },
        renderMark: renderMark,
        renderNode: _this.renderNode,
        onKeyDown: _this.props.onKeyDown,
        plugins: _this.plugins,
        autoFocus: (_a = _this.props.autoFocus) !== null && _a !== void 0 ? _a : true,
        schema: _this.schemas,
        spellCheck: false,
        readOnly: readOnly,
        style: {
          minHeight: minHeight + "px"
        }
      });
    };

    var value = props.value;
    _this.plugins = __spreadArrays(basePlugins, (_a = props === null || props === void 0 ? void 0 : props.plugins) !== null && _a !== void 0 ? _a : []);
    _this.schemas = _this.initSchema(schemas, _this.plugins);
    _this.convertor = _this.initHtmlSerialize(_this.plugins);

    if (typeof props.value === "string") {
      value = _this.getValueByHtml(props.value);
    }

    _this.state = {
      value: value || initValue()
    };
    return _this;
  }

  EasyEditor.prototype.initHtmlSerialize = function (plugins) {
    var convertor = new HtmlSerialize();

    _forEachInstanceProperty(plugins).call(plugins, function (plugin) {
      convertor.rules.unshift({
        serialize: function serialize(node, children) {
          if (node.object === plugin.object && plugin.nodeType === node.type) {
            if (plugin.exporter) {
              return plugin.exporter(node, children);
            }
          }
        },
        deserialize: plugin.importer
      });
    });

    return convertor.converter();
  };

  EasyEditor.prototype.initSchema = function (schema, plugins) {
    if (plugins === void 0) {
      plugins = [];
    }

    var m = {
      inline: "inlines",
      block: "blocks"
    };

    _forEachInstanceProperty(plugins).call(plugins, function (plugin) {
      var _a;

      if (plugin.schema) {
        var k = m[plugin.object];

        if (k) {
          schema[k][plugin.nodeType] = __assign(__assign({}, (_a = schema[k][plugin.nodeType]) !== null && _a !== void 0 ? _a : {}), plugin.schema);
        }
      }
    });

    return schema;
  };

  EasyEditor.prototype.componentDidMount = function () {
    this.updateMenu();
  };

  EasyEditor.prototype.componentDidUpdate = function () {
    if (!this.props.disableMenu) {
      this.updateMenu();
    }
  };

  EasyEditor.prototype.componentWillUnmount = function () {
    if (this.rafHandle) {
      raf.cancel(this.rafHandle);
    }
  };

  EasyEditor.prototype.getState = function (name) {
    return get(this.state, name);
  };

  EasyEditor.prototype.render = function () {
    var _a = this.props,
        _b = _a.style,
        style = _b === void 0 ? {} : _b,
        className = _a.className,
        _c = _a.minHeight,
        minHeight = _c === void 0 ? 300 : _c,
        _d = _a.showToolbar,
        showToolbar = _d === void 0 ? true : _d,
        controls = _a.controls;
    var cls = classnames("easy-editor", className);
    return /*#__PURE__*/React.createElement("div", {
      className: cls,
      style: __assign({}, style)
    }, showToolbar && /*#__PURE__*/React.createElement(ToolBar, {
      controls: controls,
      value: this.state.value,
      onChange: this.onChange,
      beforeUpload: this.props.beforeUpload
    }), /*#__PURE__*/React.createElement("div", {
      className: "easy-editor-content",
      style: {
        minHeight: minHeight + "px"
      }
    }, this.renderEditor()));
  };

  return EasyEditor;
}(React.Component);

export default EasyEditor;