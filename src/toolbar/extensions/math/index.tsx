import * as React from "react";
import "./style.less";

function MathExtention(props: any) {
  const handleClick = () => {
    const change = props.change.focus().insertInline({
      object: "inline",
      type: "math-content",
      isVoid: true,
      data: {
        tex: "",
      },
    });
    props.update(change);
  };

  return (
    <span onMouseDown={handleClick}>
      <span className="tool-insert-math" />
    </span>
  );
}

export default MathExtention;
