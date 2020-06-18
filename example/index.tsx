import * as React from "react";
import ReactDom from "react-dom";
import EasyEditor, { valueTohtml } from "easy-editor";

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
  editorRef = React.createRef();

  handleChange = (v: any) => {
    console.log("change=>>>", v);
    console.log(valueTohtml(v.change.value));
  };

  handleBeforeUpload = (file: any, dataURI: any) => {
    console.log(file, dataURI);
    return dataURI;
  };

  render() {
    return (
      <EasyEditor
        value='<p>asdasd </p><object data="http://172.16.168.159:9000/test.mp4" ></object>'
        onChange={this.handleChange}
        beforeUpload={this.handleBeforeUpload}
        ref={this.editorRef}
      />
    );
  }
}

ReactDom.render(<Editor />, document.getElementById("root"));
