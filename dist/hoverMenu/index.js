import { __assign, __extends } from "tslib";
import { Value } from "@zykj/slate";
import classnames from "classnames";
import { omit } from "lodash-es";
import * as React from "react";
import ReactDOM from "react-dom";
import "./style.less";
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // When a mark button is clicked, toggle the current mark.
        _this.onClickMark = function (event, type) {
            var _a = _this.props, value = _a.value, onChange = _a.onChange;
            event.preventDefault();
            var change = value.change().toggleMark(type);
            onChange(change);
        };
        _this.onClickBlock = function (event, onClick, options) {
            if (options === void 0) { options = {}; }
            event.preventDefault();
            var _a = _this.props, onChange = _a.onChange, value = _a.value;
            var change = value.change();
            try {
                if (onClick) {
                    change = change.call(onClick(__assign({}, options)));
                    change = Value.fromJSON(change.value.toJSON()).change();
                    return onChange(change);
                }
            }
            catch (e) {
                change = change.blur();
                onChange(change);
            }
        };
        // Render a mark-toggling toolbar button.
        _this.renderMarkButton = function (type, icon, title) {
            var activeMarks = _this.props.value.activeMarks.toArray();
            var isActive = activeMarks.some(function (m) { return m.type == type; });
            var onMouseDown = function (event) { return _this.onClickMark(event, type); };
            var btnClass = classnames({
                "tool-btn": true,
                isActive: isActive,
            });
            return (<span>
        <span className={btnClass} title={title} onMouseDown={onMouseDown}>
          {icon}
        </span>
      </span>);
        };
        _this.renderIndentButton = function (type, icon, title) {
            var clickIndentButton = function (e) {
                e.preventDefault();
                var _a = _this.props, onChange = _a.onChange, value = _a.value;
                var change = value.change();
                var blocks = change.value.blocks;
                blocks.forEach(function (block) {
                    var originalData = block.get("data");
                    var originStyle = originalData.get("style");
                    if (!("textIndent" in originStyle)) {
                        var data = block.data.set("style", __assign(__assign({}, originStyle), { textIndent: "2em" }));
                        change = change.setNodeByKey(block.key, {
                            data: data,
                        });
                    }
                    else {
                        var style = omit(originStyle, ["textIndent"]);
                        var data = block.data.set("style", style);
                        change = change.setNodeByKey(block.key, {
                            data: data,
                        });
                    }
                });
                onChange(change);
            };
            var onMouseDown = function (event) { return clickIndentButton(event); };
            return (
            // eslint-disable-next-line react/jsx-no-bind
            <span onMouseDown={onMouseDown} title={title}>
        <img src={icon} alt=""/>
      </span>);
        };
        _this.setAlign = function (e, align) {
            e.preventDefault();
            var _a = _this.props, onChange = _a.onChange, value = _a.value;
            var change = value.change();
            var blocks = change.value.blocks;
            blocks.forEach(function (block) {
                var data = block.get("data");
                var style = data.get("style") || {};
                if ("textAlign" in style && style.textAlign === align) {
                    delete style.textAlign;
                }
                else {
                    style.textAlign = align;
                    delete style.textAlignLast;
                }
                data = data.set("style", style);
                change = change.setNodeByKey(block.key, {
                    data: data,
                });
            });
            onChange(change);
        };
        _this.renderAlign = function (align, icon, title) {
            var isActive = _this.props.value.blocks.some(function (block) { var _a; return ((_a = block.data.get("style")) === null || _a === void 0 ? void 0 : _a["textAlign"]) === align; });
            var cls = classnames("tool-btn", {
                isActive: isActive,
            });
            return (<span>
        <span className={cls} onMouseDown={function (e) { return _this.setAlign(e, align); }} title={title}>
          {icon}
        </span>
      </span>);
        };
        _this.renderAlignJustify = function () {
            var setAlignJustify = function (e) {
                e.preventDefault();
                var _a = _this.props, onChange = _a.onChange, value = _a.value;
                var change = value.change();
                var blocks = change.value.blocks;
                blocks.forEach(function (block) {
                    var data = block.get("data");
                    var style = data.get("style") || {};
                    if ("textAlign" in style && style.textAlign === "justify") {
                        delete style.textAlign;
                        delete style.textAlignLast;
                    }
                    else {
                        style.textAlign = "justify";
                        style.textAlignLast = "justify";
                    }
                    data = data.set("style", style);
                    change = change.setNodeByKey(block.key, {
                        data: data,
                    });
                });
                onChange(change);
            };
            return (<span>
        <span className="tool-btn" title="两端对齐" onMouseDown={setAlignJustify}>
          <i className="tool-icon ic-align-between"/>
        </span>
      </span>);
        };
        _this.renderMarkBtns = function () {
            return (<>
        {_this.renderMarkButton("bold", <i className="tool-icon ic-jiacu"/>, "加粗")}
        {_this.renderMarkButton("italic", <i className="tool-icon ic-xieti"/>, "斜体")}
        
        {_this.renderMarkButton("u", <i className="tool-icon ic-xiahuaxian"/>, "下划线")}
        {_this.renderAlign("left", <i className="tool-icon ic-align-left"/>, "居左")}
        {_this.renderAlign("center", <i className="tool-icon ic-align-center"/>, "居中")}
        {_this.renderAlign("right", <i className="tool-icon ic-align-right"/>, "居右")}
        {_this.renderAlignJustify()}
        
      </>);
        };
        return _this;
    }
    // Check if the current selection has a mark with `type` in it.
    Menu.prototype.hasMark = function (type) {
        var value = this.props.value;
        if (!value) {
            return false;
        }
        return value.activeMarks.some(function (mark) { return mark.type === type; });
    };
    Menu.prototype.renderBlockButton = function (type, icon, title, onClick) {
        var _this = this;
        var onMouseDown = function (event) {
            return _this.onClickBlock(event, onClick, { type: type });
        };
        return (
        // eslint-disable-next-line react/jsx-no-bind
        <span onMouseDown={onMouseDown} title={title} key={type}>
        {icon}
      </span>);
    };
    Menu.prototype.render = function () {
        var root = window.document.getElementById("root");
        var _a = this.props, menuRef = _a.menuRef, className = _a.className;
        var rootClass = classnames("menu hover-menu slate-editor__hover-menu", className, {
            fixed: !menuRef,
        });
        var childNode = (<div className={rootClass} ref={menuRef}>
        <div className="tools">{this.renderMarkBtns()}</div>
      </div>);
        if (menuRef) {
            return ReactDOM.createPortal(childNode, root);
        }
        return childNode;
    };
    return Menu;
}(React.Component));
export default Menu;
