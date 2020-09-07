import * as React from "react";
/**
 * marks
 */
function BoldMark(props: any) {
  return <strong>{props.children}</strong>;
}
function SubMark(props: any) {
  return <sub>{props.children}</sub>;
}
function SupMark(props: any) {
  return <sup>{props.children}</sup>;
}
function UMark(props: any) {
  // return <span className="underline" style={{textDecoration: "underline"}}>{props.children}</span>
  return <u>{props.children}</u>;
}
function ItalicMark(props: any) {
  return <i>{props.children}</i>;
}

export default (props: any) => {
  switch (props.mark.type) {
    case "bold":
      return <BoldMark {...props} />;
    case "sub":
      return <SubMark {...props} />;
    case "sup":
      return <SupMark {...props} />;
    case "u":
      return <UMark {...props} />;
    case "italic":
      return <ItalicMark {...props} />;
    case "dot":
      return <span className="dot">{props.children}</span>;
    case "fontSize":
      return (
        <span style={{ fontSize: props.mark.data.get("value") }}>
          {props.children}
        </span>
      );
    case "fontColor":
      return (
        <span style={{ color: props.mark.data.get("value") }}>
          {props.children}
        </span>
      );
    default:
      return null;
  }
};
