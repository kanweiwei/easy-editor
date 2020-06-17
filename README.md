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
  handleChange = (change) => {
    console.log(change);
  };

  render() {
    return <SlateEditor onChange={this.handleChange} />;
  }
}

ReactDom.render(<Editor />, document.getElementById("root"));
```

### Custom toolbar

For convenience, some tools have been built in the toolbar.
tool| instructions|
-|-|-
bold| 加粗|
italic| 斜体|
u| 下划线|
left|文字居左
right|文字居右
center|文字居中
justify|两端对齐
image| 插入图片

---

### License

Apache 2.0
