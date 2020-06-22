import { Block, Value } from "@zykj/slate";
import { Editor } from "@zykj/slate-react";
import classnames from "classnames";
import { get } from "lodash-es";
import raf from "raf";
import * as React from "react";
import handlePaste from "./events/paste";
import HoverMenu from "./hoverMenu";
import initValue from "./initValue";
import basePlugins from "./plugins";
import renderMark from "./renderMark";
import renderNode from "./renderNode";
import schemas from "./schema";
import "./style.less";
import ToolBar from "./toolbar";
import HtmlSerialize from "./htmlSerialize";

interface IEditorProps {
  html?: string;
  /**
   * slate value
   */
  value?: any;
  minHeight?: number;
  plugins?: any[];
  autoFocus?: boolean;
  placeholder?: string;
  showMenu?: boolean;
  pasteOptions?: any;
  beforeUpload?: (
    file: File | Blob | Buffer | ArrayBuffer,
    dataURI: string
  ) => string | Promise<string>;
  controls?: Array<string[]>;
  showToolbar?: boolean;
  onUpdate?: (value: any, html?: string) => any;
  onBlur?: (e: any, change: any) => any;
  onChange?: (value: any) => any;
  onKeyDown?: (e: any, change: any) => any;
  onCompositionStart?: (e: any, change: any) => any;
  onCompositionEnd?: (e: any, change: any) => any;
  onSaveHtml?: (value: Value) => any;
  forbidIME?: boolean;
  originalContent?: any;
  style?: any;
  className?: string;
  readOnly?: boolean;
  disableMenu?: boolean;
  disableKeyDown?: boolean;
  disableComposition?: boolean;
  disableSelect?: boolean;
}

const findRealDoms = (dom: any, realDom: any): any => {
  if (dom.childNodes && Array.isArray(dom.childNodes)) {
    if (dom.childNodes.length === 1) {
      return findRealDoms(dom.childNodes[0], realDom);
    }
    if (dom.childNodes.length > 1) {
      realDom = dom;
      return realDom;
    }
  } else {
    realDom = dom;
    return realDom;
  }
};

// 定义编辑器
class EasyEditor extends React.Component<IEditorProps, any> {
  plugins: any[];
  convertor: any;

  isComposing: boolean = false;

  rafHandle: any;

  /**
   * 提示
   */
  info: any;

  /** 菜单 */
  menu: any;

  constructor(props: any) {
    super(props);
    let { value } = props;
    this.plugins = [...basePlugins, ...(props?.plugins ?? [])];
    this.convertor = this.initHtmlSerialize(this.plugins);

    if (typeof props.value === "string") {
      value = this.getValueByHtml(props.value);
    }

    this.state = {
      value: value || initValue(),
    };
  }

  private initHtmlSerialize(plugins: any[]) {
    var convertor = new HtmlSerialize();
    plugins.forEach((plugin) => {
      convertor.rules.unshift({
        serialize: (node, children) => {
          if (node.object === plugin.object && plugin.nodeType === node.type) {
            if (plugin.exporter) {
              return plugin.exporter(node, children);
            }
          }
        },
        deserialize: plugin.importer,
      });
    });
    return convertor.converter();
  }

  componentDidMount() {
    this.updateMenu();
  }

  componentDidUpdate() {
    if (!this.props.disableMenu) {
      this.updateMenu();
    }
  }

  componentWillUnmount() {
    if (this.rafHandle) {
      raf.cancel(this.rafHandle);
    }
  }

  getState(name: string) {
    return get(this.state, name);
  }

  onChange = (change: any) => {
    if (this.props.onChange) {
      const res = this.props.onChange({ change });
      if (typeof res === "boolean" && !res) {
        return;
      }
    }
    if (this.rafHandle) {
      raf.cancel(this.rafHandle);
    }
    if (this.props.onSaveHtml) {
      this.props.onSaveHtml(change.value);
    }
    this.setState({
      value: change.value,
    });
  };

  update = (change: any) => {
    return this.onChange(change);
  };

  onCompositionStart = (e: any, change: any): any => {
    this.isComposing = true;
    if (this.props.onCompositionStart) {
      const res = this.props.onCompositionStart(e, change);
      if (typeof res === "boolean" && !res) {
        return res;
      }
    }
  };

  onCompositionEnd = (e: any, change: any): any => {
    this.isComposing = false;
    if (this.props.onCompositionEnd) {
      const res = this.props.onCompositionEnd(e, change);
      if (typeof res === "boolean" && !res) {
        return res;
      }
    }
    if (this.props.forbidIME) {
      e.preventDefault();
      const value = Value.fromJSON(change.value.toJSON());
      this.rafHandle = raf(() => {
        this.onChange({ value });
      });
    }
  };

