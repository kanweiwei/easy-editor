import * as React from "react";
import { createPortal } from "react-dom";
import "./style.less";
import EditorTooltip from "../../toolbar/tooltip";
import classnames from "classnames";
import { Block, Inline } from "@zykj/slate";
import { pick, omit } from "lodash-es";

type ImageMenuProps = {
  node: any;
  value: any;
  editor: any;
};

const ImageMenu = React.forwardRef((props: ImageMenuProps, ref) => {
  const domRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => domRef.current);
  const { node, value, editor } = props;

  const style = node.data.get("style");
  let position = "around";
  if (style && "float" in style) {
    position = style.float;
  }

  const setFloat = (to: string) => {
    if (position === to) return;
    const change = value.change();
    const style = node.data.get("style");
    style.float = to;

    if (to == "around") {
      delete style.float;
    }

    change.setNodeByKey(node.key, {
      data: {
        ...node.data.toJS(),
        style,
      },
    });
    editor.update(change);
  };

  const setAlign = (to: string) => {
    const change = value.change();
    change.setNodeByKey(node.key, {
      data: {
        ...node.data.toJS(),
        align: to,
      },
    });
    editor.update(change);
  };

  const handleSetBlock = () => {
    const change = value.change();
    change.removeNodeByKey(node.key);
    const style = Object.assign({}, node.data.get("style") || {});
    delete style.float;
    change.insertBlock(
      Block.create({
        type: "image",
        data: {
          ...node.data.toJS(),
          style,
        },
        isVoid: true,
      })
    );
    editor.update(change);
  };

  const handleSetInline = () => {
    const change = value.change();
    change.removeNodeByKey(node.key);
    const data = node.data.toJS();
    delete data.align;
    change.insertInline(
      Inline.create({
        type: "image",
        data: data,
        isVoid: true,
      })
    );
    editor.update(change);
  };

  const renderFloatBtn = (display: "inline" | "block") => {
    if (display === "inline") {
      return (
        <>
          <EditorTooltip placeholder="文字右环绕">
            <span
              className={classnames("float-btn image-left", {
                active: position === "left",
              })}
              onClick={() => setFloat("left")}
            ></span>
          </EditorTooltip>
          <EditorTooltip placeholder="文字左环绕">
            <span
              className={classnames("float-btn image-right", {
                active: position === "right",
              })}
              onClick={() => setFloat("right")}
            ></span>
          </EditorTooltip>
          <EditorTooltip placeholder="文字紧密环绕">
            <span
              className={classnames("float-btn image-around", {
                active: position === "around",
              })}
              onClick={() => setFloat("around")}
            ></span>
          </EditorTooltip>
        </>
      );
    }
    if (display === "block") {
      const align = props.node.data.get("align") || "left";
      return (
        <>
          <EditorTooltip placeholder="图片居左">
            <span
              className={classnames("float-btn image-left", {
                active: align === "left",
              })}
              onClick={() => setAlign("left")}
            ></span>
          </EditorTooltip>
          <EditorTooltip placeholder="图片居中">
            <span
              className={classnames("float-btn image-around", {
                active: align === "center",
              })}
              onClick={() => setAlign("center")}
            ></span>
          </EditorTooltip>
          <EditorTooltip placeholder="图片居右">
            <span
              className={classnames("float-btn image-right", {
                active: align === "right",
              })}
              onClick={() => setAlign("right")}
            ></span>
          </EditorTooltip>
        </>
      );
    }
    return null;
  };

  let display: "inline" | "block" = "inline";
  if (node.object === "block") {
    display = "block";
  }

  return createPortal(
    <div
      ref={domRef}
      onClick={(e) => e.stopPropagation()}
      className="image-edit-toolbar"
    >
      <EditorTooltip placeholder="嵌入行内">
        <span
          className={classnames("ic_image_inline", {
            active: display === "inline",
          })}
          onClick={handleSetInline}
        ></span>
      </EditorTooltip>
      <EditorTooltip placeholder="独占一行">
        <span
          className={classnames("ic_image_block", {
            active: display === "block",
          })}
          onClick={handleSetBlock}
        ></span>
      </EditorTooltip>
      <span className="image-menu-divider"></span>
      {renderFloatBtn(display)}
    </div>,
    document.body
  );
});

