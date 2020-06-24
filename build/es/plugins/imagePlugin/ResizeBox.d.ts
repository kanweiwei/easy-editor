/// <reference types="lodash" />
import * as React from "react";
import "./style.less";
declare class ResizeBox extends React.Component<any, any> {
    rootDom: any;
    target: any;
    editorDom: any;
    debouncedChange: ((width: number, height: number) => void) & import("lodash").Cancelable;
    startResize: (e: any) => void;
    endResize: (e: any) => void;
    findParentBlockDom: (child: any) => any;
    resizing: (e: any) => void;
    componentDidMount(): void;
    render(): JSX.Element;
}
export default ResizeBox;
