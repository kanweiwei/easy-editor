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

### License

Apache 2.0
