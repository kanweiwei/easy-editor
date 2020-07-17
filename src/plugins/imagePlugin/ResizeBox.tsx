import * as React from "react";
import { createPortal } from "react-dom";
import "./style.less";

const ImageMenu = React.forwardRef((props: any, ref) => {
  if (props.container) {
    return createPortal(<div>菜单</div>, props.container);
  }
  return null;
});

function ResizeBox(props: any) {
  const rootDomRef = React.useRef<HTMLSpanElement>(null);

  const target = React.useRef<HTMLSpanElement | null>(null);

  const updateWH = (options: { width: number; height: number }) => {
    if (props.onChange) {
      props.onChange(options.width, options.height);
    }
  };

  const menuRef = React.useRef();

  const wh = React.useRef({ width: 0, height: 0 });

  React.useEffect(() => {
    if (rootDomRef.current) {
      const img = new Image();
      img.src = props.src;
      img.onload = () => {
        if (rootDomRef.current) {
          let { width, height } = rootDomRef.current.getBoundingClientRect();
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
    const $container: any = rootDomRef.current;
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

  const { children, isSelected, style } = props;
  const { float } = style;
  const attrs: any = {};
  if (float) {
    attrs.onMouseDown = startResize;
  }
  if (isSelected) {
    if (!float) {
      return (
        <span
          className="image-editor-wrapper"
          style={{ display: "inline-block" }}
          ref={rootDomRef}
        >
          {children}
          <span className="resize-container" {...{ style }}>
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
            <span className="image-editor" draggable style={style}>
              <img src={props.src} />
            </span>
            <ImageMenu ref={menuRef} />
          </span>
        </span>
      );
    }
    return (
      <span
        className="image-editor-wrapper"
        style={{ display: "inline-block" }}
        ref={rootDomRef}
      >
        {children}
        <span className="resize-container" {...{ style }}>
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
          <span className="image-editor" draggable style={style}>
            <img src={props.src} />
          </span>
          <ImageMenu ref={menuRef} />
        </span>
      </span>
    );
  }
  return <>{children}</>;
}

export default ResizeBox;
