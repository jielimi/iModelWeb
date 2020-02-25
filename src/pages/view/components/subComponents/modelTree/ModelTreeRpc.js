import { RpcInterface, RpcManager } from "@bentley/imodeljs-common";
export default class ModelTreeRpcInterface extends RpcInterface {
    static getClient() {
        return RpcManager.getClientForInterface(ModelTreeRpcInterface);
    }
    listModelTree(token, clsFulName) {
        return this.forward(arguments);
    }
}
ModelTreeRpcInterface.interfaceName = "ModelTreeRpcInterface";
ModelTreeRpcInterface.interfaceVersion = "1.0.0";
ModelTreeRpcInterface.types = () => [];