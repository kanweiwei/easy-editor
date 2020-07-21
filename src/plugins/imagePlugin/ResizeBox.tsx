import * as React from "react";
import { createPortal } from "react-dom";
import "./style.less";
import EditorTooltip from "../../toolbar/tooltip";
import classnames from "classnames";
import { Block, Inline } from "@zykj/slate";

const ImageMenu = React.forwardRef((props: any, ref) => {
  console.log(props.value, props.node);
  const domRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => domRef.current);
  const { node, value, editor } = props;

  const style = node.data.get("style");
  let position: string = "around";
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
    let data = node.data.toJS();
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
  const { children, isSelected, style } = props;
  const { float } = style;

  const rootDomRef = React.useRef<HTMLElement & { align: any }>(null);

  const target = React.useRef<HTMLSpanElement | null>(null);

  const updateWH = (options: { width: number; height: number }) => {
    if (props.onChange) {
      props.onChange(options.width, options.height);
    }
  };

  const menuRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (!rootDomRef.current) return;
    const { width, height, left, top } = rootDomRef.current
      .querySelector(".resize-container img")
      ?.getBoundingClientRect()!;
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
    // @ts-ignore
    menuDom.style = tmpStyle;
  });

  const wh = React.useRef({ width: 0, height: 0 });

  React.useEffect(() => {
    if (rootDomRef.current) {
      const img = new Image();
      img.src = props.src;
      img.onload = () => {
        if (rootDomRef.current) {
          let { width, height } = rootDomRef.current
            .querySelector("img")
            ?.getBoundingClientRect()!;
          wh.current = {
            width,
            height,
          };
          updateWH(wh.current);
        }
      };
    }
  }, []);

  const resizing = (e: any) => {
    const $container: any = rootDomRef.current?.querySelector(
      ".resize-container img"
    );
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
    const cur = target.current;
    if (!cur) return;
    const imageEditor = rootDomRef.current?.querySelector<HTMLSpanElement>(
      ".image-editor"
    );

    if (!imageEditor) return;
    if (cur.className.indexOf("resize-handle-se") > -1) {
      width = mouse.x - left;
      height = (width / originWidth) * originHeight;
      imageEditor.style.left = "0px";
      imageEditor.style.right = "auto";
    } else if (cur.className.indexOf("resize-handle-sw") > -1) {
      width -= mouse.x - left;
      height = (width / originWidth) * originHeight;
      left = mouse.x;
      imageEditor.style.right = "0px";
      imageEditor.style.left = "auto";
    } else if (cur.className.indexOf("resize-handle-nw") > -1) {
      width -= mouse.x - left;
      height = (width / originWidth) * originHeight;
      left = mouse.x;
      top = mouse.y;
      imageEditor.style.right = "0px";
      imageEditor.style.left = "auto";
    } else if (cur.className.indexOf("resize-handle-ne") > -1) {
      width = mouse.x - left;
      height = (width / originWidth) * originHeight;
      top = mouse.y;
      imageEditor.style.left = "0px";
      imageEditor.style.right = "auto";
    }

    $container.style.width = `${width}px`;
    $container.style.height = `${height}px`;
    const resizeWrapper = rootDomRef.current?.querySelector<HTMLSpanElement>(
      ".resize-container"
    );
    if (resizeWrapper) {
      resizeWrapper.style.width = `${width}px`;
      resizeWrapper.style.height = `${height}px`;
    }
    imageEditor.style.width = `${width}px`;
    imageEditor.style.height = `${height}px`;
    wh.current = {
      width,
      height,
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
  let wrapperStyle: React.CSSProperties =
    props.node.object === "inline"
      ? { display: "inline-block" }
      : { display: "block" };
  if (props.node.data.get("align")) {
    wrapperStyle.textAlign = props.node.data.get("align");
  }

  let imageEditorStyle = { ...style };
  if (props.node.data.get("align")) {
    const align = props.node.data.get("align");
    if (align === "right") {
      imageEditorStyle.right = "0px";
      imageEditorStyle.left = "auto";
    }
    if (align === "center") {
      imageEditorStyle.left = "50%";
      imageEditorStyle.right = "auto";
      imageEditorStyle.transform = "translate(-50%, 0)";
    }
  }

  if (isSelected) {
    if (!float) {
      return (
        <Wrapper
          className="image-editor-wrapper"
          style={wrapperStyle}
          ref={rootDomRef}
        >
          {children}
          <span className="resize-container" {...{ style: imageEditorStyle }}>
            <span
              className="resize-handle resize-handle-ne active"
              onMouseDown={startResize}
            />
            <span className="resize-handle resize-handle-nw" />

            <span
              className="resize-handle resize-handle-se active"
              onMouseDown={startResize}
            />
            <span className="resize-handle resize-handle-sw" />
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
        <span className="resize-container" {...{ style: imageEditorStyle }}>
          <span className="resize-handle resize-handle-ne" />
          <span
            className="resize-handle resize-handle-nw active"
            onMouseDown={startResize}
          />
          <span className="resize-handle resize-handle-se" />
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
