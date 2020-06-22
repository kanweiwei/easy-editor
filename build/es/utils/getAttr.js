import _findInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/find";

var getAttr = function getAttr(attrs, attrName) {
  if (!attrs) {
    return null;
  }

  var a = _findInstanceProperty(attrs).call(attrs, function (attr) {
    return attr.name === attrName;
  });

  if (a) {
    if (a.value === Number(a.value)) {
      return Number(a.value);
    }

    return a.value;
  }

  return null;
};

export default getAttr;