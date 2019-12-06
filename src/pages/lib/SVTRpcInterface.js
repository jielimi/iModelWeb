import { RpcInterface, RpcManager } from "@bentley/imodeljs-common";

/** Display Performance RPC interface. */
export default class SVTRpcInterface extends RpcInterface {
  /** The immutable name of the interface. */
  static interfaceName = "SVTRpcInterface";

  /** The version of the interface. */
  static interfaceVersion = "1.0.0";

  /** The types that can be marshaled by the interface. */
  static types = () => [];

  static getClient() {
    return RpcManager.getClientForInterface(SVTRpcInterface);
  }

  readExternalSavedViews() {
    return this.forward(arguments);
  }
  writeExternalSavedViews() {
    return this.forward(arguments);
  }
}