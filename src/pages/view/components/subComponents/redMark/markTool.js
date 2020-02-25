import {IncidentMarkerDemo} from "./incentMaker"
import {
    EventHandled,
    IModelApp,
    PrimitiveTool
} from "@bentley/imodeljs-frontend";

class MarkTool extends PrimitiveTool {
    constructor() {
        super(...arguments);
        this.points = [];
    }
    isCompatibleViewport(vp, isSelectedViewChange) { return (super.isCompatibleViewport(vp, isSelectedViewChange) && undefined !== vp && vp.view.isSpatialView()); }
    requireWriteableTarget(){ return false; }
    onPostInstall() { super.onPostInstall(); this.setupAndPromptForNextAction(); }

    setupAndPromptForNextAction() {
        IModelApp.accuSnap.enableSnap(true);
    }

    async onDataButtonDown(ev){
        const curSnapDetail = IModelApp.accuSnap.getCurrSnapDetail();
        if (curSnapDetail) {
            IncidentMarkerDemo.toggle(curSnapDetail.snapPoint.clone(),"hello")
        }
        return EventHandled.No;
    }

    onRestartTool() {
        const tool = new MarkTool();
        if (!tool.run())
            this.exitTool();
    }
    async onKeyTransition(wentDown, keyEvent) {
        if (wentDown) {
            switch (keyEvent.key.toLowerCase()) {
                case "delete":
                IncidentMarkerDemo.undo();
                break;
                case "escape":
                IncidentMarkerDemo.cancel();
                break;
            }
        }
        return EventHandled.No;
    }
}
MarkTool.toolId = "iModelWeb.Mark";

export {
    MarkTool
}