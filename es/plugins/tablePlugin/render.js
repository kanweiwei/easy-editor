import _extends from "@babel/runtime-corejs3/helpers/extends";
import _someInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/some";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _setTimeout from "@babel/runtime-corejs3/core-js-stable/set-timeout";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import { __assign, __extends, __rest } from "tslib";
import * as React from "react";
import "./index.css";
import { range, slice } from "lodash-es";
import { findDOMNode } from "react-dom";
import getStyleFromData from "../../utils/getStyleFromData";

function getTdCount(node) {
  var trs = node.filterDescendants(function (n) {
    return n.type === "table-row";
  });
  var res = 0;

  _forEachInstanceProperty(trs).call(trs, function (tr) {
    var tds = tr.filterDescendants(function (n) {
      return n.type === "table-cell";
    });

    if (tds.size > res) {
      res = tds.size;
    }
  });

  return res;
}

var Vline =
/** @class */
function (_super) {
  __extends(Vline, _super);

  function Vline() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.startResize = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.x = (e.touches && e.touches[0].clientX || e.clientX || e.pageX) + document.documentElement.scrollLeft;
      var root = findDOMNode(_this);
      root.style.borderRightStyle = "dashed";
      _this.left = Number(root.style.left.replace("px", ""));
      window.addEventListener("mousemove", _this.resizing);
      window.addEventListener("mouseup", _this.endResize);
    };

    _this.endResize = function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.removeEventListener("mousemove", _this.resizing);
      window.removeEventListener("mouseup", _this.endResize);
      var root = findDOMNode(_this);
      root.style.borderRightStyle = "solid";

      if (_this.props.onUpdate) {
        _this.props.onUpdate(Number(root.style.left.replace("px", "")));
      }
    };

    _this.resizing = function (e) {
      var $container = findDOMNode(_this);
      var mouse = {};
      mouse.x = (e.touches && e.touches[0].clientX || e.clientX || e.pageX) + document.documentElement.scrollLeft;
      $container.style.left = _this.left + (mouse.x - _this.x) + "px";
    };

    return _this;
  }

  Vline.prototype.render = function () {
    var left = this.props.left;
    return /*#__PURE__*/React.createElement("div", {
      className: "slate-sheet-container-vline",
      style: {
        left: left + "px"
      },
      onMouseDown: this.startResize
    });
  };

  return Vline;
}(React.Component);

