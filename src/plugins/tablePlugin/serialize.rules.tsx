/* eslint-disable prefer-const */
import * as React from "react";
import { getStyleFromData } from "../../htmlSerialize";
import TablePlugin from ".";

export default [
  {
    serialize(obj: any, children: any): any {
      if (obj.object === "block") {
        let { style, className, ...otherAttrs } = obj.data.toJS();
        style = getStyleFromData(obj);
        if (obj.type === TablePlugin.nodeType) {
          return (
            <table {...otherAttrs} style={style} className={className}>
              {children}
            </table>
          );
        }
      }
    },
  },
];
