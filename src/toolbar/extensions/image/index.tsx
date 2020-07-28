import * as React from "react";
import "./style.less";

const acceptTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "application/pdf",
];

class ImageExtension extends React.Component<any> {
  inputRef = React.createRef<HTMLInputElement>();

  handleClick = () => {
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  };

  handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    e.target.value = "";
    if (file) {
      if (acceptTypes.includes(file.type)) {
        let url = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = () => {
            reject(new Error("error"));
          };
          reader.readAsDataURL(file);
        });
        if (typeof url == "string") {
          if (this.props.beforeUpload) {
            url = await this.props.beforeUpload(file, url);
            url = window.URL.createObjectURL(file);
          }
          if (url) {
            const change = this.props.change.focus().insertInline({
              object: "inline",
              type: "image",
              isVoid: true,
              data: {
                src: url,
              },
            });

            this.props.update(change);
          }
        }
      } else {
        throw new Error(
          `Only accept ${acceptTypes
            .map((v) => v.split("/")[1])
            .join("、")}, but the file type is ${file.type}`
        );
      }
    }
  };

  render() {
    return (
      <span onMouseDown={this.handleClick}>
        <span className="tool-insert-image" />
        <input
          type="file"
          style={{ width: 0, height: 0, opacity: 0, position: "absolute" }}
          ref={this.inputRef}
          onChange={this.handleChange}
        />
      </span>
    );
  }
}

export default ImageExtension;
