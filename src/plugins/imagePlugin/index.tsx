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
  importer(el: AST.Default.Element, next: (...args: any[]) => any): any {
    if (
      el.tagName.toLocaleLowerCase() === "div" &&
      getAttr(el.attrs, "data-type") === "image-block"
    ) {
      const imgNode = el.childNodes[0] as AST.Default.Element;
      const src = getAttr(imgNode.attrs, "src");
      const styleObj = getStyleFromString(getAttr(imgNode.attrs, "style"));
      const parentStyleObj = getStyleFromString(getAttr(el.attrs, "style"));
      const data: any = {
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

    const changeImg: any = (width: number, height: number) => {
      let change = editor.state.value.change();
      change = change.setNodeByKey(node.key, {
        data: {
          ...node.data.toJS(),
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
        {...{ style }}
        src={src}
        onChange={changeImg}
        {...props}
        editor={editor}
        isSelected={
          isSelected &&
          editor.state.value.selection.anchorKey ==
            editor.state.value.selection.focusKey
        }
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
