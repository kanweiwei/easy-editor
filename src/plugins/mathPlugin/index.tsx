import * as React from "react";
import EditorPlugin from "../../interfaces/pluginInterface";
import getAttr from "../../utils/getAttr";
import Canvg from "canvg";
//@ts-ignore
import "./tex-svg";
import { Selection } from "@zykj/slate";
import "./style.less";
import getBlobByDataURI from "../../utils/getBlobByDataURI";

declare let window: Window & { MathJax: any };

const mathPlugin: EditorPlugin = {
  type: "node",
  nodeType: "math-content",
  object: "inline",
  schema: {
    isVoid: true,
  },
  importer(el, next): any {
    let type = getAttr(el.attrs, "data-type");
    if (type === "math-content") {
      const tex = getAttr(el.attrs, "data-tex");
      const url = getAttr(el.attrs, "data-url") || "";
      return {
        object: "inline",
        type: "math-content",
        isVoid: true,
        nodes: next(el.childNodes),
        data: {
          tex,
          url,
        },
      };
    }
  },
  exporter(node, children): any {
    const tex = node.data.get("tex");
    const url = node.data.get("url");
    if (url) {
      return <img src={url} data-type="math-content" data-tex={tex} />;
    }
    return <span data-type="math-content" data-tex={tex} data-url={url}></span>;
  },
  render(editor, props) {
    const tex = props.node.data.get("tex");
    const url = props.node.data.get("url");
    return (
      <MathView
        tex={tex}
        url={url}
        beforeUpload={editor.props.beforeUpload}
        {...props}
      />
    );
  },
};

function MathView(props: any) {
  const { tex, url, isFocused } = props;

  const tmpRef = React.createRef<HTMLSpanElement>();

  // tex2png
  React.useEffect(() => {
    let value = props.editor.value;
    let change = value.change();
    if (tex) {
      window.MathJax.startup.promise
        .then(() => {
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

            if (props.beforeUpload) {
              let res = props.beforeUpload(
                getBlobByDataURI(baseurl, "image/png"),
                baseurl
              );
              if (typeof res !== "string" && "then" in res) {
                return res;
              } else {
                if (res) {
                  change.setNodeByKey(props.node.key, {
                    data: {
                      tex: tex,
                      url: res,
                    },
                  });
                }
              }
            }
            // upload png or use server url
            change.setNodeByKey(props.node.key, {
              data: {
                tex: tex,
                url: baseurl,
              },
            });
          }
        })
        .then((imgUrl?: string) => {
          if (imgUrl) {
            change.setNodeByKey(props.node.key, {
              data: {
                tex: tex,
                url: imgUrl,
              },
            });
          }
          props.editor.onChange(change);
        });
    } else {
      if (url) {
        change.setNodeByKey(props.node.key, {
          data: {
            tex: tex,
            url: "",
          },
        });
        props.editor.onChange(change);
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
        anchor: {
          key: pre.key,
          offset: pre.text.length,
        },
        focus: {
          key: next.key,
          offset: 0,
        },
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
    // @ts-ignore
    let parent = e.target.parentNode;
    while (parent && !parent.dataset.key) {
      let p = parent.parentNode;
      if (p && p.dataset.key) {
        let textInput = document.querySelector<HTMLDivElement>(
          "#math-textarea"
        );
        let textarea = document.querySelector<HTMLTextAreaElement>(
          "#math-textarea textarea"
        );
        if (textInput && textarea) {
          textInput.style.left = xy.current.x + "px";
          textInput.style.top = xy.current.y + "px";
          // @ts-ignore
          textarea.value = e.target.dataset.tex ? e.target.dataset.tex : "";
          textInput.setAttribute("data-key", props.node.key);
        }
      }
      parent = p;
    }
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
            textarea.value = tex;
          }
          textInput.style.display = "block";
          textInput.style.left = xy.current.x + "px";
          textInput.style.top = xy.current.y + "px";
          textInput.setAttribute("data-key", props.node.key);
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
        textarea.value = tex;

        // confirm btn
        const toolbar = document.createElement("div");
        toolbar.setAttribute("class", "math-toolbar");
        const btn = document.createElement("div");
        btn.setAttribute("class", "math-toolbar__save");
        btn.innerHTML = "确定";

        toolbar.appendChild(btn);

        wrapper.appendChild(textarea);
        wrapper.appendChild(toolbar);
        wrapper.setAttribute("data-key", props.node.key);

        document.body.appendChild(wrapper);

        document
          .querySelector(".math-toolbar__save")!
          .addEventListener("click", saveHandler);

        update();
      }
    } else {
      if (
        textInput &&
        textInput.style.display != "none" &&
        textInput.dataset.key === props.node.key
      ) {
        textInput.style.display = "none";
      }
    }
  });

  const saveHandler = () => {
    const wrapper = document.querySelector<HTMLDivElement>("#math-textarea");
    if (wrapper) {
      const textarea = wrapper.querySelector("textarea");
      const key = wrapper.dataset.key;
      if (!textarea) return;
      let change = props.editor.value.change();
      const v = textarea.value.trim();
      if (v) {
        change.setNodeByKey(key, {
          data: {
            tex: v,
          },
        });
      } else {
        change.setNodeByKey(key, {
          data: {
            tex: v,
          },
        });
      }

      change.collapseToFocus().focus();
      props.editor.onChange(change);
    }
  };

  // click handler
  React.useEffect(() => {
    return () => {
      let saveBtn = document.querySelector(".math-toolbar__save");
      if (saveBtn) {
        // saveBtn.removeEventListener("click", saveHandler);
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
