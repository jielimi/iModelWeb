<template>
<div>
    <tool-bar-component></tool-bar-component>
    <canvas class="imodelview" id="imodelview">canvas</canvas>
</div>
</template>

<script>
import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"
import * as common_1 from "@bentley/imodeljs-common/lib/common"
import * as NonConnectProject_1 from "../view/dependency/NonConnectProject"
import * as SimpleViewState_1 from "../view/dependency/SimpleViewState"
//const SimpleViewState_1 = require("./SimpleViewState");

import { AccessToken, UserProfile, IModelBankAccessContext } from "@bentley/imodeljs-clients";
import { IModelConnection, IModelApp } from "@bentley/imodeljs-frontend";
import toolBarComponent from './components/toolBar';
// import { Config, DeploymentEnv } from "@bentley/imodeljs-clients/lib";

// 下面这部分是sviModeApp的部分
function stringToSnapMode(name) {
    switch (name) {
        case "Keypoint": return 2 /* NearestKeypoint */;
        case "Nearest": return 1 /* Nearest */;
        case "Center": return 8 /* Center */;
        case "Origin": return 16 /* Origin */;
        case "Intersection": return 64 /* Intersection */;
        default: return 2 /* NearestKeypoint */;
    }
}
class SVTAccuSnap extends frontend_1.AccuSnap {
    getActiveSnapModes() {
        const select = document.getElementById("snapModeList"); // 这个是工具栏第7个，杠铃下面有个钢琴那个，不知道什么意思，回头看,感觉是一个新增的工具才这么处理了
        const snapMode = stringToSnapMode(select.value);
        const snaps = [];
        snaps.push(snapMode);
        return snaps;
    }
}

class MeasurePointsTool extends frontend_1.PrimitiveTool {
    constructor() {
        super(...arguments);
        this.points = [];
    }
    requireWriteableTarget() { return false; }
    onPostInstall() { super.onPostInstall(); frontend_1.IModelApp.accuSnap.enableSnap(true); }
    onRestartTool() {
        this.exitTool();
    }
}

MeasurePointsTool.toolId = "Measure.Points";

class SVTIModelApp extends frontend_1.IModelApp {
    onStartup() {
    //    console.log("yezi test")
    // frontend_1.IModelApp.accuSnap = new SVTAccuSnap();
    const svtToolNamespace = frontend_1.IModelApp.i18n.registerNamespace("SVTTools");
    MeasurePointsTool.register(svtToolNamespace);
  }
}
let activeViewState = new SimpleViewState_1.SimpleViewState();
// 上面这部分是sviModeApp的部分

