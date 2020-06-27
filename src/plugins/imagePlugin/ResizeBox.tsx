import * as React from "react";
import { debounce } from "lodash-es";
import { findDOMNode } from "react-dom";
import "./style.less";

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

export default ResizeBox;
