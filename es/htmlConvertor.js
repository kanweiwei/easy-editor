import _trimInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/trim";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _indexOfInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/index-of";
import _filterInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/filter";
import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";
import _findInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/find";
import Html from "@zykj/slate-html-serializer";
import { parseFragment } from "parse5";
import { assign } from "lodash-es";
export var blockTags = {
  div: "div",
  p: "paragraph",
  table: "table",
  tbody: "table-body",
  tr: "table-row",
  td: "table-cell",
  addreess: "address",
  article: "article",
  aside: "aside",
  audio: "audio",
  blockquote: "blockquote",
  canvas: "canvas",
  dd: "dd",
  dl: "dl",
  fieldset: "fieldset",
  figcaption: "figcaption",
  figure: "figure",
  footer: "footer",
  form: "form",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  header: "header",
  hgroup: "hgroup",
  hr: "hr",
  noscript: "noscript",
  ol: "ol",
  output: "ouput",
  pre: "pre",
  section: "section",
  tfoot: "tfoot",
  ul: "ul",
  video: "video"
};
export var inlineTags = {
  span: "span",
  ruby: "ruby",
  rt: "rt",
  rp: "rp",
  tt: "tt",
  abbr: "abbr",
  acronym: "acronym",
  cite: "cite",
  code: "code",
  dfn: "dfn",
  kbd: "kbd",
  samp: "samp",
  var: "var",
  a: "a",
  bdo: "bdo",
  img: "img",
  map: "map",
  object: "object",
  q: "q",
  script: "script",
  button: "button",
  input: "input",
  label: "label",
  select: "select",
  textarea: "textarea"
};
export var markTags = {
  b: "bold",
  bold: "bold",
  sub: "sub",
  sup: "sup",
  u: "u",
  i: "italic",
  em: "italic"
};
export var getAttr = function getAttr(attrs, attrName) {
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

var rules = [{
  deserialize: function deserialize(el, next) {
    var _context4, _context5, _context6, _context7;

    // 块级标签
    var blockType = blockTags[el.tagName.toLowerCase()];

    if (blockType) {
      switch (blockType) {
        case "table":
          return {
            object: "block",
            type: blockType,
            nodes: next(_filterInstanceProperty(_context4 = el.childNodes).call(_context4, function (childNode) {
              return childNode.nodeName === "tbody" || childNode.nodeName === "tr";
            })),
            data: {
              width: getAttr(el.attrs, "width"),
              border: getAttr(el.attrs, "border"),
              cellSpacing: getAttr(el.attrs, "cellspacing"),
              cellPadding: getAttr(el.attrs, "cellpadding"),
              style: getStyleFromString(getAttr(el.attrs, "style")),
              className: getAttr(el.attrs, "class")
            }
          };

        case "table-body":
          return {
            object: "block",
            type: blockType,
            nodes: next(_filterInstanceProperty(_context5 = el.childNodes).call(_context5, function (childNode) {
              return childNode.nodeName === "tr";
            })),
            data: {
              width: getAttr(el.attrs, "width"),
              border: getAttr(el.attrs, "border"),
              rowSpan: getAttr(el.attrs, "rowspan"),
              colSpan: getAttr(el.attrs, "colspan"),
              style: getStyleFromString(getAttr(el.attrs, "style"))
            }
          };

        case "table-row":
          return {
            object: "block",
            type: blockType,
            nodes: next(_filterInstanceProperty(_context6 = el.childNodes).call(_context6, function (childNode) {
              return childNode.nodeName === "td";
            })),
            data: {
              style: getStyleFromString(getAttr(el.attrs, "style"))
            }
          };

        case "table-cell":
          return {
            object: "block",
            type: blockType,
            nodes: next(_filterInstanceProperty(_context7 = el.childNodes).call(_context7, function (childNode) {
              var _context8;

              if (childNode.nodeName === "#text" && _trimInstanceProperty(_context8 = childNode.value).call(_context8).length === 0) {
                return false;
              }

              return true;
            })),
            data: {
              width: getAttr(el.attrs, "width"),
              border: getAttr(el.attrs, "border"),
              rowSpan: getAttr(el.attrs, "rowspan"),
              colSpan: getAttr(el.attrs, "colspan"),
              style: getStyleFromString(getAttr(el.attrs, "style")),
              className: getAttr(el.attrs, "class")
            }
          };

        default:
          {
            var _context9;

            var attrs_1 = {};

            _forEachInstanceProperty(_context9 = el.attrs).call(_context9, function (attr) {
              attrs_1[attr.name] = attr.value;
            });

            var tempStyle = getAttr(el.attrs, "style");
            var uuid = getAttr(el.attrs, "uuid");
            var content = getAttr(el.attrs, "content");
            var props = getAttr(el.attrs, "props");
            var style = getStyleFromString(tempStyle);
            var dataType = getAttr(el.attrs, "data-type");
            var className = getAttr(el.attrs, "class");
            var qstType = getAttr(el.attrs, "qst-type");
            delete attrs_1.style;
            delete attrs_1.class;
            var data = assign({}, attrs_1, {
              style: style,
              className: className,
              uuid: uuid,
              content: content,
              props: props,
              "qst-type": qstType
            });
            return {
              object: "block",
              type: dataType || blockType,
              nodes: next(el.childNodes),
              data: data
            };
          }
      }
    }
  }
}, {
  deserialize: function deserialize(el, next) {
    if (el.tagName.toLowerCase() === "img") {
      var tempStyle = getAttr(el.attrs, "style");
      var isformula = getAttr(el.attrs, "data-isformula");
      var maxHeight = getAttr(el.attrs, "data-max-height");
      var height = getAttr(el.attrs, "height");
      var style = getStyleFromString(tempStyle);

      if (!style) {
        style = {};
      }

      style.display = "inline-block";

      if (maxHeight) {
        style.height = maxHeight + "px";
      } else if (!maxHeight && height) {
        style.height = height + "px";
      }

      var data = {
        src: getAttr(el.attrs, "src"),
        style: style
      };

      if (isformula === "true") {
        data["data-isformula"] = true;
      }

      if (maxHeight) {
        data["data-max-height"] = Number(maxHeight);
      } else if (!maxHeight && height) {
        data["data-max-height"] = Number(height);
      }

      return {
        object: "inline",
        type: "image",
        isVoid: true,
        nodes: next(el.childNodes),
        data: data
      };
    }
  }
}, {
  deserialize: function deserialize(el, next) {
    // 行内标签
    var inlineType = inlineTags[el.tagName.toLowerCase()];

    if (inlineType) {
      var inlineNode = {
        object: "inline",
        type: inlineType,
        nodes: next(el.childNodes),
        data: {}
      };
      var dataType = getAttr(el.attrs, "data-type");
      var dataLabel = getAttr(el.attrs, "data-label");
      var tempStyle = getAttr(el.attrs, "style");
      var className = getAttr(el.attrs, "class");
      var markType = null;

      if (className && _indexOfInstanceProperty(className).call(className, "dot") > -1) {
        markType = "dot";
      }

      var style = getStyleFromString(tempStyle);

      if (!style) {
        style = {};
      }

      inlineNode.data.style = style;

      if (className) {
        inlineNode.data.className = className;
      } // 着重号、下划线等


      if (markType) {
        inlineNode = {
          object: "mark",
          type: markType,
          nodes: next(el.childNodes)
        };
      }

      return inlineNode;
    }
  }
}, {
  deserialize: function deserialize(el) {
    if (el.nodeName && el.nodeName === "#text") {
      if (el.value) {
        var _context10, _context11;

        if (el.parentNode.nodeName === "u") {
          return {
            object: "text",
            leaves: [{
              text: el.value
            }]
          };
        }

        if (_trimInstanceProperty(_context10 = el.value).call(_context10).length > 0) {
          return {
            object: "text",
            leaves: [{
              text: el.value
            }]
          };
        }

        if (el.value.length >= 3 && _trimInstanceProperty(_context11 = el.value).call(_context11).length === 0) {
          return {
            object: "text",
            leaves: [{
              text: el.value
            }]
          };
        }

        return null;
      }

      return null;
    }
  }
}, {
  deserialize: function deserialize(el, next) {
    var markType = markTags[el.tagName.toLowerCase()];

    if (markType) {
      return {
        object: "mark",
        type: markType,
        nodes: next(el.childNodes)
      };
    }
  }
}];
var htmlConvertor = new Html({
  rules: rules,
  parseHtml: parseFragment
});
export default htmlConvertor;