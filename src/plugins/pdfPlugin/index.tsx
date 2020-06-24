import * as React from "react";
import EditorPlugin from "../../interfaces/pluginInterface";
import getAttr from "../../utils/getAttr";
import "./style.less";

function PdfWrapper(props: { url: any; name: string }) {
  return (
    <div className="easy-editor-upload pdf-wrapper">
      <i className="easy-editor-icon ic_pdf"></i>
      <div className="easy-editor-upload__name">
        <a href={props.url}>{props.name}</a>
      </div>
    </div>
  );
}

const pdfPlugin: EditorPlugin = {
  type: "node",
  nodeType: "pdf",
  object: "block",
  schema: {
    isVoid: true,
  },
  importer(el, next): any {
    if (getAttr(el.attrs, "data-type") === "pdf") {
      const url = getAttr(el.attrs, "data-url");
      const name = getAttr(el.attrs, "data-name");
      return {
        object: "block",
        type: "pdf",
        isVoid: true,
        nodes: next(el.childNodes),
        data: {
          url,
          name,
        },
      };
    }
  },
  exporter(node, children): any {
    const url = node.data.get("url");
    return (
      <div data-type="pdf" data-url={url}>
        {children}
      </div>
    );
  },
  render(editor, props) {
    const url = props.node.data.get("url");
    const name = props.node.data.get("name");

    return (
      <div {...props.attributes} data-url={url}>
        <PdfWrapper url={url} name={name} />
      </div>
    );
  },
};

export default pdfPlugin;
