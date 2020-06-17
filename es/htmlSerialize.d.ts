import Html from "@zykj/slate-html-serializer";
export declare function getStyleFromData(node: any): any;
export declare function getStyleFromString(str: string): {};
declare class HtmlSerialize {
    _converter: Html;
    rules: {
        serialize(obj: any, children: any): any;
    }[];
    converter(): Html;
}
export default HtmlSerialize;
