import PluginInterface from "../../interfaces/pluginInterface";
import renderNode from "./renderNode";
import schema from "./schema";

export default class TablePlugin implements PluginInterface {
  static nodeType = "table";

  static split: any;

  public nodeType = TablePlugin.nodeType;

  public objectType: "block" = "block";

  public showMenu = false;

  public schema: any = schema;

  public normalizeNode: any;

  public renderNode: (props: any) => any;

  public registerBtn(btns: any[]) {
    return btns;
  }

  constructor(self: any) {
    this.renderNode = renderNode(self, TablePlugin.nodeType);
  }
}
