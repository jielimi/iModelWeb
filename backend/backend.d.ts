import { IModelTileRpcInterface, StandaloneIModelRpcInterface, IModelReadRpcInterface } from "@bentley/imodeljs-common";
export declare function getRpcInterfaces(): (typeof IModelReadRpcInterface | typeof IModelTileRpcInterface | typeof StandaloneIModelRpcInterface)[];
export declare function initializeBackend(): void;
