import * as React from "react";
import "./style.less";
declare class Menu extends React.Component<any, any> {
    hasMark(type: string): boolean;
    onClickMark: (event: any, type: string) => void;
    onClickBlock: (event: any, onClick?: ((...args: any[]) => {}) | undefined, options?: any) => any;
    renderMarkButton: (type: string, icon: JSX.Element, title: string) => JSX.Element;
    renderBlockButton(type: string, icon: string, title: string, onClick?: () => {}): JSX.Element;
    renderIndentButton: (type: string, icon: string, title: string) => JSX.Element;
    setAlign: (e: any, align: string) => void;
    renderAlign: (align: string, icon: JSX.Element, title: string) => JSX.Element;
    renderAlignJustify: () => JSX.Element;
    renderMarkBtns: () => JSX.Element;
    render(): JSX.Element;
}
export default Menu;
