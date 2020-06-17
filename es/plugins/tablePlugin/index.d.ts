import PluginInterface from "../../interfaces/pluginInterface";
export default class TablePlugin implements PluginInterface {
    static nodeType: string;
    static split: any;
    nodeType: string;
    objectType: "block";
    showMenu: boolean;
    schema: any;
    normalizeNode: any;
    renderNode: (props: any) => any;
    registerBtn(btns: any[]): any[];
    constructor(self: any);
}
