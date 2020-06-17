import * as React from "react";
/**
 * marks
 */
function BoldMark(props) {
    return <strong>{props.children}</strong>;
}
function SubMark(props) {
    return <sub>{props.children}</sub>;
}
function SupMark(props) {
    return <sup>{props.children}</sup>;
}
function UMark(props) {
    // return <span className="underline" style={{textDecoration: "underline"}}>{props.children}</span>
    return <u>{props.children}</u>;
}
function ItalicMark(props) {
    return <i>{props.children}</i>;
}
export default (function (props) {
    switch (props.mark.type) {
        case "bold":
            return <BoldMark {...props}/>;
        case "sub":
            return <SubMark {...props}/>;
        case "sup":
            return <SupMark {...props}/>;
        case "u":
            return <UMark {...props}/>;
        case "italic":
            return <ItalicMark {...props}/>;
        case "dot":
            return <span className="dot">{props.children}</span>;
        default:
            return null;
    }
});
