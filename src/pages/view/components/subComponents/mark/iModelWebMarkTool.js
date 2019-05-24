import {
    IModelApp, PrimitiveTool,
    EventHandled,
  } from "@bentley/imodeljs-frontend";
 import {IncidentMarkerDemo} from "./incentMaker"


class MarkTool extends PrimitiveTool {
    constructor() {
        super(...arguments);
        this.points = [];
    }
    isCompatibleViewport(vp, isSelectedViewChange) { return (super.isCompatibleViewport(vp, isSelectedViewChange) && undefined !== vp && vp.view.isSpatialView()); }
    requireWriteableTarget(){ return false; }
    onPostInstall() { super.onPostInstall(); this.setupAndPromptForNextAction(); }

    static cancleMark() {
        IncidentMarkerDemo.cancle();
    }
    setupAndPromptForNextAction() {
        IModelApp.accuSnap.enableSnap(true);
    }
   
    async onDataButtonDown(ev){
      
        const curSnapDetail = IModelApp.accuSnap.getCurrSnapDetail();
        console.log("hit?", curSnapDetail.snapPoint)
        if (curSnapDetail) {
          //this.points.push(ev.rawPoint.clone());
          this.points.push(curSnapDetail.snapPoint.clone());
          IncidentMarkerDemo.toggle(curSnapDetail.snapPoint.clone())
          //this.setupAndPromptForNextAction();
        }
        return EventHandled.No;
    }
    

    async onResetButtonUp(_ev) {
        IModelApp.toolAdmin.startDefaultTool();
        return EventHandled.No;
    }

    onRestartTool() {
        const tool = new MarkTool();
        if (!tool.run())
            this.exitTool();
    }
}

MarkTool.toolId = 'iModelWeb.Mark'
export {MarkTool}