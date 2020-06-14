import renderNode from "./renderNode";
import schema from "./schema";
var TablePlugin = /** @class */ (function () {
    function TablePlugin(self) {
        this.nodeType = TablePlugin.nodeType;
        this.objectType = "block";
        this.showMenu = false;
        this.schema = schema;
        this.renderNode = renderNode(self, TablePlugin.nodeType);
    }
    TablePlugin.prototype.registerBtn = function (btns) {
        return btns;
    };
    TablePlugin.nodeType = "table";
    return TablePlugin;
}());
export default TablePlugin;