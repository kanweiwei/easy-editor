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
    return <MathView tex={tex} {...props} />;
  },
};

function MathView(props: any) {
  const { tex, isFocused } = props;
  const [url, setUrl] = React.useState<string>();

  const tmpRef = React.createRef<HTMLSpanElement>();

  // tex2png
  React.useEffect(() => {
    if (tex) {
      window.MathJax.startup.promise.then(() => {
        const svg = window.MathJax.tex2svg(tex, { display: true });
        const cas = window.document.createElement("canvas");
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
          v = Canvg.fromString(
            ctx,
            window.MathJax.startup.adaptor.outerHTML(svg.childNodes[0]),
            {
              emSize: 14,
            }
          );
          v.start();
          let baseurl = cas.toDataURL("image/png", 1);
          // upload png or server url
          setUrl(baseurl);
        }
      });
    } else {
      if (url) {
        setUrl("");
      }
    }
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
  });

  const xy = React.useRef({ x: 0, y: 0 });

  const updateXY = (node?: HTMLElement | null) => {
    if (!node) return;
    // @ts-ignore
    const rect = node.getBoundingClientRect();
    const x = rect.x;
    const y = rect.y + rect.height + 8;
    xy.current = {
      x,
      y,
    };
    let textInput = document.querySelector<HTMLDivElement>("#math-textarea");
    if (textInput) {
      textInput.style.left = xy.current.x + "px";
      textInput.style.top = xy.current.y + "px";
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    // @ts-ignore
    updateXY(e.target);
  };

  const [, update] = React.useReducer((x) => x + 1, 0);

  // show textarea
  React.useEffect(() => {
    let textInput = document.querySelector<HTMLDivElement>("#math-textarea");
    if (props.isSelected) {
      if (textInput) {
        if (textInput.style.display !== "block") {
          if (props.editor.value.texts.some((n: any) => n.text.length)) {
            return;
          }
          updateXY(tmpRef.current);
          const textarea = textInput.querySelector("textarea");
          if (textarea) {
            textarea.value = props.node.data.get("tex");
          }
          textInput.style.display = "block";
          textInput.style.left = xy.current.x + "px";
          textInput.style.top = xy.current.y + "px";
          update();
        }
      } else {
        updateXY(tmpRef.current);
        const wrapper = document.createElement("div");
        wrapper.setAttribute("id", "math-textarea");
        wrapper.setAttribute(
          "style",
          `left: ${xy.current.x}px;top: ${xy.current.y}px;`
        );
        const textarea = document.createElement("textarea");
        textarea.value = props.node.data.get("tex");

        // confirm btn
        const toolbar = document.createElement("div");
        toolbar.setAttribute("class", "math-toolbar");
        const btn = document.createElement("div");
        btn.setAttribute("class", "math-toolbar__save");
        btn.innerHTML = "确定";

        toolbar.appendChild(btn);

        wrapper.appendChild(textarea);
        wrapper.appendChild(toolbar);
        document.body.appendChild(wrapper);
        update();
      }
    } else {
      if (textInput && textInput.style.display != "none") {
        textInput.style.display = "none";
        update();
      }
    }
  });

  // click handler
  React.useEffect(() => {
    let saveBtn = document.querySelector(".math-toolbar__save");

    const saveHandler = () => {
      const textarea = document.querySelector<HTMLTextAreaElement>(
        "#math-textarea textarea"
      );
      if (textarea) {
        let change = props.editor.value.change();
        if (textarea.value) {
          change.setNodeByKey(props.node.key, {
            data: {
              tex: textarea.value,
            },
          });
        } else {
          change.setNodeByKey(props.node.key, {
            data: {
              tex: textarea.value,
            },
          });
        }

        change.collapseToFocus().focus();
        props.editor.onChange(change);
      }
    };
    if (saveBtn) {
      saveBtn.addEventListener("click", saveHandler);
    }
    return () => {
      let saveBtn = document.querySelector(".math-toolbar__save");
      if (saveBtn) {
        saveBtn.removeEventListener("click", saveHandler);
      }
    };
  });

  // autoFocus
  React.useEffect(() => {
    const textarea = document.querySelector<HTMLTextAreaElement>(
      "#math-textarea textarea"
    );
    if (textarea) {
      if (textarea?.clientHeight > 0) {
        textarea?.focus();
      }
    }
  });

  if (url) {
    return <img src={url} data-tex={tex} onClick={handleClick} />;
  } else {
    return (
      <span className="math-content-tmp" onClick={handleClick} ref={tmpRef}>
        输入 Tex 公式
      </span>
    );
  }
}

export default mathPlugin;
