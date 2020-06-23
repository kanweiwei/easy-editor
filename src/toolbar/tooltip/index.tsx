import * as React from "react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import "./style.less";

const EditorTooltip: React.FC<
  {
    placeholder: React.ReactElement;
  } & any
> = (
  props: {
    placeholder: React.ReactElement;
  } & any
) => {
  const { placeholder = "" } = props;
  return (
    <Tooltip
      overlayClassName="easy-editor__tooltip"
      placement="bottom"
      overlay={placeholder}
    >
      {props.children as any}
    </Tooltip>
  );
};

export default EditorTooltip;
