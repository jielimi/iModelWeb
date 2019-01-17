<template>
<div class="view" v-loading="isLoading">
    <tool-bar-component></tool-bar-component>
    <div class="imodelview" id="imodelview"></div>
</div>
</template>

<script>
import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"
import * as common_1 from "@bentley/imodeljs-common/lib/common"
import { AccessToken, UserProfile } from "@bentley/imodeljs-clients";
import { UrlFileHandler } from "@bentley/imodeljs-clients/lib/UrlFileHandler"; 
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/IModelBank/IModelBankAccessContext";
import { IModelConnection, IModelApp, ViewState } from "@bentley/imodeljs-frontend";
import toolBarComponent from './components/toolBar';
import Tools from './dependency/tools';

class SimpleViewState {
    constructor(){};
}
let activeViewState = new SimpleViewState();


export default {
    name:'imodelviewer',
    data(){
        return{
            isLoading:false,
            theViewPort:undefined,
            configuration:{
                "useIModelBank": true
            },
            iminfo:{
                "url": this.$route.query.url,
                "iModelId": this.$route.query.projectId,
                "versionName":this.$route.query.versionName,
                "name": "ReadOnlyTest",
            },
        }
    },
    components:{
        toolBarComponent
    },
    created(){
        window.eventHub.$on('categories_viewList_change',this.changeView);

        let that = this;
        window.eventHub.$on('fitToView',function(){
            IModelApp.tools.run("View.Fit", that.theViewPort, true);
        });
        window.eventHub.$on('windowArea',function(){
            IModelApp.tools.run("View.WindowArea", that.theViewPort);
        });
        window.eventHub.$on('Undo',function(){
            IModelApp.tools.run("View.Undo", that.theViewPort);
        });
        window.eventHub.$on('Redo',function(){
            IModelApp.tools.run("View.Redo", that.theViewPort);
        });
        window.eventHub.$on('Rotate',function(){
            IModelApp.tools.run("View.Rotate", that.theViewPort);
        });
        window.eventHub.$on('Walk',function(){
            IModelApp.tools.run("View.Walk", that.theViewPort);
        });
    
    },
    mounted(){
     this.main();
    },
    beforeDestroy(){
        if (this.theViewPort){
            IModelApp.viewManager.dropViewport(this.theViewPort);
        }

        if (activeViewState.iModelConnection !== undefined){
            activeViewState.iModelConnection.close(activeViewState.accessToken);
        }
    },
    methods:{
    // updateRenderModeOptionsMap() {
    //     let skybox = false;
    //     let groundplane = false;
    //     if (this.theViewPort.view.is3d()) {
    //         const view = this.theViewPort.view;
    //         const env = view.getDisplayStyle3d().getEnvironment();
    //         skybox = env.sky.display;
    //         groundplane = env.ground.display;
    //     }
    //     const viewflags = this.theViewPort.view.viewFlags;
    //     const lights = viewflags.showSourceLights() || viewflags.showSolarLight() || viewflags.showCameraLights();
        
    //     updateRenderModeOption("skybox", skybox, renderModeOptions.flags);
    //     updateRenderModeOption("groundplane", groundplane, renderModeOptions.flags);
    //     updateRenderModeOption("ACSTriad", viewflags.showAcsTriad(), renderModeOptions.flags);
    //     updateRenderModeOption("fill", viewflags.showFill(), renderModeOptions.flags);
    //     updateRenderModeOption("grid", viewflags.showGrid(), renderModeOptions.flags);
    //     updateRenderModeOption("textures", viewflags.showTextures(), renderModeOptions.flags);
    //     updateRenderModeOption("visibleEdges", viewflags.showVisibleEdges(), renderModeOptions.flags);
    //     updateRenderModeOption("hiddenEdges", viewflags.showHiddenEdges(), renderModeOptions.flags);
    //     updateRenderModeOption("materials", viewflags.showMaterials(), renderModeOptions.flags);
    //     updateRenderModeOption("lights", lights, renderModeOptions.flags);
    //     updateRenderModeOption("monochrome", viewflags.isMonochrome(), renderModeOptions.flags);
    //     updateRenderModeOption("constructions", viewflags.showConstructions(), renderModeOptions.flags);
    //     updateRenderModeOption("weights", viewflags.showWeights(), renderModeOptions.flags);
    //     updateRenderModeOption("styles", viewflags.showStyles(), renderModeOptions.flags);
    //     updateRenderModeOption("transparency", viewflags.showTransparency(), renderModeOptions.flags);
    //     renderModeOptions.mode = viewflags.getRenderMode();
    //     //document.getElementById("renderModeList").value = renderModeToString(viewflags.getRenderMode());
    // },
    async _changeView(view) {
        await this.theViewPort.changeView(view);
        activeViewState.viewState = view;
        // await buildModelMenu(activeViewState);
        // await buildCategoryMenu(activeViewState);
        //updateRenderModeOptionsMap();
    },
    async changeView (view) {
        if (!(view instanceof ViewState)) {
            view = await activeViewState.iModelConnection.views.load(view.id);
            //viewMap.set(viewName, view);别忘了
        }
        await this._changeView(view.clone());
    },
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
        // Now that we know what iModelBank to use, we can set up IModelApp
        // to work with that bank.

        // Tell IModelApp to use this IModelBank client
        
        const imbcontext = new IModelBankAccessContext(this.iminfo.iModelId, this.iminfo.url, IModelApp.hubDeploymentEnv, new UrlFileHandler());
        IModelApp.iModelClient = imbcontext.client;

        // Open the iModel
        state.iModel = { wsgId: this.iminfo.iModelId, ecId: this.iminfo.iModelId };
        state.project = { wsgId: "", ecId: "", name: this.iminfo.name };
        // showStatus("opening iModel", state.project.name);
        console.log("before open")
        state.iModelConnection = await IModelConnection.open(state.accessToken, 
        imbcontext.toIModelTokenContextId(), this.iminfo.iModelId, 1, this.iminfo.versionName? common_1.IModelVersion.named(this.iminfo.versionName):common_1.IModelVersion.latest());
        console.log("after open")
    },
    async buildViewList(state, configurations) {
        const config = undefined !== configurations ? configurations : {};
        const viewQueryParams = { wantPrivate: false };
        const viewSpecs = await state.iModelConnection.views.getViewList(viewQueryParams);

        window.eventHub.$emit('categories_viewList_init', viewSpecs);
        
        if (viewSpecs.length > 0){
            let viewSpec = viewSpecs[0];
            const viewState = await state.iModelConnection.views.load(viewSpec.id);
            state.viewState = viewState;
        }
    },
    async  openView(state) {
        // find the canvas.
        const parent = document.getElementById("imodelview");
        if (parent) {
            //var htmlCanvas = parent.children[0];
            console.log("GET THE VIEWPORT 1")
            //console.log(htmlCanvas)
            //if (!htmlCanvas) return;
            await this.buildViewList(state);
            console.log(state.viewState)
            if (!this.theViewPort){
                this.theViewPort = frontend_1.ScreenViewport.create(parent, state.viewState); 
            }
            //new frontend_1.ScreenViewport(parent);
            console.log("GET THE VIEWPORT 2")
            console.log(this.theViewPort)
            IModelApp.viewManager.addViewport(this.theViewPort);
        }
    },
    async main (){
       this.isLoading = true; 
       let rpcConfiguration;
       rpcConfiguration = common_1.BentleyCloudRpcManager.initializeClient({ info: { title: "SimpleViewApp", version: "v1.0" } },
        [common_1.IModelTileRpcInterface, common_1.StandaloneIModelRpcInterface, common_1.IModelReadRpcInterface]);
        // Config.devCorsProxyServer = "https://localhost:3001";

        
        //console.log(rpcConfiguration.interfaces())
        for (const definition of rpcConfiguration.interfaces()){
            common_1.RpcOperation.forEach(definition,
            (operation) => operation.policy.token = (_request) => new common_1.IModelToken("test", "test", "test", "test"));
        }

        frontend_1.IModelApp.hubDeploymentEnv = this.configuration.environment || "QA";
        
        // step3:loginAndOpenImdel
        try{
            console.log("loginAndOpenImodel start")
            await this.loginAndOpenImodel(activeViewState);
            console.log("loginAndOpenImodel over")
        } catch (reason){
            this.isLoading = false; 
            console.log(reason);
            return;
        }

        console.log("open View Before")
        await this.openView(activeViewState);
        console.log("open View End")

       this.isLoading = false; 

    }

    }
}
</script>

<style lang="less" scoped>
    .view{
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        
    }
    .imodelview {
        position: absolute;
        top:60px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        margin-left: 5px;
        margin-bottom: 5px;
        background-color: gray;
    }

</style>

