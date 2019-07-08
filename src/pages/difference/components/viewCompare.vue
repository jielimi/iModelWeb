<template>
    <div class="inherit">
        <div class="view-area" :id=id>
            <div class="tool-bar">
            </div>
        </div>
        <el-dialog
        title=""
        width="20%"
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
import { ScreenViewport } from '@bentley/imodeljs-frontend';
import { IModelVersion } from '@bentley/imodeljs-common'

import { AccessToken, UserInfo, ChangeSetQuery } from "@bentley/imodeljs-clients";
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
import { IModelConnection, IModelApp, ViewState, AuthorizedFrontendRequestContext } from "@bentley/imodeljs-frontend";
import { handleColorChange, clear } from "./color"

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
    name: 'differenceResult',
    data () {
       return{
            version:this.id == 'imodelStart' ? 0:1,
            isLoading:false,
            theViewPort:undefined,
            configuration:{
                "useIModelBank": true
            },
            progress:2,
            iminfo:{
                "url": this.versionUrl,
                "iModelId": this.projectId,
                "versionName":this.versionName,
                "name": "ReadOnlyTest",
                "contextId":'',
                "accessToken":''
            }
       }
    },
    props:['projectId','versionName','versionUrl','id'],
    components: {
        
    },
    created () {},
    beforeDestroy(){
        if (this.theViewPort){
            IModelApp.viewManager.dropViewport(this.theViewPort);
        }

        if (activeViewState.iModelConnection !== undefined){
            activeViewState.iModelConnection.close(activeViewState.accessToken);
        }
    },
    mounted(){
        window.eventHub.$on('difference_imodel_startup',this.main);
        window.eventHub.$on('diff_show_color',this.color);
        window.eventHub.$on('diff_remove_color',this.removeColor);
        window.eventHub.$on('diff_viewport_insert',this.focusElement);
        window.eventHub.$on('diff_viewport_update',this.focusElement);
        window.eventHub.$on('diff_viewport_delete',this.focusElement);
    },
    methods: {
        focusElement(id){
            this.GLOBAL_DATA.diffViewPort[this.version0].zoomToElements(id);
        },
        color(result){
            for(var i = 0;i<result.insert.length;i++ ){
                this.GLOBAL_DATA.diffActiveViewState[this.version].iModelConnection.selectionSet.elements.add(result.insert[i].id);
            } 
            handleColorChange("#3CB371",this.GLOBAL_DATA.diffViewPort[0])

            this.GLOBAL_DATA.diffActiveViewState[this.version].iModelConnection.selectionSet.elements.clear();

            for(var i = 0;i<result.update.length;i++ ){
                this.GLOBAL_DATA.diffActiveViewState[this.version].iModelConnection.selectionSet.elements.add(result.update[i].id);
            } 
            handleColorChange("#FFFF00",this.GLOBAL_DATA.diffViewPort[this.version])
        },
        removeColor(){
            clear(this.GLOBAL_DATA.diffViewPort[this.version0]);
        },
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
      async loginAndOpenImodel(state) {
            this.progress = this.randomNum(5,20);
           
            const imbcontext = new IModelBankAccessContext(this.iminfo.iModelId, this.iminfo.url, IModelApp.hubDeploymentEnv);
            
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
            const parent = document.getElementById(this.id);
            if (parent) {
                await this.buildViewList(state);
                
                if (!this.theViewPort){
                    this.theViewPort = ScreenViewport.create(parent, state.viewState);
                    this.GLOBAL_DATA.diffViewPort[this.version] = this.theViewPort;
                }
                IModelApp.viewManager.addViewport(this.theViewPort);
            }
        },
        async  openView1(state) {
            // find the canvas.
            const parent = document.getElementById(this.id);
            if (parent) {
                await this.buildViewList(state);
                
                if (!this.theViewPort){
                    this.theViewPort = ScreenViewport.create(parent, state.viewState);
                    this.GLOBAL_DATA.diffViewPort[this.version] = this.theViewPort;
                }
                IModelApp.viewManager.addViewport(this.theViewPort);
            }
        },
        async main() {
            this.isLoading = true; 
            
            try{
                this.progress = this.randomNum(0,5);
                await this.loginAndOpenImodel(activeViewState);
                this.progress = this.randomNum(80,95);
            } catch (reason){
                this.isLoading = false; 
                return;
            }
            let that = this;
           
            
            await this.openView(activeViewState);
            if(this.version == 0){
                await this.openView(activeViewState);
            }else{
                await this.openView1(activeViewState);
            }
            
            this.GLOBAL_DATA.diffActiveViewState[this.version] = activeViewState;
            this.isLoading = false; 
            this.progress = 0;
            // window.eventHub.$emit('categories_init');
            // window.eventHub.$emit('render_mode_init');
            // window.eventHub.$emit('render_model_init');
            
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.inherit{
    position: relative;
    width: calc(50% - 10px);
    height: 500px;
    .el-dialog__wrapper{
        position: absolute;
    }
}
.view-area{
    width: 100%;
    height: 500px;
    background-color:#FFFFFF;
    padding: 5px;
    box-sizing: border-box;
}
.tool-bar{
    height: 35px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
}
</style>