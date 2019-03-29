<template>
<div class="view" v-loading="isLoading">
    <tool-bar-component></tool-bar-component>
    <div class="imodelview" id="imodelview"></div>
    <el-dialog
        title=""
        width="50%"
        :visible.sync="isLoading"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        center>
        <div>
            <el-progress :text-inside="true" :stroke-width="18" :percentage=progress status="success"></el-progress>
        </div>
    </el-dialog>
</div>
</template>

<script>
import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"
import * as common_1 from "@bentley/imodeljs-common/lib/common"
import { AccessToken, UserInfo, ChangeSetQuery } from "@bentley/imodeljs-clients";
import { ActivityLoggingContext } from "@bentley/bentleyjs-core";
import { UrlFileHandler } from "@bentley/imodeljs-clients/lib/UrlFileHandler"; 
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/IModelBank/IModelBankAccessContext";
import { IModelConnection, IModelApp, ViewState } from "@bentley/imodeljs-frontend";
import toolBarComponent from './components/toolBar';
import Tools from './dependency/tools';
// import RPC from './dependency/rpc';


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
            progress:2,
            iminfo:{
                "url": this.$route.query.url,
                "iModelId": this.$route.query.projectId,
                "versionName":this.$route.query.versionName,
                "versionId": this.$route.query.versionId,
                "name": "ReadOnlyTest",
            },
        }
    },
    components:{
        toolBarComponent
    },
    created(){
        window.eventHub.$on('categories_viewList_change',this.categoryChange);
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
    randomNum(minNum,maxNum){ 
        switch(arguments.length){ 
            case 1: 
                return parseInt(Math.random()*minNum+1,10); 
            break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
                default: 
                    return 0; 
                break; 
        } 
    },
    categoryChange () {
        console.log(activeViewState,this.GLOBAL_DATA.activeViewState);
    },
    async loginAndOpenImodel(state) {
       
        const userInfo = new UserInfo("userid", "email@organization.org", {"firstName": "first", "lastName": "last"}, {"id": "orgid", "name": "organization"});
        const foreignAccessTokenWrapper = {};
        foreignAccessTokenWrapper[AccessToken.foreignProjectAccessTokenJsonProperty] = { userInfo };
        state.accessToken = AccessToken.fromForeignProjectAccessTokenJson(JSON.stringify(foreignAccessTokenWrapper));
        this.progress = this.randomNum(5,20);
        console.log("state=",state)

        const iModelId = "233e1f55-561d-42a4-8e80-d6f91743863e";

        const imbcontext = new IModelBankAccessContext(this.iminfo.iModelId, this.iminfo.url, IModelApp.hubDeploymentEnv, new UrlFileHandler());
        IModelApp.iModelClient = imbcontext.client;

        // Open the iModel
        state.iModel = { wsgId: this.iminfo.iModelId, ecId: this.iminfo.iModelId };
        state.project = { wsgId: "", ecId: "", name: this.iminfo.name };
        // showStatus("opening iModel", state.project.name);
        console.log("before open")
        state.iModelConnection = await IModelConnection.open(state.accessToken, 
        imbcontext.toIModelTokenContextId(), this.iminfo.iModelId, 1, this.iminfo.versionName? common_1.IModelVersion.named(this.iminfo.versionName):common_1.IModelVersion.latest());


        const selectedChangeSets = await IModelApp.iModelClient.changeSets.get(new ActivityLoggingContext(""), state.accessToken, this.iminfo.iModelId, new ChangeSetQuery().getVersionChangeSets(this.iminfo.versionId));
        let changeSetCount = selectedChangeSets.length;
        this.progress = this.randomNum(40,50);
        console.log("after open")
    },
    async buildViewList(state, configurations) {
        const config = undefined !== configurations ? configurations : {};
        const viewQueryParams = { wantPrivate: false };
        const viewSpecs = await state.iModelConnection.views.getViewList(viewQueryParams);
        
        if (viewSpecs.length > 0){
            let viewSpec = viewSpecs[0];
            const viewState = await state.iModelConnection.views.load(viewSpec.id);
            state.viewState = viewState;
        }
        window.eventHub.$emit('viewList_init', viewSpecs);
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
                this.GLOBAL_DATA.theViewPort = this.theViewPort;
            }
            //new frontend_1.ScreenViewport(parent);
            console.log("GET THE VIEWPORT 2")
            console.log(this.theViewPort)
            IModelApp.viewManager.addViewport(this.theViewPort);
        }
    },
    async main() {
        this.isLoading = true; 
        // RPC.init();
        
        if(this.$route.query && this.$route.query.isStandalone){
            window.eventHub.$emit('open_standalone',this.$route.query.openUrl);
            this.isLoading = false;
            return;
        }

        try{
            console.log("loginAndOpenImodel start");
            this.progress = this.randomNum(0,5);
            await this.loginAndOpenImodel(activeViewState);
            this.progress = this.randomNum(80,95);
            console.log("activeViewState",activeViewState)
            console.log("loginAndOpenImodel over")
        } catch (reason){
            this.isLoading = false; 
            console.log(reason);
            return;
        }

        this.GLOBAL_DATA.activeViewState = activeViewState;
        
        console.log("open View Before")
        await this.openView(activeViewState);
        console.log("open View End");

        this.GLOBAL_DATA.activeViewState = activeViewState;

        

        this.isLoading = false; 
        this.progress = 0;
        window.eventHub.$emit('categories_init');
        window.eventHub.$emit('render_mode_init');
        window.eventHub.$emit('render_model_init');
        let that = this;
        setTimeout(function(){
            //thumbnail
            let parent = document.getElementById("imodelview");
            let htmlCanvas = parent.children[0];
            let dataURL = htmlCanvas.toDataURL();
            console.log(dataURL);
            let param = {
                projectId: that.$route.query.projectId,
                versionName: that.$route.query.versionName,
                thumbnail: dataURL
            };
            that.$post('api/thumbnail',param).then(res=>{
                if(res.state != 0) {
                    console.log(res.message);
                }
            });

        },2000)
        

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