  onBlur = (e: any, change: any) => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(e, change);
    }
  };

  /** 更新悬浮菜单位置 */
  updateMenu = () => {
    const menu = this.menu;
    if (!menu) {
      return;
    }

    const { value } = this.state;
    const { selection } = value;

    if (selection.isBlurred || selection.isCollapsed) {
      menu.removeAttribute("style");
      return;
    }

    const native = window.getSelection();
    if (!native) {
      return;
    }
    try {
      let nodeElement: any = native.focusNode;
      if (nodeElement) {
        if (nodeElement.nodeName === "#text") {
          nodeElement = nodeElement.parentNode;
          if (!nodeElement) {
            nodeElement = native.getRangeAt(0);
          }
        }
        const rect = nodeElement.getBoundingClientRect();
        menu.style.opacity = 1;
        menu.style.zIndex = 1000;
        menu.style.top = `${
          rect.top + window.pageYOffset - menu.offsetHeight - 20
        }px`;

        let left =
          rect.left +
          window.pageXOffset -
          menu.offsetWidth / 2 +
          rect.width / 2;
        if (left <= 0) {
          left = 60;
        }

        menu.style.left = `${left}px`;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  resetByHtml = (html: any) => {
    const change = this.convertor.deserialize(html).change();
    this.update(change);
  };

  getValueByHtml = (html: any) => {
    let b = document.createElement("body");
    b.innerHTML = html;
    if (b.textContent?.length) {
      const htmlValue = this.convertor.deserialize(html, { toJSON: true });
      return Value.fromJSON(htmlValue);
    }
    return initValue;
  };

  /** 编辑器中插入Blocks */
  insertBlocks = (blocks: Block[]) => {
    const { value } = this.state;
    const change: any = value.change().moveToRangeOfDocument().moveToEnd();

    blocks.forEach((block: any) => {
      change.insertBlock(block);
    });
    this.onChange(change);
  };

  /** 菜单ref */
  menuRef = (menu: any) => {
    this.menu = menu;
  };

  /** 失去焦点 */
  handleBlur = (e: any) => {
    const { value } = this.state;
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(e, value);
    }
  };

  renderMenu = (fixed = false) => {
    const { showMenu = true } = this.props;
    if (showMenu) {
      if (fixed) {
        return (
          <HoverMenu
            value={this.state.value}
            onChange={this.onChange}
            plugins={this.plugins}
          />
        );
      } else {
        return (
          <HoverMenu
            menuRef={this.menuRef}
            value={this.state.value}
            onChange={this.onChange}
            plugins={this.plugins}
          />
        );
      }
    }
    return null;
  };

  renderNode = (props: any) => {
    if (this.plugins.length) {
      const nodePlugins = this.plugins.filter((p) => p.type === "node");
      let r = nodePlugins.find((n) => props.node.type === n.nodeType);
      if (r) {
        return r.render(this, props);
      }
    }
    return renderNode(this, props);
  };

  renderEditor = () => {
    const { value } = this.state;
    const { readOnly, placeholder, pasteOptions, minHeight = 300 } = this.props;
    return (
      <Editor
        placeholder={placeholder}
        value={value}
        onChange={this.onChange}
        onCompositionStart={this.onCompositionStart}
        onCompositionEnd={this.onCompositionEnd}
        onBlur={this.onBlur}
        onPaste={(e: any, change: any) =>
          handlePaste(e, change, this, pasteOptions, this.props.beforeUpload)
        }
        onContextMenu={(e: any) => e.preventDefault()}
        renderMark={renderMark}
        renderNode={this.renderNode}
        onKeyDown={this.props.onKeyDown}
        plugins={this.plugins}
        autoFocus={this.props.autoFocus ?? true}
        schema={schemas}
        spellCheck={false}
        readOnly={readOnly}
        style={{ minHeight: `${minHeight}px` }}
      />
    );
  };

  renderMask = () => {
    if (this.props.readOnly) {
      return (
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      );
    }
    return null;
  };

  render() {
    const {
      style = {},
      className,
      minHeight = 300,
      showToolbar = true,
      controls,
    } = this.props;
    const cls: any = classnames("easy-editor", className);
    return (
      <div className={cls} style={{ ...style }}>
        {showToolbar && (
          <ToolBar
            controls={controls}
            value={this.state.value}
            onChange={this.onChange}
            beforeUpload={this.props.beforeUpload}
          />
        )}
        {/* {this.renderMenu()} */}
        <div
          className="easy-editor-content"
          style={{ minHeight: `${minHeight}px` }}
        >
          {this.renderEditor()}
        </div>
        {this.renderMask()}
      </div>
    );
  }
}

export default EasyEditor;
