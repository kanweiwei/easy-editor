import { assign, debounce } from "lodash-es";
import * as React from "react";
import { findDOMNode } from "react-dom";
import ContextMenu from "./hoverMenu/contextMenu";
import { getStyleFromData } from "./htmlSerialize";

/**
 * nodes
 */
function ParagraphNode(props: any) {
  return (
    <p {...props.attributes} style={props.style} className={props.className}>
      {props.children}
    </p>
  );
}

function SpanNode(props: any) {
  let { style, className, ...otherAttrs } = props.node.data.toJS();
  style = getStyleFromData(props.node);
  return (
    <span
      {...props.attributes}
      {...otherAttrs}
      style={style}
      className={className}
    >
      {props.children}
    </span>
  );
}

/**
 * placeholder
 */
export function renderPlaceholder(
  text: string,
  tips: string,
  { style }: any = {}
) {
  if (!text || (text.length === 1 && text.charCodeAt(0) === 8203)) {
    style = assign({}, style);
    return (
      <div className="description_placeholder" style={style}>
        {tips}
      </div>
    );
  }
  return null;
}

class ResizeBox extends React.Component<any, any> {
  public rootDom: any;

  public target: any;

  public editorDom: any;

  public debouncedChange = debounce((width: number, height: number) => {
    if (this.props.onChange) {
      this.props.onChange(width, height);
    }
  }, 200);

  public startResize = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.target = e.target;
    window.addEventListener("mousemove", this.resizing);
    window.addEventListener("mouseup", this.endResize);
  };

  public endResize = (e: any) => {
    e.preventDefault();
    window.removeEventListener("mousemove", this.resizing);
    window.removeEventListener("mouseup", this.endResize);
  };

  findParentBlockDom = (child: any) => {
    while ((child = child.parentNode)) {
      if ((child.tagName as String).toLowerCase() === "div") {
        return child;
      }
    }
  };

  public resizing = (e: any) => {
    const $container: any = findDOMNode(this);
    const mouse: any = {};
    let { width, height, left } = $container.getBoundingClientRect();
    const originWidth = width;
    const originHeight = height;
    mouse.x =
      ((e.touches && e.touches[0].clientX) || e.clientX || e.pageX) +
      document!.documentElement.scrollLeft;
    mouse.y =
      ((e.touches && e.touches[0].clientY) || e.clientY || e.pageY) +
      document!.documentElement.scrollTop;
    if (this.target.className.indexOf("resize-handle-se") > -1) {
      width = mouse.x - left;
      height = (width / originWidth) * originHeight;
    } else if (this.target.className.indexOf("resize-handle-sw") > -1) {
      width -= mouse.x - left;
      height = (width / originWidth) * originHeight;
      left = mouse.x;
    } else if (this.target.className.indexOf("resize-handle-nw") > -1) {
      width -= mouse.x - left;
      height = (width / originWidth) * originHeight;
      left = mouse.x;
      top = mouse.y;
    } else if (this.target.className.indexOf("resize-handle-ne") > -1) {
      width = mouse.x - left;
      height = (width / originWidth) * originHeight;
      top = mouse.y;
    }
    width =
      width >= this.editorDom.offsetWidth ? this.editorDom.offsetWidth : width;
    $container.style.width = `${width}px`;
    $container.style.height = `${height}px`;
    const img: any = $container.querySelector("img");
    if (img) {
      img.style.width = `${width}px`;
      img.style.height = `${height}px`;
    }
    this.debouncedChange(width, height);
  };

  componentDidMount() {
    this.editorDom = this.findParentBlockDom(findDOMNode(this));
  }

  render() {
    const { children, isSelected, style } = this.props;
    const { float } = style;
    const attrs: any = {};
    if (float) {
      attrs.onMouseDown = this.startResize;
    }
    if (isSelected) {
      if (!float) {
        return (
          <span
            className="resize-container"
            ref={(n: any) => (this.rootDom = n)}
            {...{ style }}
          >
            <span
              className="resize-handle resize-handle-ne active"
              onMouseDown={this.startResize}
            />
            <span className="resize-handle resize-handle-nw" />
            {children}
            <span
              className="resize-handle resize-handle-se active"
              onMouseDown={this.startResize}
            />
            <span className="resize-handle resize-handle-sw" />
          </span>
        );
      }
      return (
        <span
          className="resize-container"
          ref={(n: any) => (this.rootDom = n)}
          {...{ style }}
        >
          <span className="resize-handle resize-handle-ne" />
          <span
            className="resize-handle resize-handle-nw active"
            onMouseDown={this.startResize}
          />
          {children}
          <span className="resize-handle resize-handle-se" />
          <span
            className="resize-handle resize-handle-sw active"
            onMouseDown={this.startResize}
          />
        </span>
      );
    }
    return <>{children}</>;
  }
}

