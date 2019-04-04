// import * as common_1 from "@bentley/imodeljs-common/lib/common"
import {
    BentleyCloudRpcManager,
    IModelReadRpcInterface,
    IModelTileRpcInterface,
    IModelToken,
    RpcOperation,
    StandaloneIModelRpcInterface
  } from "@bentley/imodeljs-common";
import { OpenMode } from "@bentley/bentleyjs-core";

let RPC = {
    init:function() {
        let rpcConfiguration;
        rpcConfiguration = BentleyCloudRpcManager.initializeClient({ info: { title: "SimpleViewApp", version: "v1.0" } },
         [IModelTileRpcInterface, StandaloneIModelRpcInterface, IModelReadRpcInterface]);
        // WIP: WebAppRpcProtocol seems to require an IModelToken for every RPC request. ECPresentation initialization tries to set active locale using
        // RPC without any imodel and fails...
        for (const definition of rpcConfiguration.interfaces())
          RpcOperation.forEach(definition, (operation) => operation.policy.token = (_request) => new IModelToken("test", "test", "test", "test", OpenMode.Readonly));
    }
}

export default RPC