function ResizeBox(props: any) {
  const { children, isSelected, style, onChange } = props;
  const { float } = style;
  const align = props.node.data.get("align");
  const alignRef = React.useRef(align);
  const floatRef = React.useRef(float);

  const rootDomRef = React.useRef<HTMLElement & { align: any }>(null);

  const target = React.useRef<HTMLSpanElement | null>(null);

  const wh = React.useRef({ width: 0, height: 0, left: 0 });
  const originWh = React.useRef({ width: 0, height: 0, left: 0 });

  const updateWH = React.useCallback(
    (options: { width: number; height: number }) => {
      if (onChange) {
        onChange(options.width, options.height);
      }
      originWh.current = { ...wh.current };
    },
    [onChange]
  );

  const menuRef = React.useRef<HTMLDivElement>();

  const updateMenuDom = React.useCallback(() => {
    if (!rootDomRef.current) return;
    const { width, height, left, top } = rootDomRef.current
      ?.querySelector(".resize-container img")
      ?.getBoundingClientRect() ?? { width: 0, height: 0, left: 0, top: 0 };
    const menuDom = menuRef.current;
    if (!menuDom) {
      return;
    }
    let tmpStyle = `position: fixed; top: ${
      document.documentElement.scrollTop + top + height + 8
    }px;  border-radius: 4px; padding: 5px 8px; line-height: 30px; height: 30px; box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px; background: #fff;`;
    if (float === "right" || props.node.data.get("align") == "right") {
      tmpStyle += `right: ${
        document.documentElement.clientWidth - (left + width)
      }px;`;
    } else {
      tmpStyle += `left: ${document.documentElement.scrollLeft + left}px;`;
    }
    menuDom.setAttribute("style", tmpStyle);
  }, [float, props.node.data]);

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (rootDomRef.current) {
      if (
        !imgRef.current ||
        imgRef.current.src !== props.src ||
        floatRef.current !== float ||
        alignRef.current !== align
      ) {
        imgRef.current = new Image();
        imgRef.current.src = props.src;
        imgRef.current.onload = () => {
          if (rootDomRef.current) {
            const { width, height, left } = rootDomRef.current
              .querySelector("img")
              ?.getBoundingClientRect() ?? { width: 0, height: 0, left: 0 };
            wh.current = {
              width,
              height,
              left,
            };
            originWh.current = {
              width,
              height,
              left,
            };
            floatRef.current = float;
            alignRef.current = align;
            updateWH(wh.current);
          }
        };
      } else {
        if (rootDomRef.current) {
          const { width, height, left } = rootDomRef.current
            .querySelector("img")
            ?.getBoundingClientRect() ?? { width: 0, height: 0, left: 0 };
          wh.current = {
            width,
            height,
            left,
          };
          originWh.current = {
            width,
            height,
            left,
          };
          floatRef.current = float;
          alignRef.current = align;
        }
      }
    }
  }, [props.src, updateWH, float, align]);

  // imageEditor.style.right = "0px";
  let styleLeft = "left";
  let styleTop = "top";
  let styleRight = "right";
  if (float || align) {
    styleLeft = "marginLeft";
    styleTop = "marginTop";
    styleRight = "marginRight";
  }

  //渲染完，检查调整框和图片的位置是否一致
  const checkResizeWrapperPosition = React.useCallback(() => {
    const image = rootDomRef.current?.querySelector("img");
    const resizeWrapper = rootDomRef.current?.querySelector<HTMLSpanElement>(
      ".resize-container"
    );
    if (!image || !resizeWrapper) return;
    const imageRect = image.getBoundingClientRect();
    const resizeWrapperRect = resizeWrapper.getBoundingClientRect();
    if (
      imageRect.left !== resizeWrapperRect.left ||
      imageRect.top !== resizeWrapperRect.top ||
      imageRect.right !== resizeWrapperRect.right
    ) {
      resizeWrapper.style.margin = "0 0 0 0";
      switch (float || align) {
        case "left":
          resizeWrapper.style.left = "0px";
          resizeWrapper.style.right = "auto";
          resizeWrapper.style.top = "0px";
          break;
        case "right":
          resizeWrapper.style.left = "auto";
          resizeWrapper.style.right = "0px";
          resizeWrapper.style.top = "0px";
          break;
        default:
          resizeWrapper.style.left = "0px";
          resizeWrapper.style.top = "0px";
          break;
      }

      wh.current = pick(imageRect, ["width", "height", "left"]);
      originWh.current = { ...wh.current };
    }
  }, [align, float]);

  React.useEffect(() => {
    checkResizeWrapperPosition();
    updateMenuDom();
  });

  const resizing = (e: any) => {
    const $container: any = rootDomRef.current?.querySelector(
      ".resize-container img"
    );
    const mouse: any = {};
    const resizeWrapper = rootDomRef.current?.querySelector<HTMLSpanElement>(
      ".resize-container"
    );
    if (!resizeWrapper) return;
    let { width, height, left } = originWh.current;
    mouse.x =
      ((e.touches && e.touches[0].clientX) || e.clientX || e.pageX) +
      (document?.documentElement.scrollLeft ?? 0);
    mouse.y =
      ((e.touches && e.touches[0].clientY) || e.clientY || e.pageY) +
      (document?.documentElement.scrollTop ?? 0);
    const cur = target.current;
    if (!cur) return;
    if (!rootDomRef.current) return;
    const imageEditor = rootDomRef.current?.querySelector<HTMLSpanElement>(
      ".image-editor"
    );

    if (!imageEditor) return;
    if (cur.className.indexOf("resize-handle-se") > -1) {
      // 右下角
      width = mouse.x - left;
      height = (width / originWh.current.height) * originWh.current.height;
      imageEditor.style.left = "0px";
      imageEditor.style.right = "auto";
      if (align === "right") {
        resizeWrapper.style["margin-right"] =
          width >= originWh.current.width
            ? `-${width - originWh.current.width}px`
            : `${originWh.current.width - width}px`;
        resizeWrapper.style["styleTop"] =
          height >= originWh.current.height
            ? `${height - originWh.current.height}px`
            : `-${originWh.current.height - height}px`;
      }
    } else if (cur.className.indexOf("resize-handle-sw") > -1) {
      // 左下角
      width -= mouse.x - left;
      left = mouse.x;
      height = (width / wh.current.width) * wh.current.height;

      if (align !== "center") {
        resizeWrapper.style[styleLeft] =
          width >= originWh.current.width
            ? `-${width - originWh.current.width}px`
            : `${originWh.current.width - width}px`;
      }
    } else if (cur.className.indexOf("resize-handle-nw") > -1) {
      // 左上角
      width = width - (mouse.x - left);
      height = (width / wh.current.width) * wh.current.height;
      if (align !== "center") {
        resizeWrapper.style[styleLeft] =
          width >= originWh.current.width
            ? `-${width - originWh.current.width}px`
            : `${originWh.current.width - width}px`;
        resizeWrapper.style[styleTop] =
          height >= originWh.current.height
            ? `-${height - originWh.current.height}px`
            : `${originWh.current.height - height}px`;
      }
    } else if (cur.className.indexOf("resize-handle-ne") > -1) {
      // 右上角
      width = mouse.x - left;
      height = (width / originWh.current.width) * originWh.current.height;
      if (align !== "center") {
        resizeWrapper.style[styleRight] =
          width >= originWh.current.width
            ? `-${width - originWh.current.width}px`
            : `${originWh.current.width - width}px`;
        resizeWrapper.style[styleTop] =
          height >= originWh.current.height
            ? `-${height - originWh.current.height}px`
            : `${originWh.current.height - height}px`;
      }
    }

    $container.style.width = `${width}px`;
    $container.style.height = `${height}px`;

    if (resizeWrapper) {
      resizeWrapper.style.width = `${width}px`;
      resizeWrapper.style.height = `${height}px`;
    }
    imageEditor.style.width = `${width}px`;
    imageEditor.style.height = `${height}px`;
    if ((float && float === "right") || align == "right") {
      left += originWh.current.width - width;
    }
    if (align == "center") {
      left += (originWh.current.width - width) / 2;
    }

    wh.current = {
      width,
      height,
      left,
    };
  };

  const endResize = (e: any) => {
    e.preventDefault();
    window.removeEventListener("mousemove", resizing);
    window.removeEventListener("mouseup", endResize);
    updateWH(wh.current);
  };

  const startResize = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    target.current = e.target;
    window.addEventListener("mousemove", resizing);
    window.addEventListener("mouseup", endResize);
  };

  const attrs: any = {};
  if (float) {
    attrs.onMouseDown = startResize;
  }

  const Wrapper = props.node.object === "inline" ? "span" : "div";
  const wrapperStyle: React.CSSProperties =
    props.node.object === "inline"
      ? { display: "inline-block" }
      : { display: "block" };
  if (props.node.data.get("align")) {
    wrapperStyle.textAlign = props.node.data.get("align");
  }

  const resizeContainerStyle = { ...style };

  if (props.node.data.get("align")) {
    const align = props.node.data.get("align");
    if (align === "right") {
      resizeContainerStyle.right = "0px";
      resizeContainerStyle.left = "auto";
    }
    if (align === "center") {
      resizeContainerStyle.left = "50%";
      resizeContainerStyle.right = "auto";
      resizeContainerStyle.transform = "translate(-50%, 0)";
    }
  }

  const imageEditorStyle = omit(resizeContainerStyle, [
    "transform",
    "left",
    "right",
  ]);

  if (isSelected) {
    if (!float) {
      return (
        <Wrapper
          className="image-editor-wrapper"
          style={wrapperStyle}
          ref={rootDomRef}
        >
          {children}
          <span
            className="resize-container"
            {...{ style: resizeContainerStyle }}
          >
            <span
              className="resize-handle resize-handle-ne active"
              onMouseDown={startResize}
            />
            <span
              className="resize-handle resize-handle-nw active"
              onMouseDown={startResize}
            />

            <span
              className="resize-handle resize-handle-se active"
              onMouseDown={startResize}
            />
            <span
              className="resize-handle resize-handle-sw active"
              onMouseDown={startResize}
            />
            <span className="image-editor" draggable style={imageEditorStyle}>
              <img src={props.src} />
            </span>
            <ImageMenu
              ref={menuRef}
              value={props.editor.state.value}
              node={props.node}
              editor={props.editor}
            />
          </span>
        </Wrapper>
      );
    }
    return (
      <Wrapper
        className="image-editor-wrapper"
        ref={rootDomRef}
        style={{ float }}
      >
        {children}
        <span className="resize-container" {...{ style: resizeContainerStyle }}>
          <span
            className="resize-handle resize-handle-ne active"
            onMouseDown={startResize}
          />
          <span
            className="resize-handle resize-handle-nw active"
            onMouseDown={startResize}
          />
          <span
            className="resize-handle resize-handle-se active"
            onMouseDown={startResize}
          />
          <span
            className="resize-handle resize-handle-sw active"
            onMouseDown={startResize}
          />
          <span className="image-editor" draggable style={imageEditorStyle}>
            <img src={props.src} />
          </span>
          <ImageMenu
            ref={menuRef}
            value={props.editor.state.value}
            node={props.node}
            editor={props.editor}
          />
        </span>
      </Wrapper>
    );
  }
  return <>{children}</>;
}

export default ResizeBox;
