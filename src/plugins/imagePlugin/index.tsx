import * as React from "react";
import EditorPlugin from "../../interfaces/pluginInterface";
import getAttr from "../../utils/getAttr";
import { AST } from "parse5";
import getStyleFromString from "../../utils/getStyleFromString";
import ResizeBox from "./ResizeBox";

const imagePlugin: EditorPlugin = {
  type: "node",
  nodeType: "image",
  object: "inline",
  schema: {
    isVoid: true,
  },
  importer(el: AST.Default.Element, next: Function): any {
    if (el.tagName.toLowerCase() === "img") {
      const tempStyle = getAttr(el.attrs, "style");
      const isformula = getAttr(el.attrs, "data-isformula");
      const maxHeight = getAttr(el.attrs, "data-max-height");
      const height = getAttr(el.attrs, "height");

      let style = getStyleFromString(tempStyle);
      if (!style) {
        style = {};
      }
      style.display = "inline-block";
      if (maxHeight) {
        style.height = `${maxHeight}px`;
      } else if (!maxHeight && height) {
        style.height = `${height}px`;
      }
      const data: any = {
        src: getAttr(el.attrs, "src"),
        style,
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
        data,
      };
    }
  },
  exporter(node: any, children: any) {
    let { style, ...otherAttrs } = node.data.toJS();
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
    let image: any;
    // @ts-ignore
    const handleClickImg = (e: any) => {
      e.preventDefault();
      e.persist();
      if (editor.props.readOnly) {
        return;
      }
      const nodeKey = e.target.dataset.key;
      image = document.querySelector(`img[data-key='${node.key}']`);
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
      >
        <img
          onContextMenu={handleClickImg}
          src={src}
          className={className}
          {...{ style }}
          {...attributes}
          alt=""
        />
      </ResizeBox>
    );
  },
};

export default imagePlugin;
