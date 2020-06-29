import * as React from "react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import "./style.less";

type EditorTooltipProps = {
  placeholder?: (() => React.ReactNode) | React.ReactNode;
  children: React.ReactElement;
};

const EditorTooltip = (props: EditorTooltipProps) => {
  const { placeholder } = props;
  if (!placeholder) {
    return <>{props.children}</>;
  }
  return (
    <Tooltip
      overlayClassName="easy-editor__tooltip"
      placement="bottom"
      overlay={placeholder}
    >
      {props.children}
    </Tooltip>
  );
};

export default EditorTooltip;
