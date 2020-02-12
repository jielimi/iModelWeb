import {
    BentleyCloudRpcManager,
    IModelReadRpcInterface,
    IModelWriteRpcInterface,
    IModelTileRpcInterface,
    IModelToken,
    RpcOperation,
    SnapshotIModelRpcInterface,
    RpcConfiguration 
  } from "@bentley/imodeljs-common";
import { OpenMode } from "@bentley/bentleyjs-core";
import SVTRpcInterface from "./components/subComponents/saveViews/SVTRpcInterface";

let RPC = {
    init:function() {
        let rpcConfiguration;
        RpcConfiguration.developmentMode = true;
        rpcConfiguration = BentleyCloudRpcManager.initializeClient({ info: { title: "SimpleViewApp", version: "v1.0" } },
         [IModelTileRpcInterface, SnapshotIModelRpcInterface , IModelReadRpcInterface,IModelWriteRpcInterface,SVTRpcInterface]);
        
        for (const definition of rpcConfiguration.interfaces())
        RpcOperation.forEach(definition, (operation) => operation.policy.token = (request) => (request.findTokenPropsParameter() || new IModelToken("test", "test", "test", "test", OpenMode.Readonly)));
    }
}

export default RPC