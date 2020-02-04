import { IModelApp,Tool} from "@bentley/imodeljs-frontend";

export class PurgeTileTreesTool extends Tool{
  static toolId = "PurgeTileTrees";
  static get minArgs() { return 0; }
  static get maxArgs() { return undefined; }

  run(modelIds) {
    const vp = IModelApp.viewManager.selectedView;
    if (undefined === vp)
      return true;

    if (undefined !== modelIds && 0 === modelIds.length)
      modelIds = undefined;

    vp.iModel.tiles.purgeTileTrees(modelIds).then(() => { // tslint:disable-line:no-floating-promises
      IModelApp.viewManager.refreshForModifiedModels(modelIds);
    });

    return true;
  }

   parseAndRun(...args) {
    return this.run(args);
  }

}