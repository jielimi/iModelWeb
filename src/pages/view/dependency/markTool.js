import {
    IModelApp, PrimitiveTool,
    BeButtonEvent, EventHandled,
  } from "@bentley/imodeljs-frontend";



export class MarkTool extends PrimitiveTool{
    toolId = 'markTools'
    points = [];

    requireWriteableTarget(){ return false; }
    onPostInstall() { super.onPostInstall(); this.setupAndPromptForNextAction(); }

    setupAndPromptForNextAction() {
        IModelApp.accuSnap.enableSnap(true);
        //IModelApp.notifications.outputPromptByKey("SampleApp:tools.Tool1.Prompts.GetPoint");
    }

    async onDataButtonDown(ev){
        this.points.push(ev.point.clone());
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