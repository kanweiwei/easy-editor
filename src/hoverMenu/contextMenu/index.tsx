import * as React from "react";
import "./style.less";
import ReactDom from "react-dom";

const ContextMenu: React.FC<any> = (props: any) => {
  const root: any = document.getElementById("root");
  const { isSelected, children } = props;

  if (!isSelected) {
    return null;
  }

  return ReactDom.createPortal(
    <div className="context-menu" id="context-menu" ref={props.contextMenuRef}>
      {children}
    </div>,
    root
  );
};

export default ContextMenu;
