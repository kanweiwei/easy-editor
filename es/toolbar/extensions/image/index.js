import { __extends } from "tslib";
import * as React from "react";
import "./style.css";

var ImageExtension =
/** @class */
function (_super) {
  __extends(ImageExtension, _super);

  function ImageExtension() {
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
        var reader_1 = new FileReader();

        reader_1.onload = function () {
          var change = _this.props.change.focus().insertInline({
            object: "inline",
            type: "image",
            isVoid: true,
            data: {
              src: reader_1.result
            }
          });

          _this.props.update(change);
        };

        reader_1.readAsDataURL(file);
      }
    };

    return _this;
  }

  ImageExtension.prototype.render = function () {
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

  return ImageExtension;
}(React.Component);

export default ImageExtension;