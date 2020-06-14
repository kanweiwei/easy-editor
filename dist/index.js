import { __assign, __extends, __spreadArrays } from "tslib";
import { Value } from "@zykj/slate";
import { Editor } from "@zykj/slate-react";
import classnames from "classnames";
import { get } from "lodash-es";
import raf from "raf";
import * as React from "react";
import handlePaste from "./events/paste";
import HoverMenu from "./HoverMenu/index";
import htmlConvertor from "./htmlConvertor";
import initValue from "./initValue";
import basePlugins from "./plugins";
import renderMark from "./renderMark";
import renderNode from "./renderNode";
import schemas from "./schema";
import "./style.less";
var findRealDoms = function (dom, realDom) {
    if (dom.childNodes && Array.isArray(dom.childNodes)) {
        if (dom.childNodes.length === 1) {
            return findRealDoms(dom.childNodes[0], realDom);
        }
        if (dom.childNodes.length > 1) {
            realDom = dom;
            return realDom;
        }
    }
    else {
        realDom = dom;
        return realDom;
    }
};
var getValueByHtml = function (html) {
    var htmlValue = htmlConvertor.deserialize(html, { toJSON: true });
    return Value.fromJSON(htmlValue);
};
// 定义编辑器
var SlateEditor = /** @class */ (function (_super) {
    __extends(SlateEditor, _super);
    function SlateEditor(props) {
        var _a;
        var _this = _super.call(this, props) || this;
        _this.isComposing = false;
        _this.onChange = function (change, type) {
            var onChange = _this.props.onChange;
            if (onChange) {
                var res = onChange({ change: change, type: type });
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
                value: change.value,
            });
        };
        _this.update = function (change, type) {
            return _this.onChange(change, type);
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
                    _this.onChange({ value: value_1 });
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
            var native = window.getSelection();
            if (!native) {
                return;
            }
            try {
                var nodeElement = native.focusNode;
                if (nodeElement) {
                    if (nodeElement.nodeName === "#text") {
                        nodeElement = nodeElement.parentNode;
                        if (!nodeElement) {
                            nodeElement = native.getRangeAt(0);
                        }
                    }
                    var rect = nodeElement.getBoundingClientRect();
                    menu.style.opacity = 1;
                    menu.style.zIndex = 1000;
                    menu.style.top = rect.top + window.pageYOffset - menu.offsetHeight - 20 + "px";
                    var left = rect.left +
                        window.pageXOffset -
                        menu.offsetWidth / 2 +
                        rect.width / 2;
                    if (left <= 0) {
                        left = 60;
                    }
                    menu.style.left = left + "px";
                }
            }
            catch (err) {
                // eslint-disable-next-line no-console
                console.log(err);
            }
        };
        _this.resetByHtml = function (html) {
            var change = getValueByHtml(html).change();
            _this.update(change);
        };
        _this.getValueByHtml = function (html) {
            var htmlValue = htmlConvertor.deserialize(html, { toJSON: true });
            return Value.fromJSON(htmlValue);
        };
        /** 编辑器中插入Blocks */
        _this.insertBlocks = function (blocks) {
            var value = _this.state.value;
            var change = value.change().moveToRangeOfDocument().moveToEnd();
            blocks.forEach(function (block) {
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
            if (fixed === void 0) { fixed = false; }
            var _a = _this.props, oneSubQst = _a.oneSubQst, checkMode = _a.checkMode, _b = _a.showMenu, showMenu = _b === void 0 ? true : _b;
            if (showMenu) {
                if (fixed) {
                    return (<HoverMenu value={_this.state.value} mode={_this.mode} onChange={_this.onChange} plugins={_this.plugins}/>);
                }
                else {
                    return (<HoverMenu menuRef={_this.menuRef} value={_this.state.value} mode={_this.mode} onChange={_this.onChange} plugins={_this.plugins}/>);
                }
            }
            return null;
        };
        _this.renderEditor = function () {
            var _a;
            var value = _this.state.value;
            var _b = _this.props, readOnly = _b.readOnly, placeholder = _b.placeholder, pasteOptions = _b.pasteOptions, _c = _b.minHeight, minHeight = _c === void 0 ? 300 : _c;
            return (<Editor placeholder={placeholder} value={value} onChange={_this.onChange} onCompositionStart={_this.onCompositionStart} onCompositionEnd={_this.onCompositionEnd} onBlur={_this.onBlur} onPaste={function (e, change) {
                return handlePaste(e, change, _this, pasteOptions);
            }} onContextMenu={function (e) { return e.preventDefault(); }} renderMark={renderMark} renderNode={function (props) { return renderNode(props, _this); }} onKeyDown={_this.props.onKeyDown} plugins={_this.plugins} autoFocus={(_a = props.autoFocus) !== null && _a !== void 0 ? _a : true} schema={schemas} spellCheck={false} readOnly={readOnly} style={{ minHeight: minHeight + "px" }}/>);
        };
        _this.renderMask = function () {
            if (_this.props.readOnly) {
                return (<div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}/>);
            }
            return null;
        };
        var value = props.value;
        _this.plugins = __spreadArrays([
            basePlugins.map(function (Plugin) { return new Plugin(_this); })
        ], ((_a = props === null || props === void 0 ? void 0 : props.plugins) !== null && _a !== void 0 ? _a : []));
        _this.state = {
            value: value || initValue(),
        };
        return _this;
    }
    SlateEditor.prototype.componentDidMount = function () {
        this.updateMenu();
        var value = this.props.value;
        if (value) {
            this.setState({
                value: value,
            });
        }
    };
    SlateEditor.prototype.componentDidUpdate = function () {
        if (!this.props.disableMenu) {
            this.updateMenu();
        }
    };
    SlateEditor.prototype.componentWillUnmount = function () {
        if (this.rafHandle) {
            raf.cancel(this.rafHandle);
        }
    };
    SlateEditor.prototype.getState = function (name) {
        return get(this.state, name);
    };
    SlateEditor.prototype.render = function () {
        var _a = this.props, style = _a.style, className = _a.className, _b = _a.minHeight, minHeight = _b === void 0 ? 300 : _b;
        var st = __assign({}, style);
        var cls = classnames("app-slate-editor", className);
        return (<div className={cls} style={st}>
        {this.renderMenu(true)}
        {this.renderMenu()}
        <div style={{ minHeight: minHeight + "px" }}>{this.renderEditor()}</div>
        {this.renderMask()}
      </div>);
    };
    return SlateEditor;
}(React.Component));
export function valueTohtml() {
    return htmlConvertor;
}
export default SlateEditor;