import {
  IModelApp,
  TileAdmin,
  IModelConnection,
  ScreenViewport,
  PerformanceMetrics
} from "@bentley/imodeljs-frontend";
import { IModelBankAuthorizationClient } from "./IModelBankAuthorizationClient";
import { OpenMode } from "@bentley/bentleyjs-core";
import { IModelVersion } from "@bentley/imodeljs-common";
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";

import { initRpc } from "./rpc";

export class SimpleViewApp {
  static iModel;
  static project;
  static connection;
  static viewState;
  static viewport;
  static viewList;
  static selectedViewSpec;
  static categoryList;

  static context;
  static version;
  static vpDiv;

  static tileAdminProps = {
    retryInterval: 50,
    enableInstancing: true,
    defaultTileSizeModifier: 1
  };

  static _metrics;
  static _fps = "0";
  static _timeout;

  static get initialized() {
    return IModelApp.initialized;
  }

  static get fps() {
    return this._fps;
  }

  static enableFps() {
    this.viewport.continuousRendering = true;
    this._metrics = new PerformanceMetrics(false, true);
    this.viewport.target.performanceMetrics = this._metrics;
    this._timeout = window.setInterval(() => {
      this._fps = (
        this._metrics.spfTimes.length / this._metrics.spfSum
      ).toFixed(2);
    }, 500);
  }

  static disableFps() {
    this.viewport.continuousRendering = false;
    if (this._timeout) {
      window.clearInterval(this._timeout);
    }
  }

  /** This method must be called before any iModel.js frontend services are used. */
  static startup(projectId, url, opts = {}) {
    initRpc();

    this.context = new IModelBankAccessContext(
      projectId,
      url,
      undefined,
      undefined
    );

    opts.imodelClient = this.context.client;

    opts.tileAdmin = TileAdmin.create(SimpleViewApp.tileAdminProps);

    IModelApp.startup(opts);

    IModelApp.renderSystem.enableDiagnostics(6); // RenderDiagnostics.ALL
  }

  /** Must be called before the application exits to release any held resources. */
  static shutdown() {
    IModelApp.shutdown();
  }

  static async render(version, vpDiv) {
    this.version = version;
    this.vpDiv = vpDiv;

    await this.loginAndOpenIModel();

    await this.buildViewList();

    this.openView();
  }

  /**
   * Look up a tool by toolId and, if found, create an instance with the supplied arguments and run it.
   * @param toolId toolId of the immediate tool
   * @param args arguments to pass to the constructor, and to run.
   * @return true if the tool was found and successfully run.
   */
  static run(toolId, ...args) {
    return IModelApp.tools.run(toolId, this.viewport, ...args);
  }
  /** Get a list of Tools currently registered, excluding hidden tools */
  static getToolList() {
    return IModelApp.tools.getToolList();
  }

  static async buildCategoryList() {
    const selectUsedSpatialCategoryIds =
      "SELECT DISTINCT Category.Id as CategoryId from BisCore.GeometricElement3d WHERE Category.Id IN (SELECT ECInstanceId from BisCore.SpatialCategory)";
    const selectUsedDrawingCategoryIds =
      "SELECT DISTINCT Category.Id as CategoryId from BisCore.GeometricElement2d WHERE Model.Id=? AND Category.Id IN (SELECT ECInstanceId from BisCore.DrawingCategory)";
    const selectCategoryProps =
      "SELECT ECInstanceId as id, CodeValue as code, UserLabel as label FROM ";
    const selectSpatialCategoryProps =
      selectCategoryProps +
      "BisCore.SpatialCategory WHERE ECInstanceId IN (" +
      selectUsedSpatialCategoryIds +
      ")";
    const selectDrawingCategoryProps =
      selectCategoryProps +
      "BisCore.DrawingCategory WHERE ECInstanceId IN (" +
      selectUsedDrawingCategoryIds +
      ")";

    const ecsql = this.viewState.is3d()
      ? selectSpatialCategoryProps
      : selectDrawingCategoryProps;

    const bindings = this.viewState.is2d()
      ? [this.viewState.baseModelId]
      : undefined;

    this.categoryList = [];

    for await (const row of this.viewState.iModel.query(
      `${ecsql} LIMIT 1000`,
      bindings
    )) {
      this.categoryList.push(row);
    }

    console.log(
      this.viewState.categorySelector.categories.has("0x30000000002")
    );
  }

  static async changeView(id) {
    const viewSpec = this.viewList.find(i => i.id === id);

    if (!viewSpec) {
      throw new Error("No such view.");
    }

    const view = await this.connection.views.load(viewSpec.id);

    const viewState = view.clone();

    this.viewport.changeView(viewState);

    this.viewState = viewState;

    this.selectedViewSpec = viewSpec;
  }

  static async loginAndOpenIModel() {
    const { projectId, name: versionName } = this.version;

    IModelApp.authorizationClient = new IModelBankAuthorizationClient({
      sub: "userId",
      email: "email@organization.org",
      given_name: "first",
      family_name: "last",
      org: "orgId",
      org_name: "organization"
    });

    this.iModel = { wsgId: projectId, ecId: projectId };

    this.project = { wsgId: "", ecId: "", name: "ReadOnlyTest" };

    const contextId = this.context.toIModelTokenContextId();

    this.connection = await IModelConnection.open(
      contextId,
      projectId,
      OpenMode.Readonly,
      versionName ? IModelVersion.named(versionName) : IModelVersion.latest()
    );
  }

  static async buildViewList() {
    const viewQueryParams = { want: false };

    this.viewList = await this.connection.views.getViewList(viewQueryParams);

    if (this.viewList.length <= 0) {
      throw new Error("No view specs.");
    }

    this.selectedViewSpec = this.viewList[0];

    this.viewState = await this.connection.views.load(this.selectedViewSpec.id);
  }

  static openView() {
    this.viewport = ScreenViewport.create(this.vpDiv, this.viewState.clone());

    IModelApp.viewManager.addViewport(this.viewport);
  }
}
