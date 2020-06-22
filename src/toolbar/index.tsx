import { Mark } from "@zykj/slate";
import classnames from "classnames";
import { omit } from "lodash-es";
import * as React from "react";
import ImageExtension from "./extensions/image";
import "./style.less";
import VideoExtension from "./extensions/video";

type Control = {
  object?: "mark" | "align";
  type: string;
  placeholder?: string;
  component: React.ReactElement | Function;
};

const defaultControls = {
  bold: {
    object: "mark",
    type: "bold",
    placeholder: "加粗",
    component: <i className="tool-icon ic-jiacu" />,
  },
  italic: {
    object: "mark",
    type: "italic",
    placeholder: "斜体",
    component: <i className="tool-icon ic-xieti" />,
  },
  u: {
    object: "mark",
    type: "underline",
    placeholder: "下划线",
    component: <i className="tool-icon ic-xiahuaxian" />,
  },
  left: {
    object: "mark",
    type: "align",
    placeholder: "居左",
    component: <i className="tool-icon ic-align-left" />,
  },
  center: {
    object: "align",
    type: "center",
    placeholder: "居中",
    component: <i className="tool-icon ic-align-center" />,
  },
  right: {
    object: "align",
    type: "right",
    placeholder: "居右",
    component: <i className="tool-icon ic-align-right" />,
  },
  justify: {
    object: "align",
    type: "justify",
    placeholder: "两端对齐",
    component: <i className="tool-icon ic-align-between" />,
  },
  image: {
    type: "image",
    placeholder: "插入图片",
    component: (change: any, update: any, beforeUpload: Function) => (
      <ImageExtension
        change={change}
        update={update}
        beforeUpload={beforeUpload}
      />
    ),
  },
  video: {
    type: "video",
    placeholder: "插入音频",
    component: (change: any, update: any, beforeUpload: Function) => (
      <VideoExtension
        change={change}
        update={update}
        beforeUpload={beforeUpload}
      />
    ),
  },
};

class ToolBar extends React.Component<any, any> {
  hasMark(type: string): boolean {
    return this.props.value.activeMarks.some((mark: any) => mark.type === type);
  }

  onClickMark = (event: any, type: string) => {
    const { value, onChange } = this.props;
    event.preventDefault();
    const change = value.change().toggleMark(type);
    onChange(change);
  };

  renderComponent = (component: React.ReactElement | Function) => {
    if ("$$typeof" in component) {
      return component;
    }
    if (typeof component === "function") {
      return component();
    }
    return null;
  };

  renderMarkBtn = (item: Control) => {
    const { type, component, placeholder } = item;
    const activeMarks = this.props.value.activeMarks.toArray();
    const isActive = activeMarks.some((m: Mark) => m.type == type);

    const onMouseDown = (event: any) => this.onClickMark(event, type);
    const btnClass = classnames({
      "tool-btn": true,
      isActive,
    });

    return (
      <span key={item.type}>
        <span
          className={btnClass}
          title={placeholder}
          onMouseDown={onMouseDown}
        >
          {this.renderComponent(component)}
        </span>
      </span>
    );
  };

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
      <span onMouseDown={onMouseDown} title={title}>
        <img src={icon} alt="" />
      </span>
    );
  };

  setAlign = (e: any, align: string) => {
    e.preventDefault();
    if (align == "justify") {
      return this.setAlignJustify(e);
    }
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

  setAlignJustify = (e: any) => {
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

  renderAlign = (control: Control) => {
    const { type, component, placeholder } = control;
    const isActive = this.props.value.blocks.some(
      (block: any) => block.data.get("style")?.["textAlign"] === type
    );
    const cls = classnames("tool-btn", {
      isActive,
    });
    return (
      <span key={type}>
        <span
          className={cls}
          onMouseDown={(e) => this.setAlign(e, type)}
          title={placeholder}
        >
          {this.renderComponent(component)}
        </span>
      </span>
    );
  };

  renderControls = () => {
    const {
      controls = [
        ["bold", "italic", "u"],
        ["left", "center", "right", "justify"],
        ["image", "video"],
      ],
    } = this.props;
    return controls.map((toolGroup: Array<string | Control>) => {
      return toolGroup.map((tool) => {
        if (typeof tool === "string") {
          if (tool in defaultControls) {
            const t = defaultControls[tool];
            switch (t.object) {
              case "mark":
                return this.renderMarkBtn(t);
              case "align":
                return this.renderAlign(t);
              default: {
                if ("component" in t && typeof t.component === "function") {
                  return (
                    <span key={t.type}>
                      <span className="tool-btn">
                        {t.component(
                          this.props.value.change(),
                          this.props.onChange,
                          this.props.beforeUpload
                        )}
                      </span>
                    </span>
                  );
                }
                return null;
              }
            }
          }
        } else {
          // custom tool
          if ("component" in tool && typeof tool.component === "function") {
            return (
              <span key={tool.type} title={tool.placeholder || ""}>
                <span className="tool-btn">
                  {tool.component(
                    this.props.value.change(),
                    this.props.onChange
                  )}
                </span>
              </span>
            );
          }
        }

        return null;
      });
    });
  };

  render() {
    const { className } = this.props;
    const rootClass: string = classnames("easy-editor__toolbar", className);

    return (
      <div className={rootClass}>
        <div className="tools">{this.renderControls()}</div>
      </div>
    );
  }
}

export default ToolBar;
