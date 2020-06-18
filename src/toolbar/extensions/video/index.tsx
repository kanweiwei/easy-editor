import * as React from "react";
import "./style.less";

const acceptTypes = ["video/mp4", "video/webm"];

class VideoExtension extends React.Component<any> {
  inputRef = React.createRef<HTMLInputElement>();

  handleClick = () => {
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  };

  handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<any> => {
    const file = e?.target?.files?.[0];
    e.target.value = "";
    if (file) {
      if (acceptTypes.includes(file.type)) {
        if (this.props.beforeUpload) {
          let url = await this.props.beforeUpload(file);
          if (url) {
            let change = this.props.change.focus().insertBlock({
              object: "block",
              type: "object",
              isVoid: true,
              data: {
                data: url,
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
        <span className="tool-insert-video" />
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

export default VideoExtension;
