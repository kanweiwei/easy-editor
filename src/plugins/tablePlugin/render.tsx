import * as React from "react";
import "./index.less";
import { range, slice } from "lodash-es";
import { findDOMNode } from "react-dom";
import { List } from "immutable";
import getStyleFromData from "../../utils/getStyleFromData";

function getTdCount(node: any) {
  const trs = node.filterDescendants((n: any) => n.type === "table-row");
  let res = 0;
  trs.forEach((tr: any) => {
    const tds = tr.filterDescendants((n: any) => n.type === "table-cell");
    if (tds.size > res) {
      res = tds.size;
    }
  });
  return res;
}

class Vline extends React.Component<any, any> {
  x: number;

  left: number;

  startResize = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.x =
      ((e.touches && e.touches[0].clientX) || e.clientX || e.pageX) +
      document!.documentElement.scrollLeft;
    const root: any = findDOMNode(this);
    root.style.borderRightStyle = "dashed";
    this.left = Number(root.style.left.replace("px", ""));
    window.addEventListener("mousemove", this.resizing);
    window.addEventListener("mouseup", this.endResize);
  };

  endResize = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    window.removeEventListener("mousemove", this.resizing);
    window.removeEventListener("mouseup", this.endResize);
    const root: any = findDOMNode(this);
    root.style.borderRightStyle = "solid";
    if (this.props.onUpdate) {
      this.props.onUpdate(Number(root.style.left.replace("px", "")));
    }
  };

  resizing = (e: any) => {
    const $container: any = findDOMNode(this);
    const mouse: any = {};
    mouse.x =
      ((e.touches && e.touches[0].clientX) || e.clientX || e.pageX) +
      document!.documentElement.scrollLeft;
    $container.style.left = `${this.left + (mouse.x - this.x)}px`;
  };

  render() {
    const { left } = this.props;
    return (
      <div
        className="slate-sheet-container-vline"
        style={{ left: `${left}px` }}
        onMouseDown={this.startResize}
      />
    );
  }
}

class SlateTable extends React.Component<any, any> {
  hasBorder = true;

  constructor(props: any) {
    super(props);
    const maxTdCount = getTdCount(props.node);
    const vlines: any[] = range(maxTdCount).map(() => {
      return {
        left: 0,
      };
    });
    this.state = {
      maxTdCount,
      vlines,
    };
  }

  updateTargetTdWidth = (tds: List<any>, vlines: any[], i: number) => {
    return (change: any) => {
      const target = tds.get(i);
      if (target) {
        const style = getStyleFromData(target);
        style.width = `${vlines[i].width}px`;
        change.setNodeByKey(target.key, {
          data: {
            ...target.data.toJS(),
            style,
          },
        });
      }
    };
  };

  updateWidth = (left: number, i: number) => {
    const { maxTdCount, vlines } = this.state;
    const { node, editor } = this.props;
    const dis = left - vlines[i].left;
    vlines[i].left = left;
    if (i === 0) {
      vlines[i].width = left;
    } else {
      vlines[i].width = left - vlines[i - 1].left;
    }
    if (vlines[i + 1]) {
      vlines[i + 1].width -= dis;
    }
    const targetTrs = node.filterDescendants(
      (n: any) => n.type === "table-row" && n.nodes.size === maxTdCount
    );
    const change = editor.state.value.change();
    targetTrs.forEach((tr: any) => {
      const tds = tr.nodes;
      change.call(this.updateTargetTdWidth(tds, vlines, i));
      change.call(this.updateTargetTdWidth(tds, vlines, i + 1));
    });
    editor.onChange(change);
    this.setState({
      vlines,
    });
    setTimeout(() => {
      this.updateVlinesPosition();
    });
  };

  renderVlines = () => {
    const { vlines } = this.state;
    return range(vlines.length).map((n: any, i: number) => {
      return (
        <Vline
          left={vlines[i].left}
          onUpdate={(left: number) => this.updateWidth(left, i)}
          key={i}
        />
      );
    });
  };

  updateVlinesPosition = () => {
    // 获取td的位置信息并更新垂直调整线的位置
    const { maxTdCount, vlines } = this.state;
    const { node } = this.props;
    const targetTr = node.findDescendant(
      (n: any) => n.type === "table-row" && n.nodes.size === maxTdCount
    );
    if (!targetTr) {
      return;
    }
    const tds = targetTr.nodes;
    const tdDoms: HTMLTableCellElement[] = [];
    tds.forEach((td: any) => {
      tdDoms.push(
        window.document.querySelector(
          `[data-key='${td.key}']`
        ) as HTMLTableCellElement
      );
    });
    let left = 0;
    tdDoms.forEach((td, i) => {
      if (td.style.borderCollapse === "collapse" && i === 0) {
        left =
          left +
          td.offsetWidth -
          Number((td.style.borderWidth || "").replace("px", ""));
      } else {
        left += td.offsetWidth;
      }
      vlines[i].left = left;
      vlines[i].width = td.offsetWidth;
    });
    this.setState({
      vlines,
    });
  };

  changeTableBorder = () => {
    // 当光标在表格内时
    const { node, isFocused } = this.props;
    const root = document.querySelector(
      `[data-key='${node.key}'] table`
    ) as HTMLTableElement;
    if (isFocused) {
      if (!this.hasBorder) {
        root.style.border = "1px solid #ccc";
        const tds = root.querySelectorAll("td");
        range(tds.length).forEach((n: any, i: number) => {
          tds[i].style.border = "1px solid #ccc";
        });
      }
    } else if (!this.hasBorder) {
      root.style.border = "none";
      root.style.borderWidth = "";
      const tds = root.querySelectorAll("td");
      range(tds.length).forEach((n: any, i: number) => {
        tds[i].style.border = "none";
      });
    }
  };

  componentDidUpdate() {
    this.changeTableBorder();
  }

  componentDidMount() {
    const { node } = this.props;
    const root = document.querySelector(
      `[data-key='${node.key}'] table`
    ) as HTMLTableElement;
    const tds = root.querySelectorAll("td");
    if (
      root.border ||
      root.style.borderWidth ||
      slice(tds).some(
        (td: HTMLTableDataCellElement) => td.style.borderWidth !== null
      )
    ) {
      this.hasBorder = true;
    } else {
      this.hasBorder = false;
    }

    this.updateVlinesPosition();
  }

  render() {
    const { attributes, children, node } = this.props;
    let { style, className, ...otherAttrs } = node.data.toJS();
    style = getStyleFromData(node);
    return (
      <div className="slate-sheet-container" {...attributes}>
        {this.renderVlines()}
        <table {...otherAttrs} style={style} className={className}>
          {children}
        </table>
      </div>
    );
  }
}
export default (editor: any, props: any) => {
  return <SlateTable {...props} editor={editor} />;
};
