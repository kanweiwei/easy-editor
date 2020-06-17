export default interface PluginInterface {
    nodeType: string;
    objectType: "block" | "inline" | "mark";
    showMenu: boolean;
    schema?: any;
    normalizeNode?: any;
    renderNode: (props: any) => any;
    registerBtn?: (btns: any[]) => any[];
}
