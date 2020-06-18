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

```javascript
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

---

### License

Apache 2.0