export default (props: any, self: any): any => {
  const { attributes, children, node, isSelected } = props;
  switch (node.type) {
    case "div": {
      let { style, className, ...otherAttrs }: any = node.data.toJS();
      style = getStyleFromData(node);
      return (
        <div
          {...props.attributes}
          {...otherAttrs}
          style={style}
          className={className}
        >
          {children}
        </div>
      );
    }
    case "paragraph": {
      const style: any = getStyleFromData(node);
      const { className } = node.data.toJS();
      return <ParagraphNode {...props} style={style} className={className} />;
    }
    case "span":
      return <SpanNode {...props} />;
    case "ruby": {
      return <ruby {...props.attributes}>{props.children}</ruby>;
    }
    case "rp":
      return <rp>{props.children}</rp>;
    case "rt":
      return <rt>{props.children}</rt>;
    case "image": {
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
          let change = self.state.value.change();
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
          self.onChange(change);
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
        if (self.props.readOnly) {
          return;
        }
        const nodeKey = e.target.dataset.key;
        image = document.querySelector(`img[data-key='${node.key}']`);
        if (nodeKey) {
          let change: any = self.state.value.change();
          const targetNode: any = change.value.document.findDescendant(
            (item: any) => {
              return item.key === nodeKey;
            }
          );
          if (!targetNode) {
            return;
          }
          change = change.moveToRangeOfNode(targetNode);
          self.onChange(change);
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
        let change = self.state.value.change();
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
        self.onChange(change, "move-img");
        const menu: any = document.querySelector("#context-menu");
        menu.style.opacity = 0;
      };

      const setNoFloat = (e: any) => {
        e.preventDefault();
        let change = self.state.value.change();
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
        self.onChange(change, "move-img");
        const menu: any = document.querySelector("#context-menu");
        menu.style.opacity = 0;
      };

      const changeImg: any = (width: number, height: number) => {
        let change = self.state.value.change();
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
        // change = Value.fromJSON(change.value.toJSON()).change();
        self.onChange(change, "qst");
      };
      // @ts-ignore
      let imgForm: any;

      return (
        <span contentEditable={false}>
          <ContextMenu {...props}>
            <ul>
              <li>
                <span onMouseDown={setFloatRight}>靠右环绕</span>
              </li>
              <li>
                <span onMouseDown={setNoFloat}>清除环绕</span>
              </li>
              {/* <li>
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
              </li> */}
            </ul>
          </ContextMenu>
          <ResizeBox
            isSelected={isSelected}
            {...{ style }}
            onChange={changeImg}
          >
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
    }
    case "table-body": {
      let { style, className, ...otherAttrs } = node.data.toJS();
      style = getStyleFromData(node);
      return (
        <tbody
          {...attributes}
          {...otherAttrs}
          style={style}
          className={className}
        >
          {children}
        </tbody>
      );
    }
    case "table-row": {
      let { style, className, ...otherAttrs } = node.data.toJS();
      style = getStyleFromData(node);
      return (
        <tr {...attributes} {...otherAttrs} style={style} className={className}>
          {children}
        </tr>
      );
    }
    case "table-cell": {
      let { style, className, ...otherAttrs } = node.data.toJS();
      style = getStyleFromData(node);
      return (
        <td {...attributes} {...otherAttrs} style={style} className={className}>
          {children}
        </td>
      );
    }
    default:
      return null;
  }
};
