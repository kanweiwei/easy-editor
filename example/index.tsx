import * as React from "react";
import ReactDom from "react-dom";
import audioPlugin from "./audioPlugin.tsx";

import EasyEditor from "../build/es";

class ImageExtension extends React.Component<any> {
  inputRef = React.createRef<HTMLInputElement>();

  handleClick = () => {
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        let change = this.props.change.focus().insertInline({
          object: "inline",
          type: "image",
          isVoid: true,
          data: {
            src: reader.result,
          },
        });
        this.props.update(change);
      };
      reader.readAsDataURL(file);
    }
  };

  render() {
    return (
      <span onMouseDown={this.handleClick}>
        图片
        <input
          type="file"
          style={{ width: 0, height: 0, opacity: 0 }}
          ref={this.inputRef}
          onChange={this.handleChange}
        />
      </span>
    );
  }
}

class Editor extends React.Component {
  editorRef = React.createRef<EasyEditor>();

  handleChange = (v: any) => {
    console.log("change=>>>", v);
    if (this.editorRef.current) {
      // value to html
      console.log(this.editorRef.current.convertor.serialize(v.change.value));
    }
  };

  handleBeforeUpload = (file: any, dataURI: any) => {
    console.log(file, dataURI);
    return dataURI;
  };

  render() {
    return (
      <EasyEditor
        value={`<p> </p><span data-type='math-content' data-tex='1+2 = 3'>`}
        onChange={this.handleChange}
        beforeUpload={this.handleBeforeUpload}
        plugins={[audioPlugin]}
        ref={this.editorRef}
      />
    );
  }
}

ReactDom.render(<Editor />, document.getElementById("root"));
