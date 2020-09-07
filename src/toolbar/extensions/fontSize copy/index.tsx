import * as React from "react";

import Dropdown from "rc-dropdown";
import "./style.less";
import "./node_modules/rc-dropdown/assets/index.css";
import { first, slice } from "lodash-es";
import classnames from "classnames";

type FontListProps = {
  onChange: (size: string) => void;
  fontSize: string | null;
};

const FontList = (props: FontListProps) => {
  const handleClick = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const size = e.nativeEvent.target?.innerText;
    if (props.onChange) {
      props.onChange(size);
    }
  };
  return (
    <ul className={"font-size-list"} onMouseDown={handleClick}>
      {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40].map(
        (size) => {
          const cls = classnames({
            active: `${size}px` === props.fontSize,
          });
          return (
            <li className={cls} key={size}>
              {size}px
            </li>
          );
        }
      )}
    </ul>
  );
};

const FontSize = (props: any) => {
  const { change, update } = props;

  const elementRef = React.useRef<HTMLSpanElement>(null);

  const [fontSize, setFontSize] = React.useState<string | null>(null);

  React.useEffect(() => {
    const focusText = change.value.focusText;
    if (focusText) {
      const key = focusText.key;
      const offset = change.value.focusOffset;
      const leaves = focusText.leaves.filter((n: { text: any }) => n.text);
      let index = 0;

      for (let i = 0, o = 0; i < leaves.size; i++) {
        const n = leaves.get(i);
        if (offset >= o && offset <= o + n.text.length) {
          index = i;
          o += n.text.length;
          break;
        } else if (offset > o + n.text.length) {
          o += n.text.length;
        }
      }
      const editor = elementRef.current?.closest(".easy-editor");
      const textElement = editor?.querySelector(
        `[data-key="${key}"] [data-offset-key="${key}:${index}"]`
      );
      if (textElement) {
        if (textElement.childElementCount > 0) {
          const target = first(
            slice(textElement.childNodes).filter((n) => n.nodeType === 1)
          );
          if (target) {
            const size: string = window.getComputedStyle(target as Element)
              .fontSize;
            setFontSize(size);
          }
        } else {
          const size: string = window.getComputedStyle(textElement).fontSize;
          setFontSize(size);
        }
      }
    } else {
      setFontSize(null);
    }
  }, [change.value]);

  const changeSize = (s: string) => {
    const marks = change.value.marks.toArray();

    if (marks.some((m: { type: string }) => m.type === "fontSize")) {
      const ms = marks.filter((m: { type: string }) => m.type === "fontSize");
      ms.forEach((m: any) => {
        change.removeMark(m);
      });
    }
    change.addMark({
      type: "fontSize",
      data: {
        value: s,
      },
    });
    update(change);
    setFontSize(s);
  };

  return (
    <Dropdown
      overlay={() => <FontList onChange={changeSize} fontSize={fontSize} />}
    >
      <span className="font-size-wrapper" ref={elementRef}>
        <span>{fontSize ? fontSize : "xxx px"}</span>
        <span className="font-size-up"></span>
        <span className="font-size-down"></span>
      </span>
    </Dropdown>
  );
};

export default FontSize;
