import * as React from "react";
import createObjectURL from "../../../utils/createObjectURL";
import "./style.less";

const acceptTypes = ["application/pdf"];

class PdfExtension extends React.Component<any> {
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
        let url = createObjectURL(file);
        if (typeof url == "string") {
          if (this.props.beforeUpload) {
            url = await this.props.beforeUpload(file, url);
          }
          if (url) {
            const change = this.props.change.focus().insertBlock({
              object: "block",
              type: "pdf",
              isVoid: true,
              data: {
                url,
                name: file.name,
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
        <span className="tool-insert-pdf" />
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

export default PdfExtension;
