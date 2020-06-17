import { __extends } from "tslib";
import * as React from "react";

var VedioExtension =
/** @class */
function (_super) {
  __extends(VedioExtension, _super);

  function VedioExtension() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.inputRef = /*#__PURE__*/React.createRef();

    _this.handleClick = function () {
      if (_this.inputRef.current) {
        _this.inputRef.current.click();
      }
    };

    _this.handleChange = function (e) {
      var _a, _b;

      var file = (_b = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0];

      if (file) {
        var change = _this.props.change.focus().insertBlock({
          object: "block",
          type: "object",
          isVoid: true,
          data: {
            data: "http://vodkgeyttp8.vod.126.net/cloudmusic/b3d1/core/cc53/3ed43d55b6053eee8adea6b93690a434.mp4?wsSecret=451139028541cdc174835e7993506cc2&wsTime=1592394746"
          }
        });

        _this.props.update(change);
      }
    };

    return _this;
  }

  VedioExtension.prototype.render = function () {
    return /*#__PURE__*/React.createElement("span", {
      onMouseDown: this.handleClick
    }, /*#__PURE__*/React.createElement("span", {
      className: "tool-insert-image"
    }), /*#__PURE__*/React.createElement("input", {
      type: "file",
      style: {
        width: 0,
        height: 0,
        opacity: 0
      },
      ref: this.inputRef,
      onChange: this.handleChange
    }));
  };

  return VedioExtension;
}(React.Component);

export default VedioExtension;