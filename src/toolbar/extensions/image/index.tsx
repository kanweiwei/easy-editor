import * as React from "react";
import "./style.less";

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
        <span className="tool-insert-image" />
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

export default ImageExtension;
