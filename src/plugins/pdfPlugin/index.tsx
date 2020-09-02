import * as React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import EditorPlugin from "../../interfaces/pluginInterface";
import getAttr from "../../utils/getAttr";
import "./style.less";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const UAParser = require("ua-parser-js");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

declare let window: Window & {
  flutter_inappwebview?: {
    _callHandler(name: string, id: string, params: string): void;
  };
};

function PdfViewer(props: any) {
  const [numPages, setNumPages] = React.useState(0);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    setPageNumber(1);
  }
  const preCls = "pdf-viewer-wrapper";
  return (
    <div
      className={preCls}
      style={{ position: "fixed", left: 0, top: 0, right: 0, bottom: 0 }}
    >
      <div className={`${preCls}__header`}>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button
          className="prev-btn"
          disabled={pageNumber === 1}
          onMouseDown={() => setPageNumber(pageNumber - 1)}
        >
          上一页
        </button>
        <button
          className="prev-btn"
          disabled={pageNumber === numPages}
          onMouseDown={() => setPageNumber(pageNumber + 1)}
        >
          下一页
        </button>
        <div className="close-btn" onMouseDown={props.onClose}></div>
      </div>
      <Document file={props.url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          height={window.document.documentElement.clientHeight - 90}
        />
      </Document>
    </div>
  );
}

function PdfWrapper(props: {
  url: any;
  name: string;
  readOnly?: boolean;
  onRemove?: (...args: any[]) => void;
}) {
  const preCls = "easy-editor-upload";

  const [visible, setVisbile] = React.useState<boolean>(false);

  const handleRemove = () => {
    if (props.onRemove) {
      props.onRemove(props.url);
    }
  };
  const [parserResult, setParserResult] = React.useState<any>();
  React.useEffect(() => {
    const parser = new UAParser();
    setParserResult(parser.getResult());
  }, []);

  const showPdf = () => {
    // flutter inappwebview
    if (window.flutter_inappwebview) {
      window.flutter_inappwebview._callHandler(
        "showPdf",
        "showPdf",
        JSON.stringify([props.url])
      );
      return;
    }
    if (parserResult && parserResult?.os?.name === "Android") {
      setVisbile(true);
    } else {
      window.open(props.url);
    }
  };

  return (
    <div className={`${preCls} pdf-wrapper`}>
      <i className="easy-editor-icon ic_pdf"></i>
      <div className={`${preCls}__name`} onClick={showPdf}>
        <a>{props.name}</a>
      </div>
      {props.readOnly ? null : (
        <div className={`${preCls}__clean`} onMouseDown={handleRemove}></div>
      )}
      <div
        className={`${preCls}__see`}
        style={{ marginRight: 8, float: "right" }}
        onMouseDown={showPdf}
      ></div>

      {visible && (
        <PdfViewer
          url={props.url}
          key={"pdf-viewer"}
          onClose={() => setVisbile(false)}
          readOnly={props.readOnly}
        />
      )}
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
    const name = node.data.get("name");
    return (
      <div data-type="pdf" data-url={url} data-name={name}>
        {children}
      </div>
    );
  },
  render(editor, props) {
    const url = props.node.data.get("url");
    const name = props.node.data.get("name");

    const handleRemove = () => {
      const change = editor.state.value.change();
      change.removeNodeByKey(props.node.key);
      editor.onChange(change);
    };

    return (
      <div {...props.attributes} data-url={url}>
        <PdfWrapper
          url={url}
          name={name}
          onRemove={handleRemove}
          readOnly={editor.props.readOnly}
        />
      </div>
    );
  },
};

export default pdfPlugin;
