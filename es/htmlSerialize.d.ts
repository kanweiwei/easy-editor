import Html from "@zykj/slate-html-serializer";
export declare const blockTags: {
    div: string;
    p: string;
    table: string;
    tbody: string;
    tr: string;
    td: string;
    addreess: string;
    article: string;
    aside: string;
    blockquote: string;
    canvas: string;
    dd: string;
    dl: string;
    fieldset: string;
    figcaption: string;
    figure: string;
    footer: string;
    form: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    header: string;
    hgroup: string;
    hr: string;
    noscript: string;
    ol: string;
    output: string;
    pre: string;
    section: string;
    tfoot: string;
    ul: string;
    video: string;
    embed: string;
    object: string;
};
export declare const inlineTags: {
    span: string;
    ruby: string;
    rt: string;
    rp: string;
    tt: string;
    abbr: string;
    acronym: string;
    cite: string;
    code: string;
    dfn: string;
    kbd: string;
    samp: string;
    var: string;
    a: string;
    bdo: string;
    img: string;
    map: string;
    object: string;
    q: string;
    script: string;
    button: string;
    input: string;
    label: string;
    select: string;
    textarea: string;
};
export declare const markTags: {
    b: string;
    bold: string;
    sub: string;
    sup: string;
    u: string;
    i: string;
    em: string;
};
declare class HtmlSerialize {
    rules: ({
        deserialize(el: any, next: any): any;
    } | {
        deserialize(el: any): any;
    } | {
        serialize(obj: any, children: any): any;
    })[];
    converter(): Html;
}
export default HtmlSerialize;
