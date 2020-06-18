import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _indexOfInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/index-of";
import _filterInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/filter";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";

function getStyleFromString(str) {
  var style = {};

  if (str) {
    var _context, _context2;

    var temp = _mapInstanceProperty(_context = _filterInstanceProperty(_context2 = str.split(";")).call(_context2, function (item) {
      return item;
    })).call(_context, function (item) {
      var _context3;

      var a = item.split(":"); // vertical-align   -> verticalAlign

      if (_indexOfInstanceProperty(_context3 = a[0]).call(_context3, "-")) {
        var t = a[0].split("-");

        for (var i = 1; i < t.length; i++) {
          t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
        }

        a[0] = t.join("");
      }

      return {
        key: a[0],
        value: a[1]
      };
    });

    _forEachInstanceProperty(temp).call(temp, function (item) {
      style[item.key] = item.value;
    });
  }

  return style;
}

export default getStyleFromString;