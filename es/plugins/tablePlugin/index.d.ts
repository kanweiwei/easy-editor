/// <reference types="react" />
import { DefaultTreeElement } from "parse5";
declare const tablePlugin: {
    type: string;
    object: string;
    nodeType: string;
    importer(el: DefaultTreeElement, next: Function): any;
    exporter(node: any, children: any): any;
    render: (editor: any, props: any) => JSX.Element;
};
export default tablePlugin;
