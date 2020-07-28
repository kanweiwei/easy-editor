import { Value, Mark } from "@zykj/slate";
import classnames from "classnames";
import { omit } from "lodash-es";
import * as React from "react";
import ReactDOM from "react-dom";
import "./style.less";

class Menu extends React.Component<any, any> {
  // Check if the current selection has a mark with `type` in it.
  hasMark(type: string): boolean {
    const { value } = this.props;
    if (!value) {
      return false;
    }
    return value.activeMarks.some((mark: any) => mark.type === type);
  }

  // When a mark button is clicked, toggle the current mark.
  onClickMark = (event: any, type: string) => {
    const { value, onChange } = this.props;
    event.preventDefault();
    const change = value.change().toggleMark(type);
    onChange(change);
  };

  onClickBlock = (
    event: any,
    onClick?: (...args: any[]) => any,
    options: any = {}
  ) => {
    event.preventDefault();
    const { onChange, value } = this.props;
    let change = value.change();
    try {
      if (onClick) {
        change = change.call(onClick({ ...options }));

        change = Value.fromJSON(change.value.toJSON()).change();
        return onChange(change);
      }
    } catch (e) {
      change = change.blur();
      onChange(change);
    }
  };

  // Render a mark-toggling toolbar button.
  renderMarkButton = (type: string, icon: JSX.Element, title: string) => {
    const activeMarks = this.props.value.activeMarks.toArray();
    const isActive = activeMarks.some((m: Mark) => m.type == type);

    const onMouseDown = (event: any) => this.onClickMark(event, type);
    const btnClass = classnames({
      "tool-btn": true,
      isActive,
    });
    return (
      <span>
        <span className={btnClass} title={title} onMouseDown={onMouseDown}>
          {icon}
        </span>
      </span>
    );
  };

  renderBlockButton(
    type: string,
    icon: string,
    title: string,
    onClick?: () => any
  ) {
    const onMouseDown = (event: any) =>
      this.onClickBlock(event, onClick, { type });
    return (
      // eslint-disable-next-line react/jsx-no-bind
      <span onMouseDown={onMouseDown} title={title} key={type}>
        {icon}
      </span>
    );
  }

  renderIndentButton = (type: string, icon: string, title: string) => {
    const clickIndentButton = (e: any) => {
      e.preventDefault();
      const { onChange, value } = this.props;
      let change = value.change();
      const blocks: any = change.value.blocks;
      blocks.forEach((block: any) => {
        const originalData: any = block.get("data");
        const originStyle: any = originalData.get("style");
        if (!("textIndent" in originStyle)) {
          const data = block.data.set("style", {
            ...originStyle,
            textIndent: "2em",
          });
          change = change.setNodeByKey(block.key, {
            data,
          });
        } else {
          const style = omit(originStyle, ["textIndent"]);
          const data = block.data.set("style", style);
          change = change.setNodeByKey(block.key, {
            data,
          });
        }
      });
      onChange(change);
    };
    const onMouseDown = (event: any) => clickIndentButton(event);
    return (
      // eslint-disable-next-line react/jsx-no-bind
      <span onMouseDown={onMouseDown} title={title}>
        <img src={icon} alt="" />
      </span>
    );
  };

  setAlign = (e: any, align: string) => {
    e.preventDefault();
    const { onChange, value } = this.props;
    let change = value.change();
    const blocks: any = change.value.blocks;
    blocks.forEach((block: any) => {
      let data: any = block.get("data");
      const style: any = data.get("style") || {};
      if ("textAlign" in style && style.textAlign === align) {
        delete style.textAlign;
      } else {
        style.textAlign = align;
        delete style.textAlignLast;
      }
      data = data.set("style", style);
      change = change.setNodeByKey(block.key, {
        data,
      });
    });
    onChange(change);
  };

  renderAlign = (align: string, icon: JSX.Element, title: string) => {
    const isActive = this.props.value.blocks.some(
      (block: any) => block.data.get("style")?.["textAlign"] === align
    );
    const cls = classnames("tool-btn", {
      isActive,
    });
    return (
      <span>
        <span
          className={cls}
          onMouseDown={(e) => this.setAlign(e, align)}
          title={title}
        >
          {icon}
        </span>
      </span>
    );
  };

  renderAlignJustify = () => {
    const setAlignJustify = (e: any) => {
      e.preventDefault();
      const { onChange, value } = this.props;
      let change = value.change();
      const blocks: any = change.value.blocks;
      blocks.forEach((block: any) => {
        let data: any = block.get("data");
        const style: any = data.get("style") || {};
        if ("textAlign" in style && style.textAlign === "justify") {
          delete style.textAlign;
          delete style.textAlignLast;
        } else {
          style.textAlign = "justify";
          style.textAlignLast = "justify";
        }
        data = data.set("style", style);
        change = change.setNodeByKey(block.key, {
          data,
        });
      });
      onChange(change);
    };
    return (
      <span>
        <span
          className="tool-btn"
          title="两端对齐"
          onMouseDown={setAlignJustify}
        >
          <i className="tool-icon ic-align-between" />
        </span>
      </span>
    );
  };

  renderMarkBtns = () => {
    return (
      <>
        {this.renderMarkButton(
          "bold",
          <i className="tool-icon ic-jiacu" />,
          "加粗"
        )}
        {this.renderMarkButton(
          "italic",
          <i className="tool-icon ic-xieti" />,
          "斜体"
        )}
        {/* {this.renderMarkButton("sup", UpIcon, "上标")}
        {this.renderMarkButton("sub", DownIcon, "下标")} */}
        {this.renderMarkButton(
          "u",
          <i className="tool-icon ic-xiahuaxian" />,
          "下划线"
        )}
        {this.renderAlign(
          "left",
          <i className="tool-icon ic-align-left" />,
          "居左"
        )}
        {this.renderAlign(
          "center",
          <i className="tool-icon ic-align-center" />,
          "居中"
        )}
        {this.renderAlign(
          "right",
          <i className="tool-icon ic-align-right" />,
          "居右"
        )}
        {this.renderAlignJustify()}
        {/* {this.renderIndentButton("indent", IndentIcon, "首行缩进")} */}
      </>
    );
  };

  render() {
    const root: any = window.document.getElementById("root");
    const { menuRef, className } = this.props;
    const rootClass: string = classnames(
      "menu hover-menu easy-editor__hover-menu",
      className,
      {
        fixed: !menuRef,
      }
    );
    const childNode = (
      <div className={rootClass} ref={menuRef}>
        <div className="tools">{this.renderMarkBtns()}</div>
      </div>
    );
    if (menuRef) {
      return ReactDOM.createPortal(childNode, root);
    }
    return childNode;
  }
}

export default Menu;
