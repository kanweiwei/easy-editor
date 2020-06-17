import { __rest } from "tslib";
/* eslint-disable prefer-const */
import * as React from "react";
import { getStyleFromData } from "../../htmlSerialize";
import TablePlugin from ".";
export default [
    {
        serialize: function (obj, children) {
            if (obj.object === "block") {
                var _a = obj.data.toJS(), style = _a.style, className = _a.className, otherAttrs = __rest(_a, ["style", "className"]);
                style = getStyleFromData(obj);
                if (obj.type === TablePlugin.nodeType) {
                    return (<table {...otherAttrs} style={style} className={className}>
              {children}
            </table>);
                }
            }
        },
    },
];