var SlateTable =
/** @class */
function (_super) {
  __extends(SlateTable, _super);

  function SlateTable(props) {
    var _context4;

    var _this = _super.call(this, props) || this;

    _this.hasBorder = true;

    _this.updateTargetTdWidth = function (tds, vlines, i) {
      return function (change) {
        var target = tds.get(i);

        if (target) {
          var style = getStyleFromData(target);
          style.width = vlines[i].width + "px";
          change.setNodeByKey(target.key, {
            data: __assign(__assign({}, target.data.toJS()), {
              style: style
            })
          });
        }
      };
    };

    _this.updateWidth = function (left, i) {
      var _a = _this.state,
          maxTdCount = _a.maxTdCount,
          vlines = _a.vlines;
      var _b = _this.props,
          node = _b.node,
          editor = _b.editor;
      var dis = left - vlines[i].left;
      vlines[i].left = left;

      if (i === 0) {
        vlines[i].width = left;
      } else {
        vlines[i].width = left - vlines[i - 1].left;
      }

      if (vlines[i + 1]) {
        vlines[i + 1].width -= dis;
      }

      var targetTrs = node.filterDescendants(function (n) {
        return n.type === "table-row" && n.nodes.size === maxTdCount;
      });
      var change = editor.state.value.change();

      _forEachInstanceProperty(targetTrs).call(targetTrs, function (tr) {
        var tds = tr.nodes;
        change.call(_this.updateTargetTdWidth(tds, vlines, i));
        change.call(_this.updateTargetTdWidth(tds, vlines, i + 1));
      });

      editor.onChange(change);

      _this.setState({
        vlines: vlines
      });

      _setTimeout(function () {
        _this.updateVlinesPosition();
      });
    };

    _this.renderVlines = function () {
      var _context;

      var vlines = _this.state.vlines;
      return _mapInstanceProperty(_context = range(vlines.length)).call(_context, function (n, i) {
        return /*#__PURE__*/React.createElement(Vline, {
          left: vlines[i].left,
          onUpdate: function onUpdate(left) {
            return _this.updateWidth(left, i);
          },
          key: i
        });
      });
    };

    _this.updateVlinesPosition = function () {
      // 获取td的位置信息并更新垂直调整线的位置
      var _a = _this.state,
          maxTdCount = _a.maxTdCount,
          vlines = _a.vlines;
      var node = _this.props.node;
      var targetTr = node.findDescendant(function (n) {
        return n.type === "table-row" && n.nodes.size === maxTdCount;
      });

      if (!targetTr) {
        return;
      }

      var tds = targetTr.nodes;
      var tdDoms = [];

      _forEachInstanceProperty(tds).call(tds, function (td) {
        tdDoms.push(window.document.querySelector("[data-key='" + td.key + "']"));
      });

      var left = 0;

      _forEachInstanceProperty(tdDoms).call(tdDoms, function (td, i) {
        if (td.style.borderCollapse === "collapse" && i === 0) {
          left = left + td.offsetWidth - Number((td.style.borderWidth || "").replace("px", ""));
        } else {
          left += td.offsetWidth;
        }

        vlines[i].left = left;
        vlines[i].width = td.offsetWidth;
      });

      _this.setState({
        vlines: vlines
      });
    };

    _this.changeTableBorder = function () {
      // 当光标在表格内时
      var _a = _this.props,
          node = _a.node,
          isFocused = _a.isFocused;
      var root = document.querySelector("[data-key='" + node.key + "'] table");

      if (isFocused) {
        if (!_this.hasBorder) {
          var _context2;

          root.style.border = "1px solid #ccc";
          var tds_1 = root.querySelectorAll("td");

          _forEachInstanceProperty(_context2 = range(tds_1.length)).call(_context2, function (n, i) {
            tds_1[i].style.border = "1px solid #ccc";
          });
        }
      } else if (!_this.hasBorder) {
        var _context3;

        root.style.border = "none";
        root.style.borderWidth = "";
        var tds_2 = root.querySelectorAll("td");

        _forEachInstanceProperty(_context3 = range(tds_2.length)).call(_context3, function (n, i) {
          tds_2[i].style.border = "none";
        });
      }
    };

    var maxTdCount = getTdCount(props.node);

    var vlines = _mapInstanceProperty(_context4 = range(maxTdCount)).call(_context4, function () {
      return {
        left: 0
      };
    });

    _this.state = {
      maxTdCount: maxTdCount,
      vlines: vlines
    };
    return _this;
  }

  SlateTable.prototype.componentDidUpdate = function () {
    this.changeTableBorder();
  };

  SlateTable.prototype.componentDidMount = function () {
    var _context5;

    var node = this.props.node;
    var root = document.querySelector("[data-key='" + node.key + "'] table");
    var tds = root.querySelectorAll("td");

    if (root.border || root.style.borderWidth || _someInstanceProperty(_context5 = slice(tds)).call(_context5, function (td) {
      return td.style.borderWidth !== null;
    })) {
      this.hasBorder = true;
    } else {
      this.hasBorder = false;
    }

    this.updateVlinesPosition();
  };

  SlateTable.prototype.render = function () {
    var _a = this.props,
        attributes = _a.attributes,
        children = _a.children,
        node = _a.node;

    var _b = node.data.toJS(),
        style = _b.style,
        className = _b.className,
        otherAttrs = __rest(_b, ["style", "className"]);

    style = getStyleFromData(node);
    return /*#__PURE__*/React.createElement("div", _extends({
      className: "slate-sheet-container"
    }, attributes), this.renderVlines(), /*#__PURE__*/React.createElement("table", _extends({}, otherAttrs, {
      style: style,
      className: className
    }), children));
  };

  return SlateTable;
}(React.Component);

export default (function (editor, props) {
  return /*#__PURE__*/React.createElement(SlateTable, _extends({}, props, {
    editor: editor
  }));
});