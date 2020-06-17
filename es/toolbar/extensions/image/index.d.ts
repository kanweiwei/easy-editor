import * as React from "react";
import "./style.less";
declare class ImageExtension extends React.Component<any> {
    inputRef: React.RefObject<HTMLInputElement>;
    handleClick: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    render(): JSX.Element;
}
export default ImageExtension;
