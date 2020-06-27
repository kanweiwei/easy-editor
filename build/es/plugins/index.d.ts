/// <reference types="react" />
declare const _default: (import("../interfaces/pluginInterface").default | {
    type: string;
    object: string;
    nodeType: string;
    importer(el: import("parse5").DefaultTreeElement, next: Function): any;
    exporter(node: any, children: any): any;
    render: (editor: any, props: any) => JSX.Element;
})[];
export default _default;
