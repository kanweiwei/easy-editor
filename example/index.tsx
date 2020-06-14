import * as React from "react";
import ReactDom from "react-dom";
import SlateEditor from "slate-editor";

class Editor extends React.Component {
  handleChange = (v) => {
    console.log(v);
  };

  render() {
    return <SlateEditor onChange={this.handleChange} />;
  }
}

ReactDom.render(<Editor />, document.getElementById("root"));
