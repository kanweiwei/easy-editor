import * as React from "react";
import EditorPlugin from "../../interfaces/pluginInterface";
import getAttr from "../../utils/getAttr";

const mathTmpPlugin: EditorPlugin = {
  type: "node",
  nodeType: "math-content-tmp",
  object: "inline",
  schema: {
    isVoid: true,
  },
  importer(el, next): any {
    if (getAttr(el.attrs, "data-type") === "math-content-tmp") {
      const tex = getAttr(el.attrs, "data-tex");
      return {
        object: "inline",
        type: "math-content-tmp",
        isVoid: true,
        nodes: next(el.childNodes),
        data: {
          tex,
        },
      };
    }
  },
  exporter(node, children): any {
    const tex = node.data.get("tex");
    return <span data-type="math-content-tmp" data-tex={tex}></span>;
  },
  render(editor, props) {
    return <span>输入 Tex 公式</span>;
  },
};

export default mathTmpPlugin;
