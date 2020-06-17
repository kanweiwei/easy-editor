import * as React from "react";
import "./style.less";
declare type Control = {
    object?: "mark" | "align";
    type: string;
    placeholder?: string;
    component: React.ReactElement | Function;
};
declare class ToolBar extends React.Component<any, any> {
    hasMark(type: string): boolean;
    onClickMark: (event: any, type: string) => void;
    renderComponent: (component: React.ReactElement | Function) => any;
    renderMarkBtn: (item: Control) => JSX.Element;
    renderIndentButton: (type: string, icon: string, title: string) => JSX.Element;
    setAlign: (e: any, align: string) => void;
    setAlignJustify: (e: any) => void;
    renderAlign: (control: Control) => JSX.Element;
    renderControls: () => any;
    render(): JSX.Element;
}
export default ToolBar;
