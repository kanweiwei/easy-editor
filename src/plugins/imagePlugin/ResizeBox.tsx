import * as React from "react";
import { debounce } from "lodash-es";
import { findDOMNode, createPortal } from "react-dom";
import "./style.less";

function ImageMenu(props: any) {
  console.log("menu porps =>>>", props);
  if (props.container) {
    return createPortal(<div>菜单</div>, props.container);
  }
  return null;
}

function ResizeBox(props: any) {
  const rootDomRef = React.useRef<HTMLSpanElement>(null);

  const target = React.useRef<HTMLSpanElement>(null);

  const editorDom = React.useRef();

  const debouncedChange = debounce((width: number, height: number) => {
    if (props.onChange) {
      props.onChange(width, height);
    }
  }, 200);

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
    if (cur.className.indexOf("resize-handle-se") > -1) {
      width = mouse.x - left;
      height = (width / originWidth) * originHeight;
    } else if (cur.className.indexOf("resize-handle-sw") > -1) {
      width -= mouse.x - left;
      height = (width / originWidth) * originHeight;
      left = mouse.x;
    } else if (cur.className.indexOf("resize-handle-nw") > -1) {
      width -= mouse.x - left;
      height = (width / originWidth) * originHeight;
      left = mouse.x;
      top = mouse.y;
    } else if (cur.className.indexOf("resize-handle-ne") > -1) {
      width = mouse.x - left;
      height = (width / originWidth) * originHeight;
      top = mouse.y;
    }

    width =
      width >= editorDom.current.offsetWidth
        ? editorDom.current.offsetWidth
        : width;
    $container.style.width = `${width}px`;
    $container.style.height = `${height}px`;
    const img: any = $container.querySelector("img");
    if (img) {
      img.style.width = `${width}px`;
      img.style.height = `${height}px`;
    }
    debouncedChange(width, height);
  };

  const endResize = (e: any) => {
    e.preventDefault();
    window.removeEventListener("mousemove", resizing);
    window.removeEventListener("mouseup", endResize);
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
        <span className="resize-container" ref={rootDomRef} {...{ style }}>
          <span
            className="resize-handle resize-handle-ne active"
            onMouseDown={startResize}
          />
          <span className="resize-handle resize-handle-nw" />
          {children}
          <span
            className="resize-handle resize-handle-se active"
            onMouseDown={startResize}
          />
          <span className="resize-handle resize-handle-sw" />
          <ImageMenu ref={menuRef} />
        </span>
      );
    }
    return (
      <span className="resize-container" ref={rootDomRef} {...{ style }}>
        <span className="resize-handle resize-handle-ne" />
        <span
          className="resize-handle resize-handle-nw active"
          onMouseDown={startResize}
        />
        {children}
        <span className="resize-handle resize-handle-se" />
        <span
          className="resize-handle resize-handle-sw active"
          onMouseDown={startResize}
        />
        <ImageMenu ref={menuRef} />
      </span>
    );
  }
  return <>{children}</>;
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

  render() {}
}

export default ResizeBox;
