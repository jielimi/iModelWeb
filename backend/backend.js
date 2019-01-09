"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
|  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
 *--------------------------------------------------------------------------------------------*/
const imodeljs_backend_1 = require("@bentley/imodeljs-backend");
const bentleyjs_core_1 = require("@bentley/bentleyjs-core");
const imodeljs_common_1 = require("@bentley/imodeljs-common");
const fs = require("fs");
const path = require("path");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // (needed temporarily to use self-signed cert to communicate with iModelBank via https)
function getRpcInterfaces() {
    return [imodeljs_common_1.IModelTileRpcInterface, imodeljs_common_1.StandaloneIModelRpcInterface, imodeljs_common_1.IModelReadRpcInterface];
}
exports.getRpcInterfaces = getRpcInterfaces;
function setupStandaloneConfiguration() {
    const filename = process.env.SVT_STANDALONE_FILENAME;
    if (filename !== undefined) {
        const configuration = {};
        configuration.standalone = true;
        configuration.standalonePath = process.env.SVT_STANDALONE_FILEPATH; // optional (browser-use only)
        configuration.viewName = process.env.SVT_STANDALONE_VIEWNAME; // optional
        configuration.iModelName = filename;
        fs.writeFileSync(path.join(__dirname, "public", "configuration.json"), JSON.stringify(configuration), "utf8");
    }
}
function initializeBackend() {
    setupStandaloneConfiguration();
    imodeljs_backend_1.IModelHost.startup();
    bentleyjs_core_1.Logger.initializeToConsole(); // configure logging for imodeljs-core
}
exports.initializeBackend = initializeBackend;
//# sourceMappingURL=backend.js.map