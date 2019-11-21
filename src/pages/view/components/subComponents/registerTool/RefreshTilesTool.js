import { Tool} from "@bentley/imodeljs-frontend";
export class RefreshTilesTool extends Tool {
    static toolId = "RefreshTiles";
    static get maxArgs() { return undefined; }
 
    run(changedModelIds) {
     if (undefined !== changedModelIds && 0 === changedModelIds.length)
       changedModelIds = undefined;
 
     IModelApp.viewManager.refreshForModifiedModels(changedModelIds);
     return true;
   }
 
    parseAndRun(...args) {
     return this.run(args);
   }
 }

  