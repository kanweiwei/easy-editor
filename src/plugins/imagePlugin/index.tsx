import * as React from "react";
import EditorPlugin from "../../interfaces/pluginInterface";
import getAttr from "../../utils/getAttr";
import { AST } from "parse5";
import getStyleFromString from "../../utils/getStyleFromString";
import ResizeBox from "./ResizeBox";

const imagePlugin: EditorPlugin = {
  type: "node",
  nodeType: "image",
  object: ["block", "inline"],
  schema: {
    isVoid: true,
  },
  importer(el: AST.Default.Element, next: Function): any {
    if (
      el.tagName.toLocaleLowerCase() === "div" &&
      getAttr(el.attrs, "data-type") === "image-block"
    ) {
      let imgNode = el.childNodes[0] as AST.Default.Element;
      let src = getAttr(imgNode.attrs, "src");
      let styleObj = getStyleFromString(getAttr(imgNode.attrs, "style"));
      let parentStyleObj = getStyleFromString(getAttr(el.attrs, "style"));
      let data: any = {
        src,
        style: styleObj,
      };
      if ("align" in parentStyleObj) {
        data.align = parentStyleObj.align;
      }
      return {
        object: "block",
        type: "image",
        isVoid: true,
        nodes: [],
        data,
      };
    }
    if (el.tagName.toLowerCase() === "img") {
      const tempStyle = getAttr(el.attrs, "style");

      let style = getStyleFromString(tempStyle);
      if (!style) {
        style = {};
      }
      style.display = "inline-block";

      const data: any = {
        src: getAttr(el.attrs, "src"),
        style,
      };

      return {
        object: "inline",
        type: "image",
        isVoid: true,
        nodes: next(el.childNodes),
        data,
      };
    }
  },
  exporter(node: any) {
    const { style, ...otherAttrs } = node.data.toJS();
    if (node.object === "block") {
      return (
        <>
          <div
            data-type="image-block"
            style={{ textAlign: node.data.get("align") || "left" }}
          >
            <img src={node.data.get("src")} style={node.data.get("style")} />
          </div>
          <span>&#8203;</span>
        </>
      );
    }
    return (
      <>
        <span>&#8203;</span>
        <img {...otherAttrs} style={style} alt="" />
        <span>&#8203;</span>
      </>
    );
  },
  render(editor, props) {
    const { node, isSelected, attributes } = props;
    const src = node.data.get("src");

    const className = isSelected ? "active" : null;
    let style: any = { display: "inline-block" };
    if (node.data.get("style")) {
      style = Object.assign(style, node.data.get("style"));
    }

    // @ts-ignore
    const handleClickImg = (e: any) => {
      e.preventDefault();
      e.persist();
      if (editor.props.readOnly) {
        return;
      }
      const nodeKey = e.target.dataset.key;
      if (nodeKey) {
        let change: any = editor.state.value.change();
        const targetNode: any = change.value.document.findDescendant(
          (item: any) => {
            return item.key === nodeKey;
          }
        );
        if (!targetNode) {
          return;
        }
        change = change.moveToRangeOfNode(targetNode);
        editor.onChange(change);
      }
    };

    // @ts-ignore
    const setFloatRight = (e: any) => {
      e.preventDefault();
      let change = editor.state.value.change();
      change = change.setNodeByKey(node.key, {
        data: {
          src: node.data.get("src"),
          style: {
            ...node.data.toJS().style,
            float: "right",
          },
        },
      });
      change = change.deselect().blur();
      editor.onChange(change);
    };
    // @ts-ignore
    const setNoFloat = (e: any) => {
      e.preventDefault();
      let change = editor.state.value.change();
      const { float, ...otherAttrs } = node.data.toJS().style;
      change = change.setNodeByKey(node.key, {
        data: {
          src: node.data.get("src"),
          style: {
            ...otherAttrs,
            display: "inline-block",
          },
        },
      });
      change = change.deselect().blur();
      editor.onChange(change);
    };

    const changeImg: any = (width: number, height: number) => {
      let change = editor.state.value.change();
      change = change.setNodeByKey(node.key, {
        data: {
          src: node.data.get("src"),
          style: {
            ...node.data.toJS().style,
            display: "inline-block",
            width: `${width}px`,
            height: `${height}px`,
          },
        },
      });
      editor.onChange(change, "qst");
    };

    const ImageNode = (
      <img
        onContextMenu={handleClickImg}
        src={src}
        className={className}
        {...{ style }}
        {...attributes}
        alt=""
      />
    );
    return (
      <ResizeBox
        isSelected={
          isSelected &&
          editor.state.value.selection.anchorKey ==
            editor.state.value.selection.focusKey
        }
        {...{ style }}
        src={src}
        onChange={changeImg}
        {...props}
        editor={editor}
      >
        {node.data.get("align") ? (
          <div style={{ textAlign: node.data.get("align") }}>{ImageNode}</div>
        ) : (
          ImageNode
        )}
      </ResizeBox>
    );
  },
};

export default imagePlugin;
