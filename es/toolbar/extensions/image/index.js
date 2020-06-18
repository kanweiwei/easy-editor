import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _Promise from "@babel/runtime-corejs3/core-js-stable/promise";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
import { __awaiter, __extends, __generator } from "tslib";
import * as React from "react";
import "./style.css";
var acceptTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

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
      return __awaiter(_this, void 0, void 0, function () {
        var file, url, change;

        var _a, _b;

        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              file = (_b = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0];
              e.target.value = "";
              if (!file) return [3
              /*break*/
              , 6];
              if (!_includesInstanceProperty(acceptTypes).call(acceptTypes, file.type)) return [3
              /*break*/
              , 5];
              return [4
              /*yield*/
              , new _Promise(function (resolve, reject) {
                var reader = new FileReader();

                reader.onload = function () {
                  resolve(reader.result);
                };

                reader.onerror = function () {
                  reject(new Error("error"));
                };

                reader.readAsDataURL(file);
              })];

            case 1:
              url = _c.sent();
              if (!(typeof url == "string")) return [3
              /*break*/
              , 4];
              if (!this.props.beforeUpload) return [3
              /*break*/
              , 3];
              return [4
              /*yield*/
              , this.props.beforeUpload(file, url)];

            case 2:
              url = _c.sent();
              _c.label = 3;

            case 3:
              if (url) {
                change = this.props.change.focus().insertInline({
                  object: "inline",
                  type: "image",
                  isVoid: true,
                  data: {
                    src: url
                  }
                });
                this.props.update(change);
              }

              _c.label = 4;

            case 4:
              return [3
              /*break*/
              , 6];

            case 5:
              throw new Error("Only accept " + _mapInstanceProperty(acceptTypes).call(acceptTypes, function (v) {
                return v.split("/")[1];
              }).join("、") + ", but the file type is " + file.type);

            case 6:
              return [2
              /*return*/
              ];
          }
        });
      });
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