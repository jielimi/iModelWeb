"use strict";
/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const bentleyjs_core_1 = require("@bentley/bentleyjs-core");
const imodeljs_common_1 = require("@bentley/imodeljs-common");
const imodeljs_frontend_1 = require("@bentley/imodeljs-frontend");
/** Supplies imagery based on weather forecast. */
class WMSImageryProvider extends imodeljs_frontend_1.ImageryProviderEPSG3857 {
    constructor(imageryType, _i18n, _i18NNamespace, _logoImage) {
        super();
        this._i18n = _i18n;
        this._i18NNamespace = _i18NNamespace;
        this._logoImage = _logoImage;
        // this url should be generated from a user interface that allows selection of forecast parameters.
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const timeString = date.toISOString();
        this._baseUrl = "";
        if (0 /* Temperature */ === imageryType) {
            this._baseUrl =
                "http://wms.actionmodulers.com/wms/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&" +
                    `TRANSPARENT=true&LAYERS=TM_WORLD_BORDERS-0.3%2CHRRR_USA_0.03_SubHourly%20%5Bair%20temperature%5D&TILED=true&MAP_TYPE=DEF&TIME=${timeString}` +
                    "&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX={BoundingBox}";
        }
        else {
            this._baseUrl =
                "http://wms.actionmodulers.com/wms/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&" +
                    `TRANSPARENT=true&LAYERS=TM_WORLD_BORDERS-0.3%2CHRRR_USA_0.03_SubHourly%20%5Bprecipitation%5D&TILED=true&MAP_TYPE=DEF&TIME=${timeString}` +
                    "&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX={BoundingBox}";
        }
    }
    get tileWidth() { return 256; }
    get tileHeight() { return 256; }
    get minimumZoomLevel() { return 4; }
    get maximumZoomLevel() { return 20; }
    // construct the Url from the desired Tile
    constructUrl(row, column, zoomLevel) {
        const tileExtent = this.getEPSG3857Extent(row, column, zoomLevel);
        const bboxString = `${tileExtent.left},${tileExtent.bottom},${tileExtent.right},${tileExtent.top}`;
        // from the template url, construct the tile url.
        return this._baseUrl.replace("{BoundingBox}", bboxString);
    }
    /** Supplies attribution for the wms supplier. */
    getImageryLogo(_tileProvider) {
        return imodeljs_frontend_1.IModelApp.makeLogoCard({ iconSrc: this._logoImage, heading: "WMS", notice: this._i18n.translate("WmsPlugin:Messages.Copyright") });
    }
    async initialize() {
        return this._i18NNamespace.readFinished;
    }
}
/** Supplies a TileTree that can load and draw tiles based on our imagery provider.
 * The TileTree is uniquely identified by its imagery type.
 */
class WMSTreeSupplier {
    constructor(plugin) {
        this._plugin = plugin;
    }
    /** Return a numeric value indicating how two tree IDs are ordered relative to one another.
     * This allows the ID to serve as a lookup key to find the corresponding TileTree.
     */
    compareTileTreeIds(lhs, rhs) {
        return bentleyjs_core_1.compareNumbers(lhs, rhs);
    }
    /** The first time a tree of a particular imagery type is requested, this function creates it. */
    async createTileTree(type, iModel) {
        return imodeljs_frontend_1.createTileTreeFromImageryProvider(this._plugin.imageryProviders[type], 0.0, false, imodeljs_common_1.GlobeMode.Columbus, iModel);
    }
}
/** A reference to one of our tile trees. The specific TileTree drawn may change when the desired imagery type or target iModel changes. */
class WMSTreeRef extends imodeljs_frontend_1.MapTileTreeReference {
    constructor(plugin, iModel) {
        super();
        this._plugin = plugin;
        this.iModel = iModel;
    }
    /** Draw our tiles on top of all other geometry (semi-transparent). */
    get _graphicType() { return imodeljs_frontend_1.TileTree.GraphicType.Overlay; }
    /** Draw our tiles at sea level. */
    get _groundBias() { return 0.0; }
    get _imageryProvider() { return this._plugin.currentImageryProvider; }
    get _transparency() { return 0.7; }
    /** Return the owner of the TileTree to draw. */
    get treeOwner() {
        return this.iModel.tiles.getTileTreeOwner(this._plugin.currentImageryType, this._plugin.treeSupplier);
    }
}
/** Integrates with a Viewport to inject our own tiled graphics for display. */
class WMSGraphicsProvider {
    constructor(iModel, plugin) {
        this._tree = new WMSTreeRef(plugin, iModel);
    }
    /** Returns the tree containing the tiles to be drawn in the specified viewport. */
    forEachTileTreeRef(vp, func) {
        // In case the user opened a view from a different iModel, make sure the tree reference uses the current iModel.
        this._tree.iModel = vp.iModel;
        func(this._tree);
    }
}
class WMSPlugin extends imodeljs_frontend_1.Plugin {
    constructor(name) {
        super(name);
        this.imageryProviders = [];
        this._currentImageryType = 1 /* Precipitation */;
        this.treeSupplier = new WMSTreeSupplier(this);
    }
    get currentImageryType() { return this._currentImageryType; }
    get currentImageryProvider() { return this.imageryProviders[this.currentImageryType]; }
    /** Invoked the first time this plugin is loaded. */
    onLoad(_args) {
        this._i18NNamespace = this.i18n.registerNamespace("WmsPlugin");
        const logoImage = this.resolveResourceUrl("wmsPlugin.svg");
        this.imageryProviders.push(new WMSImageryProvider(0 /* Temperature */, this.i18n, this._i18NNamespace, logoImage));
        this.imageryProviders.push(new WMSImageryProvider(1 /* Precipitation */, this.i18n, this._i18NNamespace, logoImage));
    }
    /** Invoked each time this plugin is loaded. */
    onExecute(_args) {
        
        const selectedView = imodeljs_frontend_1.IModelApp.viewManager.selectedView;
        if (undefined === selectedView)
            return;
        if (undefined === this._graphicsProvider)
            this._graphicsProvider = new WMSGraphicsProvider(selectedView.iModel, this);
        // Register our provider to supply tiles into the selected viewport (if not already registered)
        selectedView.addTiledGraphicsProvider(this._graphicsProvider);
        // For demonstration purposes, switch the imagery type each time the plugin is loaded.
        this._currentImageryType = (0 /* Temperature */ === this._currentImageryType) ? 1 /* Precipitation */ : 0 /* Temperature */;
        // Output a message indicating the current imagery type.
        const weatherType = (0 /* Temperature */ === this._currentImageryType) ? "temperature" : "precipitation";
        this._i18NNamespace.readFinished.then(() => {
            const message = this.i18n.translate("WmsPlugin:Messages.DisplayType", { weatherType });
            const msgDetails = new imodeljs_frontend_1.NotifyMessageDetails(imodeljs_frontend_1.OutputMessagePriority.Info, message);
            imodeljs_frontend_1.IModelApp.notifications.outputMessage(msgDetails);
        }).catch(() => { });
    }
}

imodeljs_frontend_1.IModelApp.pluginAdmin.register(new WMSPlugin('wmsPlugin'));
//# sourceMappingURL=wmsPlugin.js.map