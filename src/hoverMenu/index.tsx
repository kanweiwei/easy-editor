import * as React from "react";
import ReactDOM from "react-dom";
import { Button, message, Icon } from "antd";

import classnames from "classnames";
import "./style.less";
import { omit, difference } from "lodash-es";
import { Value } from "@zykj/slate";

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
    onClick?: (...args: any[]) => {},
    options: any = {}
  ) => {
    event.preventDefault();
    const { onChange, value, mode, oneSubQst, checkMode } = this.props;
    let change = value.change();
    try {
      const ancestors = change.value.document.getAncestors(
        value.blocks.first().key
      );

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
  renderMarkButton = (type: string, icon: string, title: string) => {
    // const isActive = this.hasMark(type);
    const onMouseDown = (event: any) => this.onClickMark(event, type);
    const btnClass = classnames({
      // isActive,
      "mark-btn": true,
    });
    return (
      <span className={btnClass} title={title} onMouseDown={onMouseDown}>
        {icon}
      </span>
    );
  };

  renderBlockButton(
    type: string,
    icon: string,
    title: string,
    onClick?: () => {}
  ) {
    const onMouseDown = (event: any) =>
      this.onClickBlock(event, onClick, { type });
    return (
      // eslint-disable-next-line react/jsx-no-bind
      <Button size="small" onMouseDown={onMouseDown} title={title} key={type}>
        {icon}
      </Button>
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
      <Button size="small" onMouseDown={onMouseDown} title={title}>
        <img src={icon} alt="" />
      </Button>
    );
  };

  renderBlockBtns = () => {
    const { mode, plugins = [] } = this.props;
    if (mode === "single") {
      return null;
    }
    const btns: any[] = [];
    plugins
      .filter(
        (plugin: any) =>
          "objectType" in plugin &&
          plugin.objectType === "block" &&
          "registerBtn" in plugin &&
          plugin.showMenu
      )
      .forEach((plugin: any) => {
        plugin.registerBtn(btns);
      });

    return (
      <span>
        {btns.map((btn: any) => {
          return this.renderBlockButton(
            btn.nodeType,
            btn.name,
            btn.title,
            btn.onClick
          );
        })}
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

  renderAlign = (align: string, title: string) => {
    return (
      <Button
        size="small"
        onMouseDown={(e) => this.setAlign(e, align)}
        title={title}
      >
        <Icon type={`align-${align}`} />
      </Button>
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
      <Button size="small" onMouseDown={setAlignJustify} title="两端对齐">
        <Icon type="menu" />
      </Button>
    );
  };

  renderMarkBtns = () => {
    return (
      <div className="tools">
        {this.renderMarkButton(
          "bold",
          <i className="tool-icon jiacu" />,
          "加粗"
        )}
        {this.renderMarkButton(
          "italic",
          <i className="tool-icon xieti" />,
          "斜体"
        )}
        {/* {this.renderMarkButton("sup", UpIcon, "上标")}
        {this.renderMarkButton("sub", DownIcon, "下标")} */}
        {this.renderMarkButton(
          "u",
          <i className="tool-icon xiahuaxian" />,
          "下划线"
        )}
        {this.renderAlign("left", "居左")}
        {this.renderAlign("center", "居中")}
        {this.renderAlign("right", "居右")}
        {this.renderAlignJustify()}
        {/* {this.renderIndentButton("indent", IndentIcon, "首行缩进")} */}
      </div>
    );
  };

  render() {
    const root: any = window.document.getElementById("root");
    const { menuRef, className } = this.props;
    const rootClass: string = classnames(
      "menu hover-menu slate-editor__hover-menu",
      className,
      {
        fixed: !menuRef,
      }
    );
    const childNode = (
      <div className={rootClass} ref={menuRef}>
        {this.renderBlockBtns()}
        {this.renderMarkBtns()}
      </div>
    );
    if (menuRef) {
      return ReactDOM.createPortal(childNode, root);
    }
    return childNode;
  }
}

export default Menu;
