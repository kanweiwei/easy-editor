import { __rest } from "tslib";
/* eslint-disable prefer-const */
import * as React from "react";
import Html from "@zykj/slate-html-serializer";
import { parseFragment } from "parse5";
import tableSerialize from "./plugins/tablePlugin/serialize.rules";
export function getStyleFromData(node) {
    var style = {};
    if (!node.get("data")) {
        return style;
    }
    var tempStyle = node.get("data").get("style");
    if (tempStyle) {
        var keys = Object.keys(tempStyle);
        keys.forEach(function (key) {
            var tempKey = key;
            if (tempKey.indexOf("-")) {
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
export function getStyleFromString(str) {
    var style = {};
    if (str) {
        var temp = str
            .split(";")
            .filter(function (item) { return item; })
            .map(function (item) {
            var a = item.split(":");
            // vertical-align   -> verticalAlign
            if (a[0].indexOf("-")) {
                var t = a[0].split("-");
                for (var i = 1; i < t.length; i++) {
                    t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
                }
                a[0] = t.join("");
            }
            return {
                key: a[0],
                value: a[1],
            };
        });
        temp.forEach(function (item) {
            style[item.key] = item.value;
        });
    }
    return style;
}
var rules = [
    {
        serialize: function (obj, children) {
            if (obj.object === "block") {
                var _a = obj.data.toJS(), style = _a.style, className = _a.className, otherAttrs = __rest(_a, ["style", "className"]);
                style = getStyleFromData(obj);
                switch (obj.type) {
                    case "div": {
                        return (<div style={style} className={className} {...otherAttrs}>
                {children}
              </div>);
                    }
                    case "paragraph": {
                        return (<p style={style} className={className}>
                {children}
              </p>);
                    }
                    case "table": {
                        return (<table {...otherAttrs} style={style} className={className}>
                {children}
              </table>);
                    }
                    case "table-body": {
                        return (<tbody {...otherAttrs} style={style} className={className}>
                {children}
              </tbody>);
                    }
                    case "table-row": {
                        return (<tr {...otherAttrs} style={style} className={className}>
                {children}
              </tr>);
                    }
                    case "table-cell": {
                        return (<td {...otherAttrs} style={style} className={className}>
                {children}
              </td>);
                    }
                    default:
                        break;
                }
            }
        },
    },
    {
        serialize: function (obj, children) {
            if (obj.object === "inline") {
                var _a = obj.data.toJS(), style = _a.style, otherAttrs = __rest(_a, ["style"]);
                style = getStyleFromData(obj);
                switch (obj.type) {
                    case "span":
                        return (<span style={style} {...otherAttrs}>
                {children}
              </span>);
                    case "ruby": {
                        return <ruby style={style}>{children}</ruby>;
                    }
                    case "rt":
                        return <rt style={style}>{children}</rt>;
                    case "rp":
                        return <rp style={style}>{children}</rp>;
                    case "image": {
                        return (<>
                <span>&#8203;</span>
                <img {...otherAttrs} style={style} alt=""/>
                <span>&#8203;</span>
              </>);
                    }
                    default:
                        break;
                }
            }
        },
    },
    {
        serialize: function (obj, children) {
            if (obj.object === "mark") {
                switch (obj.type) {
                    case "bold":
                        return <b>{children}</b>;
                    case "italic":
                        return <i>{children}</i>;
                    case "sub":
                        return <sub>{children}</sub>;
                    case "sup":
                        return <sup>{children}</sup>;
                    case "u":
                        return <u>{children}</u>;
                    case "dot":
                        return <span className="dot">{children}</span>;
                    default:
                        return <obj.type>{children}</obj.type>;
                }
            }
        },
    },
];
rules.push(tableSerialize);
var HtmlSerialize = /** @class */ (function () {
    function HtmlSerialize() {
        this.rules = rules;
    }
    HtmlSerialize.prototype.converter = function () {
        if (this._converter) {
            return this._converter;
        }
        this._converter = new Html({
            rules: this.rules,
            parseHtml: parseFragment,
        });
        return this._converter;
    };
    return HtmlSerialize;
}());
export default HtmlSerialize;