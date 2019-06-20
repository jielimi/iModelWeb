<template>
<div class="view" v-loading="isLoading">
    <tool-bar-component :projectId="iminfo.iModelId" :url="iminfo.url" :versionName="iminfo.versionName" :contextId="iminfo.contextId" :accessToken="iminfo.accessToken">
    </tool-bar-component>
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
//import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"
import { ScreenViewport } from '@bentley/imodeljs-frontend';
import { IModelVersion } from '@bentley/imodeljs-common'
//import * as common_1 from "@bentley/imodeljs-common/lib/common"
import { AccessToken, UserInfo, ChangeSetQuery } from "@bentley/imodeljs-clients";
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
import { IModelConnection, IModelApp, ViewState, AuthorizedFrontendRequestContext } from "@bentley/imodeljs-frontend";
import toolBarComponent from './components/toolBar';
import RPC from './rpc';
class IModelBankAuthorizationClient {
    constructor(jsonObj) {
        this._userInfo = UserInfo.fromJson(jsonObj);
        this.hasSignedIn = true;//this is cheating
    }
    async getAccessToken(_requestContext) {
        const userInfo = this._userInfo;
        const foreignAccessTokenWrapper = {};
        foreignAccessTokenWrapper[AccessToken.foreignProjectAccessTokenJsonProperty] = { userInfo };
        const accessToken = AccessToken.fromForeignProjectAccessTokenJson(JSON.stringify(foreignAccessTokenWrapper));
        return accessToken;
    }
}
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
                "contextId":'',
                "accessToken":''
            },
        }
    },
    components:{
        toolBarComponent
    },
    created(){
        //window.eventHub.$on('categories_viewList_change',this.categoryChange);
    },
    mounted(){
     window.eventHub.$on('iModel_startup_finish',this.main)
     //this.main();
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
        // categoryChange () {
        // },
        async loginAndOpenImodel(state) {
            this.progress = this.randomNum(5,20);
            const imbcontext = new IModelBankAccessContext(this.iminfo.iModelId, this.iminfo.url, IModelApp.hubDeploymentEnv);
            
            
            //IModelApp.iModelClient = imbcontext.client; register tool
            
            IModelApp.authorizationClient = new IModelBankAuthorizationClient({
                "sub": "userid",
                "email": "email@organization.org",
                "given_name": "first",
                "family_name": "last",
                "org": "orgid",
                "org_name": "organization"
            });
            
            // Open the iModel
            state.iModel = { wsgId: this.iminfo.iModelId, ecId: this.iminfo.iModelId };
            state.project = { wsgId: "", ecId: "", name: this.iminfo.name };
            this.iminfo.contextId = imbcontext.toIModelTokenContextId();
            state.iModelConnection = await IModelConnection.open(this.iminfo.contextId, this.iminfo.iModelId, 
            1, this.iminfo.versionName? IModelVersion.named(this.iminfo.versionName):IModelVersion.latest());
            // const requestContext = await AuthorizedFrontendRequestContext.create();
            
            // const selectedChangeSets = await IModelApp.iModelClient.changeSets.get(requestContext, this.iminfo.iModelId, new ChangeSetQuery().getVersionChangeSets(this.iminfo.versionId));
            // let changeSetCount = selectedChangeSets.length;
            console.log('state',state)
            this.progress = this.randomNum(40,50);
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
                await this.buildViewList(state);
                
                if (!this.theViewPort){
                    // this.theViewPort = frontend_1.ScreenViewport.create(parent, state.viewState); 
                    this.theViewPort = ScreenViewport.create(parent, state.viewState);
                    this.GLOBAL_DATA.theViewPort = this.theViewPort;
                }
                IModelApp.viewManager.addViewport(this.theViewPort);
            }
        },
        async main() {
            this.isLoading = true; 
            RPC.init();
            if(this.$route.query && this.$route.query.isStandalone){
                window.eventHub.$emit('open_standalone',this.$route.query.openUrl);
                this.isLoading = false;
                return;
            }
            try{
                this.progress = this.randomNum(0,5);
                await this.loginAndOpenImodel(activeViewState);
                this.progress = this.randomNum(80,95);
            } catch (reason){
                this.isLoading = false; 
                return;
            }
           // this.GLOBAL_DATA.activeViewState = activeViewState;
            await this.openView(activeViewState);
            this.GLOBAL_DATA.activeViewState = activeViewState;
            this.isLoading = false; 
            this.progress = 0;
            window.eventHub.$emit('categories_init');
            window.eventHub.$emit('render_mode_init');
            window.eventHub.$emit('render_model_init');
            window.eventHub.$emit('tile_progress_init');
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

