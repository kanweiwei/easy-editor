import { __assign, __extends, __rest } from "tslib";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-global-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-cond-assign */
/* eslint-disable prefer-const */
// @ts-ignore
import { Button, Col, Form, Input, Row } from "antd";
import { assign, debounce } from "lodash-es";
import * as React from "react";
import { findDOMNode } from "react-dom";
import ContextMenu from "./hoverMenu/contextMenu";
// @ts-ignore
import { getStyleFromData } from "./htmlSerialize";
/**
 * nodes
 */
function ParagraphNode(props) {
    return (<p {...props.attributes} style={props.style} className={props.className}>
      {props.children}
    </p>);
}
function SpanNode(props) {
    var _a = props.node.data.toJS(), style = _a.style, className = _a.className, otherAttrs = __rest(_a, ["style", "className"]);
    style = getStyleFromData(props.node);
    return (<span {...props.attributes} {...otherAttrs} style={style} className={className}>
      {props.children}
    </span>);
}
/**
 * placeholder
 */
export function renderPlaceholder(text, tips, _a) {
    var style = (_a === void 0 ? {} : _a).style;
    if (!text || (text.length === 1 && text.charCodeAt(0) === 8203)) {
        style = assign({}, style);
        return (<div className="description_placeholder" style={style}>
        {tips}
      </div>);
    }
    return null;
}
// eslint-disable-next-line react/prefer-stateless-function
var ImgForm = /** @class */ (function (_super) {
    __extends(ImgForm, _super);
    function ImgForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImgForm.prototype.render = function () {
        var getFieldDecorator = this.props.form.getFieldDecorator;
        var _a = this.props, node = _a.node, onload = _a.onload;
        var img = document.querySelector("img[data-key='" + node.key + "']");
        var formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
            },
        };
        return (<div>
        <Row>
          <Col span={12}>
            <Form>
              <Form.Item label="图片地址" {...formItemLayout}>
                {getFieldDecorator("src", {
            initialValue: img.src,
        })(<Input disabled/>)}
              </Form.Item>
              <Form.Item label="宽度" {...formItemLayout}>
                {getFieldDecorator("width", {
            initialValue: img.width,
        })(<Input />)}
              </Form.Item>
              <Form.Item label="高度" {...formItemLayout}>
                {getFieldDecorator("height", {
            initialValue: img.height,
        })(<Input />)}
              </Form.Item>
            </Form>
          </Col>
          <Col span={12}>
            <div style={{ marginLeft: "20px" }}>
              <img src={img.src} onLoad={onload} alt=""/>
            </div>
          </Col>
        </Row>
      </div>);
    };
    return ImgForm;
}(React.Component));
// @ts-ignore
var ImgAttrsForm = Form.create()(ImgForm);
var ResizeBox = /** @class */ (function (_super) {
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
            while ((child = child.parentNode)) {
                if (child.tagName.toLowerCase() === "div") {
                    return child;
                }
            }
        };
        _this.resizing = function (e) {
            var $container = findDOMNode(_this);
            var mouse = {};
            var _a = $container.getBoundingClientRect(), width = _a.width, height = _a.height, left = _a.left;
            var originWidth = width;
            var originHeight = height;
            mouse.x =
                ((e.touches && e.touches[0].clientX) || e.clientX || e.pageX) +
                    document.documentElement.scrollLeft;
            mouse.y =
                ((e.touches && e.touches[0].clientY) || e.clientY || e.pageY) +
                    document.documentElement.scrollTop;
            if (_this.target.className.indexOf("resize-handle-se") > -1) {
                width = mouse.x - left;
                height = (width / originWidth) * originHeight;
            }
            else if (_this.target.className.indexOf("resize-handle-sw") > -1) {
                width -= mouse.x - left;
                height = (width / originWidth) * originHeight;
                left = mouse.x;
            }
            else if (_this.target.className.indexOf("resize-handle-nw") > -1) {
                width -= mouse.x - left;
                height = (width / originWidth) * originHeight;
                left = mouse.x;
                top = mouse.y;
            }
            else if (_this.target.className.indexOf("resize-handle-ne") > -1) {
                width = mouse.x - left;
                height = (width / originWidth) * originHeight;
                top = mouse.y;
            }
            width =
                width >= _this.editorDom.offsetWidth ? _this.editorDom.offsetWidth : width;
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
        var _a = this.props, children = _a.children, isSelected = _a.isSelected, style = _a.style;
        var float = style.float;
        var attrs = {};
        if (float) {
            attrs.onMouseDown = this.startResize;
        }
        if (isSelected) {
            if (!float) {
                return (<span className="resize-container" ref={function (n) { return (_this.rootDom = n); }} {...{ style: style }}>
            <span className="resize-handle resize-handle-ne active" onMouseDown={this.startResize}/>
            <span className="resize-handle resize-handle-nw"/>
            {children}
            <span className="resize-handle resize-handle-se active" onMouseDown={this.startResize}/>
            <span className="resize-handle resize-handle-sw"/>
          </span>);
            }
            return (<span className="resize-container" ref={function (n) { return (_this.rootDom = n); }} {...{ style: style }}>
          <span className="resize-handle resize-handle-ne"/>
          <span className="resize-handle resize-handle-nw active" onMouseDown={this.startResize}/>
          {children}
          <span className="resize-handle resize-handle-se"/>
          <span className="resize-handle resize-handle-sw active" onMouseDown={this.startResize}/>
        </span>);
        }
        return <>{children}</>;
    };
    return ResizeBox;
}(React.Component));
export default (function (props, self) {
    var attributes = props.attributes, children = props.children, node = props.node, isSelected = props.isSelected;
    switch (node.type) {
        case "div": {
            var _a = node.data.toJS(), style = _a.style, className = _a.className, otherAttrs = __rest(_a, ["style", "className"]);
            style = getStyleFromData(node);
            return (<div {...props.attributes} {...otherAttrs} style={style} className={className}>
          {children}
        </div>);
        }
        case "paragraph": {
            var style = getStyleFromData(node);
            var className = node.data.toJS().className;
            return <ParagraphNode {...props} style={style} className={className}/>;
        }
        case "span":
            return <SpanNode {...props}/>;
        case "ruby": {
            return <ruby {...props.attributes}>{props.children}</ruby>;
        }
        case "rp":
            return <rp>{props.children}</rp>;
        case "rt":
            return <rt>{props.children}</rt>;
        case "image": {
            var src = node.data.get("src");
            var isformula = node.data.get("data-isformula");
            var maxHeight_1 = node.data.get("data-max-height");
            var onload = void 0;
            if (isformula) {
                onload = function (e) {
                    e.target.style.display = "inline-block";
                    if (maxHeight_1) {
                        e.target.style.height = maxHeight_1 + "px";
                    }
                    var change = self.state.value.change();
                    var data = __assign(__assign({}, node.data.toJS()), { src: node.data.get("src"), style: __assign(__assign({}, node.data.toJS().style), { display: "inline-block" }) });
                    if (maxHeight_1) {
                        data.style.height = maxHeight_1 + "px";
                    }
                    change = change.setNodeByKey(node.key, {
                        data: data,
                    });
                    self.onChange(change);
                };
            }
            var className = isSelected ? "active" : null;
            var style = { display: "inline-block" };
            if (node.data.get("style")) {
                style = Object.assign(style, node.data.get("style"));
            }
            var image_1;
            var handleClickImg = function (e) {
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
                setTimeout(function () {
                    var menu = document.querySelector("#context-menu");
                    // todo 菜单显示位置
                    if (menu && img) {
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
            var setFloatRight = function (e) {
                e.preventDefault();
                var change = self.state.value.change();
                change = change.setNodeByKey(node.key, {
                    data: {
                        src: node.data.get("src"),
                        style: __assign(__assign({}, node.data.toJS().style), { float: "right" }),
                    },
                });
                change = change.deselect().blur();
                self.onChange(change, "move-img");
                var menu = document.querySelector("#context-menu");
                menu.style.opacity = 0;
            };
            var setNoFloat = function (e) {
                e.preventDefault();
                var change = self.state.value.change();
                var _a = node.data.toJS().style, float = _a.float, otherAttrs = __rest(_a, ["float"]);
                change = change.setNodeByKey(node.key, {
                    data: {
                        src: node.data.get("src"),
                        style: __assign(__assign({}, otherAttrs), { display: "inline-block" }),
                    },
                });
                change = change.deselect().blur();
                self.onChange(change, "move-img");
                var menu = document.querySelector("#context-menu");
                menu.style.opacity = 0;
            };
            var changeImg = function (width, height) {
                var change = self.state.value.change();
                change = change.setNodeByKey(node.key, {
                    data: {
                        src: node.data.get("src"),
                        style: __assign(__assign({}, node.data.toJS().style), { display: "inline-block", width: width + "px", height: height + "px" }),
                    },
                });
                // change = Value.fromJSON(change.value.toJSON()).change();
                self.onChange(change, "qst");
            };
            // @ts-ignore
            var imgForm = void 0;
            return (<span contentEditable={false}>
          <ContextMenu {...props}>
            <ul>
              <li>
                <Button onMouseDown={setFloatRight}>靠右环绕</Button>
              </li>
              <li>
                <Button onMouseDown={setNoFloat}>清除环绕</Button>
              </li>
              
            </ul>
          </ContextMenu>
          <ResizeBox isSelected={isSelected} {...{ style: style }} onChange={changeImg}>
            <img onContextMenu={handleClickImg} src={src} className={className} {...{ style: style }} {...attributes} onLoad={onload} alt=""/>
          </ResizeBox>
        </span>);
        }
        case "table-body": {
            var _b = node.data.toJS(), style = _b.style, className = _b.className, otherAttrs = __rest(_b, ["style", "className"]);
            style = getStyleFromData(node);
            return (<tbody {...attributes} {...otherAttrs} style={style} className={className}>
          {children}
        </tbody>);
        }
        case "table-row": {
            var _c = node.data.toJS(), style = _c.style, className = _c.className, otherAttrs = __rest(_c, ["style", "className"]);
            style = getStyleFromData(node);
            return (<tr {...attributes} {...otherAttrs} style={style} className={className}>
          {children}
        </tr>);
        }
        case "table-cell": {
            var _d = node.data.toJS(), style = _d.style, className = _d.className, otherAttrs = __rest(_d, ["style", "className"]);
            style = getStyleFromData(node);
            return (<td {...attributes} {...otherAttrs} style={style} className={className}>
          {children}
        </td>);
        }
        default:
            return null;
    }
});