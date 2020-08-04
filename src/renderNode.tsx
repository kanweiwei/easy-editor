import { assign } from "lodash-es";
import * as React from "react";
import getStyleFromData from "./utils/getStyleFromData";
import { VideoPlayer } from "./plugins/videoPlugin";
import getExt from "./utils/getExt";
/**
 * nodes
 */
function ParagraphNode(props: any) {
  return (
    <p {...props.attributes} style={props.style} className={props.className}>
      {props.children}
    </p>
  );
}

function SpanNode(props: any) {
  let { style, className, ...otherAttrs } = props.node.data.toJS();
  style = getStyleFromData(props.node);
  return (
    <span
      {...props.attributes}
      {...otherAttrs}
      style={style}
      className={className}
    >
      {props.children}
    </span>
  );
}

/**
 * placeholder
 */
export function renderPlaceholder(
  text: string,
  tips: string,
  { style }: any = {}
) {
  if (!text || (text.length === 1 && text.charCodeAt(0) === 8203)) {
    style = assign({}, style);
    return (
      <div className="description_placeholder" style={style}>
        {tips}
      </div>
    );
  }
  return null;
}

export default (self: any, props: any): any => {
  const { attributes, children, node } = props;
  switch (node.type) {
    case "div": {
      let { style, className, ...otherAttrs }: any = node.data.toJS();
      style = getStyleFromData(node);
      return (
        <div
          {...props.attributes}
          {...otherAttrs}
          style={style}
          className={className}
        >
          {children}
        </div>
      );
    }
    case "paragraph": {
      const style: any = getStyleFromData(node);
      const { className } = node.data.toJS();
      return <ParagraphNode {...props} style={style} className={className} />;
    }
    case "span":
      return <SpanNode {...props} />;
    case "ruby": {
      return <ruby {...props.attributes}>{props.children}</ruby>;
    }
    case "rp":
      return <rp>{props.children}</rp>;
    case "rt":
      return <rt>{props.children}</rt>;

    case "table-body": {
      let { style, className, ...otherAttrs } = node.data.toJS();
      style = getStyleFromData(node);
      return (
        <tbody
          {...attributes}
          {...otherAttrs}
          style={style}
          className={className}
        >
          {children}
        </tbody>
      );
    }
    case "table-row": {
      let { style, className, ...otherAttrs } = node.data.toJS();
      style = getStyleFromData(node);
      return (
        <tr {...attributes} {...otherAttrs} style={style} className={className}>
          {children}
        </tr>
      );
    }
    case "table-cell": {
      let { style, className, ...otherAttrs } = node.data.toJS();
      style = getStyleFromData(node);
      return (
        <td {...attributes} {...otherAttrs} style={style} className={className}>
          {children}
        </td>
      );
    }
    case "embed": {
      let { style, className, ...otherAttrs } = node.data.toJS();
      let src = node.data.get("src");
      const ext = getExt(src);
      return (
        <div {...attributes} {...otherAttrs}>
          <VideoPlayer
            playbackRates={[1, 1.5, 2]}
            controls={true}
            sources={[
              {
                src: src,
                type: `video/${ext}`,
              },
            ]}
            width={500}
          />
        </div>
      );
    }
    case "object": {
      let { style, className, ...otherAttrs } = node.data.toJS();
      let data = node.data.get("data");
      const ext = getExt(data);
      return (
        <div {...attributes} {...otherAttrs}>
          <VideoPlayer
            playbackRates={[1, 1.5, 2]}
            controls={true}
            sources={[
              {
                src: data,
                type: `video/${ext}`,
              },
            ]}
            width={500}
          />
        </div>
      );
    }
    default:
      return null;
  }
};
