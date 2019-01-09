"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
|  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
 *--------------------------------------------------------------------------------------------*/
const path = require("path");
const url = require("url");
const common_1 = require("@bentley/imodeljs-common/lib/common");
const backend_1 = require("./backend");
// we 'require' rather than the import, because there's a bug in the .d.ts files for electron 1.16.1
// (WebviewTag incorrectly implement HTMLElement) that prevents us from compiling with the import.
// import { app, protocol, BrowserWindow } from "electron";
// tslint:disable-next-line:no-var-requires
const electron = require("electron");
// --------------------------------------------------------------------------------------
// ------- Initialization and setup of host and tools before starting app ---------------
// Start the backend
backend_1.initializeBackend();
// --------------------------------------------------------------------------------------
// ---------------- This part copied from protogist ElectronMain.ts ---------------------
const isDevBuild = (process.env.NODE_ENV === "development");
const autoOpenDevTools = (undefined === process.env.SVT_NO_DEV_TOOLS);
let winRef;
function createWindow() {
    const win = new electron.BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            webSecurity: !isDevBuild,
            experimentalFeatures: true,
        },
        autoHideMenuBar: true,
    });
    winRef = win;
    if (autoOpenDevTools)
        winRef.toggleDevTools();
    if (isDevBuild) {
        win.loadURL(url.format({
            pathname: "localhost:3000",
            protocol: "http:",
            slashes: true,
        }));
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, "public/index.html"),
            protocol: "file:",
            slashes: true,
        }));
    }
    win.on("closed", () => {
        winRef = null;
    });
}
electron.app.on("ready", () => {
    // Initialize application gateway configuration for the backend
    common_1.ElectronRpcManager.initializeImpl({}, backend_1.getRpcInterfaces());
    createWindow();
});
// tslint:disable-next-line:no-var-requires
const configuration = require(path.join(__dirname, "public", "configuration.json"));
if (configuration.useIModelBank) {
    electron.app.on("certificate-error", (event, _webContents, _url, _error, _certificate, callback) => {
        // (needed temporarily to use self-signed cert to communicate with iModelBank via https)
        event.preventDefault();
        callback(true);
    });
}
electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron.app.quit();
});
// Handle custom keyboard shortcuts
electron.app.on("web-contents-created", (_e, wc) => {
    wc.on("before-input-event", (event, input) => {
        // CTRL + SHIFT + I  ==> Toggle DevTools
        if (input.key === "I" && input.control && !input.alt && !input.meta && input.shift) {
            if (winRef)
                winRef.toggleDevTools();
            event.preventDefault();
        }
    });
});
electron.app.on("activate", () => {
    if (winRef === null)
        createWindow();
});
//# sourceMappingURL=ElectronMain.js.map