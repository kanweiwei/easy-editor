<h1 align="center">Slate Editor</h1>
<div align="center">A rich text editor based on slate </div>

## Quick Start

### npm

```bash
npm install slate-editor --save
```

### yarn

```bash
yarn install slate-editor -S
```

### with React

```typescript
import * as React from "react";
import ReactDom from "react-dom";
import SlateEditor from "slate-editor";

class Editor extends React.Component {
  html = "";

  handleChange = (v: any) => {
    console.log("change=>>>", v);
    console.log(valueTohtml(v.change.value));
    this.html = valueTohtml(v.change.value);
  };

  render() {
    return <SlateEditor value={"<p>123</p>"} onChange={this.handleChange} />;
  }
}

ReactDom.render(<Editor />, document.getElementById("root"));
```

### Custom toolbar

For convenience, some tools have been built in the toolbar.
tool| instructions|
-|:-:|
bold| 加粗|
italic| 斜体|
u| 下划线|
left|文字居左|
right|文字居右|
center|文字居中|
justify|两端对齐|
image| 插入图片|
video | 插入音频（mp4、webm）|

#### How to add a custom tool ?

```typescript
import * as React from "react";
import ReactDom from "react-dom";
import SlateEditor from "slate-editor";

// audio tool
class AudioControl extends React.Component {
  inputRef = React.createRef();

  handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (file) {
      if (this.props.beforeUpload) {
        let url = await this.props.beforeUpload(file);
        if (url) {
          let change = this.props.change.focus().insertInline({
            object: "inline",
            type: "audio",
            isVoid: true,
            data: {
              src: url,
            },
          });
          this.props.update(change);
        }
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

class Editor extends React.Component {
  html = "";

  handleChange = (v: any) => {
    console.log("change=>>>", v);
    console.log(valueTohtml(v.change.value));
    this.html = valueTohtml(v.change.value);
  };

  render() {
    return (
      <SlateEditor
        value={"<p>123</p>"}
        onChange={this.handleChange}
        controls={[
          ["bold", "u", "image"],
          [
            {
              type: "audio",
              component: (change, update, beforeUpload) => {
                return (
                  <AudioControl
                    change={change}
                    update={update}
                    beforeUpload={beforeUpload}
                  />
                );
              },
            },
          ],
        ]}
      />
    );
  }
}
```

---

### License

Apache 2.0
