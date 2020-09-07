/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";

import Dropdown from "rc-dropdown";
import "./style.less";
import "rc-dropdown/assets/index.css";
import { first, slice } from "lodash-es";

import { TwitterPicker, HSLColor, RGBColor } from "react-color";

const FontColor = (props: any) => {
  const { change, update } = props;

  const elementRef = React.useRef<HTMLSpanElement>(null);

  const [color, setFontColor] = React.useState<string | null>(null);

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
            const color: string = window.getComputedStyle(target as Element)
              .color;
            setFontColor(color);
          }
        } else {
          const color: string = window.getComputedStyle(textElement).color;
          setFontColor(color);
        }
      }
    } else {
      setFontColor(null);
    }
  }, [change.value]);

  const changeColor = (color: {
    hex: string;
    hsl: HSLColor;
    rgb: RGBColor;
  }) => {
    const marks = change.value.marks.toArray();

    if (marks.some((m: { type: string }) => m.type === "fontColor")) {
      const ms = marks.filter((m: { type: string }) => m.type === "fontColor");
      ms.forEach((m: any) => {
        change.removeMark(m);
      });
    }
    change.addMark({
      type: "fontColor",
      data: {
        value: color.hex,
      },
    });
    update(change);
    setFontColor(color.hex);
  };

  return (
    <Dropdown
      overlay={() => (
        <TwitterPicker
          styles={{
            default: { card: { marginLeft: "-10px", marginTop: "10px" } },
          }}
          colors={[
            "#FF6900",
            "#FCB900",
            "#7BDCB5",
            "#00D084",
            "#8ED1FC",
            "#0693E3",
            "#ABB8C3",
            "#EB144C",
            "#F78DA7",
            "#000000",
          ]}
          onChange={changeColor}
        />
      )}
    >
      <span
        className="font-color-wrapper"
        style={{ backgroundColor: color ? color : "#000" }}
        ref={elementRef}
      />
    </Dropdown>
  );
};

export default FontColor;
