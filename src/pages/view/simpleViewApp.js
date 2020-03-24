import { RenderMode } from "@bentley/imodeljs-common";
import { IModelApp, TileAdmin } from "@bentley/imodeljs-frontend";
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
import { RefreshTilesTool } from './components/subComponents/registerTool/RefreshTilesTool'
import { FrontendDevTools } from "@bentley/frontend-devtools";
import { PurgeTileTreesTool } from "./components/subComponents/registerTool/PurgeTileTreesTool"
import { Notifications } from "./components/subComponents/tip/Notification"
import { DisplayTestAppAccuSnap } from "./components/subComponents/tip/DisplayTestAppAccuSnap"
import { MarkTool } from "./components/subComponents/redMark/markTool"
import { GraffitiTool } from './components/subComponents/graffiti/graffitiTool' 
// import { WMSPlugin } from '../../../static/imjs_plugins/wmsPlugin/wmsPlugin'
import { RoadRoamTool } from './components/subComponents/roadRoam/RoadRoamTool'


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

class DisplayTestApp {
    static tileAdminProps = {
        retryInterval: 50,
        enableInstancing: true,
        defaultTileSizeModifier:1
    };

    static startup(opts,projectId,url) {
        opts = opts ? opts : {};
        opts.accuSnap = new DisplayTestAppAccuSnap();
        opts.notifications = new Notifications();
        opts.tileAdmin = TileAdmin.create(DisplayTestApp.tileAdminProps);
        opts.disableMagnification = true;
        opts.useProjectExtents = true;
        const imbcontext = new IModelBankAccessContext(projectId, url, IModelApp.hubDeploymentEnv);
        opts.imodelClient = imbcontext.client;
        IModelApp.startup(opts);
        IModelApp.renderSystem.enableDiagnostics(6);// RenderDiagnostics.ALL
        const toolNamespace = IModelApp.i18n.registerNamespace("SVTTools");
        RefreshTilesTool.register(toolNamespace);
        PurgeTileTreesTool.register(toolNamespace);
        IModelApp.tools.register(MarkTool, toolNamespace);
        IModelApp.tools.register(GraffitiTool, toolNamespace);
        IModelApp.tools.register(RoadRoamTool, toolNamespace);
        return FrontendDevTools.initialize() 
       
    }

    static setActiveSnapModes(snaps) {
            IModelApp.accuSnap.setActiveSnapModes(snaps);
    }
    static setActiveSnapMode(snap) { this.setActiveSnapModes([snap]); }
}
export {
    configViewFlags,
    DisplayTestApp
}