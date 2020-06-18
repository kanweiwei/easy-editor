import * as React from "react";
import "./style.less";
declare class VideoExtension extends React.Component<any> {
    inputRef: React.RefObject<HTMLInputElement>;
    handleClick: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<any>;
    render(): JSX.Element;
}
export default VideoExtension;
