import { RenderMode } from "@bentley/imodeljs-common";
import { IModelApp } from "@bentley/imodeljs-frontend";

function configViewFlags()
{
    const vf = IModelApp.viewManager.selectedView.viewFlags.clone();
    vf.acsTriad = false;
    vf.grid = false;
    vf.constructions = false;
    vf.backgroundMap = false;
    vf.renderMode = RenderMode.SmoothShade;
    vf.weights = false;
    vf.shadows = false;
    vf.lighting = true;
    vf.visibleEdges = false;
    vf.hiddenEdges = false;
    IModelApp.viewManager.selectedView.viewFlags = vf;
    IModelApp.viewManager.selectedView.synchWithView(false);
}
export {
    configViewFlags
}