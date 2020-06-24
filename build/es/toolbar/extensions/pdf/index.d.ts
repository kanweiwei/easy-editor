import * as React from "react";
import "./style.less";
declare class PdfExtension extends React.Component<any> {
    inputRef: React.RefObject<HTMLInputElement>;
    handleClick: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    render(): JSX.Element;
}
export default PdfExtension;
