import * as React from "react";

class VedioExtension extends React.Component<any> {
  inputRef = React.createRef<HTMLInputElement>();

  handleClick = () => {
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      let change = this.props.change.focus().insertBlock({
        object: "block",
        type: "object",
        isVoid: true,
        data: {
          data:
            "http://vodkgeyttp8.vod.126.net/cloudmusic/b3d1/core/cc53/3ed43d55b6053eee8adea6b93690a434.mp4?wsSecret=451139028541cdc174835e7993506cc2&wsTime=1592394746",
        },
      });
      this.props.update(change);
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

export default VedioExtension;
