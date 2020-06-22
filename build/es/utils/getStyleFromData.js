import _indexOfInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/index-of";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";

function getStyleFromData(node) {
  var style = {};

  if (!node.get("data")) {
    return style;
  }

  var tempStyle = node.get("data").get("style");

  if (tempStyle) {
    var keys = _Object$keys(tempStyle);

    _forEachInstanceProperty(keys).call(keys, function (key) {
      var tempKey = key;

      if (_indexOfInstanceProperty(tempKey).call(tempKey, "-")) {
        var t = tempKey.split("-");

        for (var i = 1; i < t.length; i++) {
          t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
        }

        tempKey = t.join("");
      }

      style[tempKey] = tempStyle[key];
    });
  }

  return style;
}

export default getStyleFromData;