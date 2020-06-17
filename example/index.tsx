import * as React from "react";
import ReactDom from "react-dom";
import SlateEditor from "slate-editor";

class Editor extends React.Component {
  editorRef = React.createRef();

  handleChange = (v: any) => {
    console.log(v);
  };

  handleBeforeUpload = (file: any, dataURI: any) => {
    console.log(file, dataURI);
    return dataURI;
  };

  render() {
    return (
      <SlateEditor
        html="<p> </p>"
        onChange={this.handleChange}
        beforeUpload={this.handleBeforeUpload}
        ref={this.editorRef}
      />
    );
  }
}

ReactDom.render(<Editor />, document.getElementById("root"));