export default {
    name:'imodelviewer',
    data(){
        return{
            isLoading:false,
            configuration:{
                "useIModelBank": true
            },
            iminfo:{
                "url": "https://127.0.0.1:3005",
                "iModelId": "233e1f55-561d-42a4-8e80-d6f91743863e",
                "name": "ReadOnlyTest"
            }
        }
    },
    components:{
        toolBarComponent
    },
    created(){

    },
    mounted(){
     this.main();
    },
    methods:{
    async loginAndOpenImodel(state) {
        // This is where the app's frontend must be written to work with the
        // surrounding project, user, and deployment infrastructure.

        // *** NON-CONNECT - ask the user mgr to authenticate the user and obtain an AccessToken.
        const userProfile = new UserProfile("first", "last", "email@organization.org", "userid", "organization");
        const foreignAccessTokenWrapper = {};
        foreignAccessTokenWrapper[AccessToken.foreignProjectAccessTokenJsonProperty] = { userProfile };
        state.accessToken = AccessToken.fromForeignProjectAccessTokenJson(JSON.stringify(foreignAccessTokenWrapper));
        console.log("state=",state)

        // *** NON-CONNECT - ask the project mgr to let the user choose an iModel.
        const iModelId = "233e1f55-561d-42a4-8e80-d6f91743863e";

        // *** NON-CONNECT - ask the deployment infrastructure for the iModelBank to use for this iModel
        
        //const iminfo = await this.getIModelbankFor(iModelId);
        // let iminfo = {
        //         "url": "https://10.232.48.120:3001",
        // "iModelId": "233e1f55-561d-42a4-8e80-d6f91743863e",
        // "name": "ReadOnlyTest"
        // }
        // assert(iminfo.iModelId === iModelId);

        // Now that we know what iModelBank to use, we can set up IModelApp
        // to work with that bank.

        // Tell IModelApp to use this IModelBank client
        const imbcontext = new IModelBankAccessContext(this.iminfo.iModelId, this.iminfo.url, IModelApp.hubDeploymentEnv);
        IModelApp.iModelClient = imbcontext.client;

        // Open the iModel
        state.iModel = { wsgId: this.iminfo.iModelId, ecId: this.iminfo.iModelId };
        state.project = { wsgId: "", ecId: "", name: this.iminfo.name };
        // showStatus("opening iModel", state.project.name);
        console.log("before open")
        state.iModelConnection = await IModelConnection.open(state.accessToken, imbcontext.toIModelTokenContextId(), this.iminfo.iModelId, 1);
        console.log("after open")
    },
    async  openView(state) {
        // find the canvas.
        const parent = document.getElementById("imodelview");
        if (parent) {
            var htmlCanvas = parent.children[0];
            console.log("GET THE VIEWPORT 1")
            if (!htmlCanvas) return;
            theViewport = new frontend_1.Viewport(htmlCanvas, state.viewState);
            console.log("GET THE VIEWPORT 2")
            // await _changeView(state.viewState);
            // theViewport.addFeatureOverrides = addFeatureOverrides;
            // theViewport.continuousRendering = document.getElementById("continuousRendering").checked;
            // frontend_1.IModelApp.viewManager.addViewport(theViewport);
        }
    },
    async  _changeView(view) {
        // await theViewport.changeView(view);
        // activeViewState.viewState = view;
        // await buildModelMenu(activeViewState);
        // await buildCategoryMenu(activeViewState);
        // updateRenderModeOptionsMap();
    },
    async main (){
       // step1: start the app 
       
       SVTIModelApp.startup();

       console.log(" SVTIModelApp.startup end")
       //step2:RPC start backend service on 3001
       let rpcConfiguration;
       rpcConfiguration = common_1.BentleyCloudRpcManager.initializeClient({ info: { title: "SimpleViewApp", version: "v1.0" } },
        [common_1.IModelTileRpcInterface, common_1.StandaloneIModelRpcInterface, common_1.IModelReadRpcInterface]);
        // Config.devCorsProxyServer = "https://localhost:3001";

        //这部分貌似也可以不要
        //console.log(rpcConfiguration.interfaces())
        for (const definition of rpcConfiguration.interfaces()){
            common_1.RpcOperation.forEach(definition,
            (operation) => operation.policy.token = (_request) => new common_1.IModelToken("test", "test", "test", "test"));
        }

        //转圈先不管

        // step3:loginAndOpenImdel
        frontend_1.IModelApp.hubDeploymentEnv = this.configuration.environment || "QA";
        // 直接这里loginAndOpenImodel
        // 下面的是old写法，先保留,后续如果通过，删除
        // const projectMgr = new NonConnectProject_1.NonConnectProject();
        // await projectMgr.loginAndOpenImodel(activeViewState);
        try{
            console.log("loginAndOpenImodel start")
            await this.loginAndOpenImodel(activeViewState);
            console.log("loginAndOpenImodel over")
        } catch (reason){
            console.log(reason);
            return;
        }

        // step 4 菜单部分，这部分要重写，先不管 
        // await buildViewList(activeViewState, configuration);

        // step5 now connect the view to the canvas
        console.log("open View Before")
        await openView(activeViewState);
        console.log("open View End")



    }

    }
}
</script>

<style lang="less" scoped>
    .imodelview {
        position: relative;
        width: 98%;
        height: 90%;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        margin-left: 5px;
        margin-bottom: 5px;
        background-color: gray;
    }

</style>

