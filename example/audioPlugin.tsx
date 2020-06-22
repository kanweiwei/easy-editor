import * as React from "react";
import { DefaultTreeElement } from "parse5";

const plugin = {
  type: "node", // node, mark
  nodeType: "super-audio",
  object: "inline",
  importer(el: DefaultTreeElement, next: Function): any {
    if (el.tagName.toLowerCase() === "audio") {
      return {
        object: "inline", // block、inline,
        type: "super-audio",
        isVoid: true,
        data: {
          src: el?.attrs?.find((n) => n.name === "src")?.value,
        },
        nodes: next(el.childNodes),
      };
    }
  },
  exporter(node: any, children: any): any {
    let { className, src } = node.data.toJS();
    return <audio src={src} className={className}></audio>;
  },
  render(
    editor: any,
    props: { attributes: any; children: any; node: any; isSelected: any }
  ): any {
    // @ts-ignore
    const { attributes, children, node, isSelected } = props;
    const src = node.data.get("src");
    return (
      <span {...attributes}>
        <audio src={src} controls>
          {children}
        </audio>
      </span>
    );
  },
};

export default plugin;
