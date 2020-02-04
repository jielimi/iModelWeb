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

    static cancelMark() {
        IncidentMarkerDemo.cancel();
    }
    setupAndPromptForNextAction() {
        // IModelApp.accuSnap.enableSnap(true);
        IModelApp.accuDraw.deactivate();
    }

    onDynamicFrame(ev, context) {
        if (this.points.length < 1)
          return;
    
        const tmpPoints = this.points.slice();
        tmpPoints.push(ev.point.clone());
    
        const builder = context.createSceneGraphicBuilder();
    
        builder.setSymbology(ColorDef.white, ColorDef.white, 1);
        builder.addLineString(tmpPoints);
    
        context.addGraphic(builder.finish());
        this.updateDynamicDistanceMarker(tmpPoints);
      }
    decorate(context) {
      if (!context.viewport.view.isSpatialView())
        return;
      if (undefined !== this._distanceMarker)
        this._distanceMarker.addDecoration(context);
    }
    decorateSuspended(context) { this.decorate(context); }
    async onDataButtonDown(ev){
        this.points.push(ev.rawPoint.clone());
        IncidentMarkerDemo.toggle(ev.rawPoint.clone())
        this.setupAndPromptForNextAction();
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