import { RpcInterface, RpcManager } from "@bentley/imodeljs-common";
export default class ItemTreeRpcInterface extends RpcInterface {
    static getClient() {
        return RpcManager.getClientForInterface(ItemTreeRpcInterface);
    }
    listItems(token) {
        return this.forward(arguments);
    }
    listInstances(token, clsFulName) {
        return this.forward(arguments);
    }
}
ItemTreeRpcInterface.interfaceName = "ItemTreeRpcInterface";
ItemTreeRpcInterface.interfaceVersion = "1.0.0";
ItemTreeRpcInterface.types = () => [];
