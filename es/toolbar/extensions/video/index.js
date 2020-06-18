import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
import { __awaiter, __extends, __generator } from "tslib";
import * as React from "react";
import "./style.css";
var acceptTypes = ["video/mp4", "video/webm"];

var VideoExtension =
/** @class */
function (_super) {
  __extends(VideoExtension, _super);

  function VideoExtension() {
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
              , 4];
              if (!_includesInstanceProperty(acceptTypes).call(acceptTypes, file.type)) return [3
              /*break*/
              , 3];
              if (!this.props.beforeUpload) return [3
              /*break*/
              , 2];
              return [4
              /*yield*/
              , this.props.beforeUpload(file)];

            case 1:
              url = _c.sent();

              if (url) {
                change = this.props.change.focus().insertBlock({
                  object: "block",
                  type: "object",
                  isVoid: true,
                  data: {
                    data: url
                  }
                });
                this.props.update(change);
              }

              _c.label = 2;

            case 2:
              return [3
              /*break*/
              , 4];

            case 3:
              throw new Error("Only accept " + _mapInstanceProperty(acceptTypes).call(acceptTypes, function (v) {
                return v.split("/")[1];
              }).join("、") + ", but the file type is " + file.type);

            case 4:
              return [2
              /*return*/
              ];
          }
        });
      });
    };

    return _this;
  }

  VideoExtension.prototype.render = function () {
    return /*#__PURE__*/React.createElement("span", {
      onMouseDown: this.handleClick
    }, /*#__PURE__*/React.createElement("span", {
      className: "tool-insert-video"
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

  return VideoExtension;
}(React.Component);

export default VideoExtension;