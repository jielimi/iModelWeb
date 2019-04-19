import {
    BentleyCloudRpcManager,
    IModelReadRpcInterface,
    IModelTileRpcInterface,
    IModelToken,
    RpcOperation,
    SnapshotIModelRpcInterface 
  } from "@bentley/imodeljs-common";
import { OpenMode } from "@bentley/bentleyjs-core";

let RPC = {
    init:function() {
        let rpcConfiguration;
        rpcConfiguration = BentleyCloudRpcManager.initializeClient({ info: { title: "SimpleViewApp", version: "v1.0" } },
         [IModelTileRpcInterface, SnapshotIModelRpcInterface , IModelReadRpcInterface]);
        
        for (const definition of rpcConfiguration.interfaces())
          RpcOperation.forEach(definition, (operation) => operation.policy.token = (_request) => new IModelToken("test", "test", "test", "test", OpenMode.Readonly));
    }
}

export default RPC