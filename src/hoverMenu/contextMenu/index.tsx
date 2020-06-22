import * as React from "react";
import "./style.less";
import ReactDom from "react-dom";

class ContextMenu extends React.Component<any, any> {
  render() {
    const root: any = document.getElementById("root");
    const { isSelected, children } = this.props;

    if (!isSelected) {
      return null;
    }

    return ReactDom.createPortal(
      <div
        className="context-menu"
        id="context-menu"
        ref={this.props.contextMenuRef}
      >
        {children}
      </div>,
      root
    );
  }
}

export default ContextMenu;
