import { AST } from "parse5";

export default interface EditorPlugin {
  type: "node" | "mark";
  object: "block" | "inline" | "mark" | string[];
  nodeType: string;
  schema?: any;
  importer(el: AST.Default.Element, next: Function): any;
  exporter(node: any, children: any): any;
  render(editor: any, props: any): any;
  [p: string]: any;
}
