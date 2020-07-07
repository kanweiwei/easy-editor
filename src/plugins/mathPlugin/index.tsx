import * as React from "react";
import EditorPlugin from "../../interfaces/pluginInterface";
import getAttr from "../../utils/getAttr";
import Canvg from "canvg";
//@ts-ignore
import "./tex-svg";
import { Selection } from "@zykj/slate";
import "./style.less";

declare let window: Window & { MathJax: any };

const mathPlugin: EditorPlugin = {
  type: "node",
  nodeType: "math-content",
  object: "inline",
  schema: {
    isVoid: true,
  },
  importer(el, next): any {
    if (getAttr(el.attrs, "data-type") === "math-content") {
      const tex = getAttr(el.attrs, "data-tex");
      return {
        object: "inline",
        type: "math-content",
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
    return <span data-type="math-content" data-tex={tex}></span>;
  },
  render(editor, props) {
    const tex = props.node.data.get("tex");
    console.log(props);
    return <MathView tex={tex} {...props} />;
  },
};

function MathView(props: any) {
  const { tex, isFocused } = props;
  const [url, setUrl] = React.useState<string>();
  console.log(props);

  React.useEffect(() => {
    window.MathJax.startup.promise.then(() => {
      const svg = window.MathJax.tex2svg(tex, { display: true });
      console.log(window.MathJax.startup.adaptor.outerHTML(svg), svg);
      const cas = window.document.createElement("canvas");
      document.body.appendChild(cas);
      const ctx = cas.getContext("2d");
      if (ctx) {
        let v = Canvg.fromString(
          ctx,
          window.MathJax.startup.adaptor.outerHTML(svg.childNodes[0]),
          {
            window,
          }
        );
        v.start();
        console.dir(cas);
        let baseurl = cas.toDataURL("image/png", 1);
        document.body.removeChild(cas);

        setUrl(baseurl);
      }
    });
  }, [tex]);

  React.useEffect(() => {
    let value = props.editor.value;
    if (isFocused && value.selection.anchorKey === value.selection.focusKey) {
      let change = value.change();
      let pre = value.document.getPreviousText(value.selection.anchorKey);
      let next = value.document.getNextText(value.selection.anchorKey);
      let range = Selection.create({
        anchor: pre,
        focus: next,
      });
      change.select(range).focus();
      props.editor.onChange(change);
    }
  }, [isFocused]);

  if (url) {
    return <img src={url} data-tex={tex} />;
  }
  return null;
}

export default mathPlugin;
