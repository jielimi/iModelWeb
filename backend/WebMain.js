"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cp = require("child_process");
const imodeljs_common_1 = require("@bentley/imodeljs-common");
const imodeljs_clients_1 = require("@bentley/imodeljs-clients");
const imodeljs_common_2 = require("@bentley/imodeljs-common");
const bentleyjs_core_1 = require("@bentley/bentleyjs-core");
const backend_1 = require("./backend");
// tslint:disable:no-console
function getRpcInterfaces() {
    return [imodeljs_common_2.IModelTileRpcInterface, imodeljs_common_2.StandaloneIModelRpcInterface, imodeljs_common_2.IModelReadRpcInterface];
}
exports.getRpcInterfaces = getRpcInterfaces;
// Initialize the backend
backend_1.initializeBackend();
// Start the dev-cors-proxy-server
const proxyServer = cp.spawn("node", ["./node_modules/@bentley/dev-cors-proxy-server/server.js", "--serve-over-https"]);
proxyServer.stdout.on("data", (data) => {
    console.log(`proxy server: ${data}`);
});
proxyServer.stderr.on("data", (data) => {
    console.log(`proxy server: ${data}`);
});
proxyServer.on("close", (code) => {
    console.log(`proxy server terminated with code ${code}`);
});
// Initialize additional web-specific backend parts
imodeljs_clients_1.Config.devCorsProxyServer = "https://localhost:3001";
bentleyjs_core_1.Logger.setLevelDefault(bentleyjs_core_1.LogLevel.Error);
bentleyjs_core_1.Logger.setLevel("imodeljs-clients", bentleyjs_core_1.LogLevel.Trace);
// Set up the ability to serve the supported rpcInterfaces via web requests
const cloudConfig = imodeljs_common_1.BentleyCloudRpcManager.initializeImpl({ info: { title: "SimpleViewApp", version: "v1.0" } }, getRpcInterfaces());
const app = express();
app.use(bodyParser.text());
// Enable CORS for all apis
app.all("/*", (_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-Requested-With");
    next();
});
// --------------------------------------------
// Routes
// --------------------------------------------
app.use(express.static(path.resolve(__dirname, "public")));
app.get("/v3/swagger.json", (req, res) => cloudConfig.protocol.handleOpenApiDescriptionRequest(req, res));
app.post("*", async (req, res) => cloudConfig.protocol.handleOperationPostRequest(req, res));
// ---------------------------------------------
// Run the server...
// ---------------------------------------------
app.set("port", 3000);
// tslint:disable-next-line:no-console
app.listen(app.get("port"), () => console.log("***** SimpleViewTest running on localhost:" + app.get("port")));
//# sourceMappingURL=WebMain.js.map