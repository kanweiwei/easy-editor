import * as React from "react";
import EditorPlugin from "../../interfaces/pluginInterface";
import getAttr from "../../utils/getAttr";
import { AST } from "parse5";
import getStyleFromString from "../../utils/getStyleFromString";
import ContextMenu from "../../hoverMenu/contextMenu";
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
    const isformula = node.data.get("data-isformula");
    const maxHeight = node.data.get("data-max-height");
    let onload: any;
    if (isformula) {
      onload = (e: any) => {
        e.target.style.display = "inline-block";
        if (maxHeight) {
          e.target.style.height = `${maxHeight}px`;
        }
        let change = editor.state.value.change();
        const data: any = {
          ...node.data.toJS(),
          src: node.data.get("src"),
          style: {
            ...node.data.toJS().style,
            display: "inline-block",
          },
        };
        if (maxHeight) {
          data.style.height = `${maxHeight}px`;
        }
        change = change.setNodeByKey(node.key, {
          data,
        });
        editor.onChange(change);
      };
    }
    const className = isSelected ? "active" : null;
    let style: any = { display: "inline-block" };
    if (node.data.get("style")) {
      style = Object.assign(style, node.data.get("style"));
    }
    let image: any;
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
      setTimeout(() => {
        const menu: any = document.querySelector("#context-menu");
        // todo 菜单显示位置
        if (menu && image) {
          menu.style.opacity = 1;
          menu.style.top = `${
            e.clientY + (document as any).documentElement.scrollTop
          }px`;
          let left =
            e.clientX + (document as any).documentElement.scrollLeft + 20;
          if (left <= 0) {
            left = 60;
          }

          menu.style.left = `${left}px`;
        }
      }, 0);
    };

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
      editor.onChange(change, "move-img");
      const menu: any = document.querySelector("#context-menu");
      menu.style.opacity = 0;
    };

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
      editor.onChange(change, "move-img");
      const menu: any = document.querySelector("#context-menu");
      menu.style.opacity = 0;
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
    // @ts-ignore
    let imgForm: any;

    return (
      <span contentEditable={false}>
        <ContextMenu {...props}>
          <div onMouseDown={setFloatRight}>靠右环绕</div>
          <div onMouseDown={setNoFloat}>清除环绕</div>
          {/* 
              <ButtonModal
                button={{
                  text: '调整图片属性',
                }}
                modal={{
                  onCancel: () => {
                    let menu: any = document.querySelector('#context-menu');
                    menu!.style!.opacity = 0;
                  },
                  onOk: () => {
                    let errs: any, values: any;
                    imgForm!.validateFields((err: any, v: any) => {
                      if (err) {
                        errs = err;
                      }
                      values = v;
                    });
                    if (errs) {
                      message.info('检查表单');
                    }
                    let change: any = self.state.value.change();
                    change = change.setNodeByKey(node.key, {
                      data: {
                        src: values.src,
                        style: {
                          ...node!.data.toJS().style,
                          display: 'inline-block',
                          width: Number(values.width),
                          height: Number(values.height),
                        },
                      },
                    });
                    self.onChange(change, 'qst');
                    let menu: any = document.querySelector('#context-menu');
                    menu!.style.opacity = 0;
                    return true;
                  },
                }}
              >
                <ImgAttrsForm ref={(n: any) => (imgForm = n)} node={node} onload={onload} />
              </ButtonModal>
            */}
        </ContextMenu>
        <ResizeBox isSelected={isSelected} {...{ style }} onChange={changeImg}>
          <img
            onContextMenu={handleClickImg}
            src={src}
            className={className}
            {...{ style }}
            {...attributes}
            onLoad={onload}
            alt=""
          />
        </ResizeBox>
      </span>
    );
  },
};

export default imagePlugin;
