/// <reference types="node" />
import { Block, Value } from "@zykj/slate";
import * as React from "react";
import "./style.less";
interface IEditorProps {
    html?: string;
    /**
     * slate value
     */
    value?: any;
    minHeight?: number;
    plugins?: any[];
    autoFocus?: boolean;
    placeholder?: string;
    showMenu?: boolean;
    pasteOptions?: any;
    beforeUpload?: (file: File | Blob | Buffer | ArrayBuffer, dataURI: string) => string | Promise<string>;
    onUpdate?: (value: any, html?: string) => any;
    onBlur?: (e: any, change: any) => any;
    onChange?: (value: any) => any;
    onKeyDown?: (e: any, change: any) => any;
    onCompositionStart?: (e: any, change: any) => any;
    onCompositionEnd?: (e: any, change: any) => any;
    onSaveHtml?: (value: Value) => any;
    forbidIME?: boolean;
    originalContent?: any;
    style?: any;
    className?: string;
    readOnly?: boolean;
    disableMenu?: boolean;
    disableKeyDown?: boolean;
    disableComposition?: boolean;
    disableSelect?: boolean;
}
declare class SlateEditor extends React.Component<IEditorProps, any> {
    plugins: any[];
    isComposing: boolean;
    rafHandle: any;
    /**
     * 提示
     */
    info: any;
    /** 菜单 */
    menu: any;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    getState(name: string): any;
    onChange: (change: any) => void;
    update: (change: any) => void;
    onCompositionStart: (e: any, change: any) => any;
    onCompositionEnd: (e: any, change: any) => any;
    onBlur: (e: any, change: any) => void;
    /** 更新悬浮菜单位置 */
    updateMenu: () => void;
    resetByHtml: (html: any) => void;
    getValueByHtml: (html: any) => Value;
    /** 编辑器中插入Blocks */
    insertBlocks: (blocks: Block[]) => void;
    /** 菜单ref */
    menuRef: (menu: any) => void;
    /** 失去焦点 */
    handleBlur: (e: any) => void;
    renderMenu: (fixed?: boolean) => JSX.Element | null;
    renderEditor: () => JSX.Element;
    renderMask: () => JSX.Element | null;
    render(): JSX.Element;
}
export declare function valueTohtml(): import("@zykj/slate-html-serializer").default;
export default SlateEditor;
