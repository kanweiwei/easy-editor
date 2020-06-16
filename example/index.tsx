import * as React from "react";
import ReactDom from "react-dom";
import SlateEditor from "slate-editor";

class Editor extends React.Component {
  editorRef = React.createRef();

  handleChange = (v) => {
    console.log(v);
  };

  render() {
    return (
      <SlateEditor
        html="<p> <p>"
        onChange={this.handleChange}
        ref={this.editorRef}
      />
    );
  }
}

ReactDom.render(<Editor />, document.getElementById("root"));
