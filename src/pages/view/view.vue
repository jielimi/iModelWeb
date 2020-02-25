<template>
  <div class="view" v-loading="isLoading">
    <tool-bar-component
      :projectId="iminfo.iModelId"
      :versionId="iminfo.versionId"
      :url="iminfo.url"
      :versionName="iminfo.versionName"
      :contextId="iminfo.contextId"
      :accessToken="iminfo.accessToken"
      :openMode="iminfo.openMode"
    ></tool-bar-component>
    <div class="imodelview" id="imodelview"></div>
    <el-dialog
      title
      width="50%"
      :visible.sync="isLoading"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <div>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" status="success"></el-progress>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ScreenViewport} from '@bentley/imodeljs-frontend';
import { IModelVersion } from '@bentley/imodeljs-common'
import { AccessToken, UserInfo, ChangeSetQuery, IncludePrefix } from "@bentley/imodeljs-clients";
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
import { IModelConnection, IModelApp, ViewState, AuthorizedFrontendRequestContext } from "@bentley/imodeljs-frontend";
import toolBarComponent from './components/toolBar';
import RPC from './rpc';
import { configViewFlags,DisplayTestApp } from './simpleViewApp'



class IModelBankAuthorizationClient {
    constructor(accessToken) {
    this._accessToken = accessToken;
    this.hasSignedIn = true;  // this is cheating
    this.isAuthorized = true; // this is cheating
    this.hasExpired = false;  // this is cheating
  }

  static createFromUserInfo(userJsonObj) {
    const userInfo = UserInfo.fromJson(userJsonObj);
    const foreignAccessTokenWrapper = {};
    foreignAccessTokenWrapper[AccessToken.foreignProjectAccessTokenJsonProperty] = { userInfo };
    const accessToken = AccessToken.fromForeignProjectAccessTokenJson(JSON.stringify(foreignAccessTokenWrapper));
    return new IModelBankAuthorizationClient(accessToken);
  }

  static createFromCredentials(userCredentials) {
    const tokenStr = Buffer.from(userCredentials.email + ':' + userCredentials.password).toString("base64");
    const accessToken = AccessToken.fromBasicTokenString(tokenStr, IncludePrefix.No);
    return new IModelBankAuthorizationClient(accessToken);
  }

  async getAccessToken(_requestContext) {
    return this._accessToken;
  }
}
class SimpleViewState {
    constructor(){};
}
let activeViewState = new SimpleViewState();
let theViewPort = undefined;
export default {
    name:'imodelviewer',
    data(){
        return{
            isLoading:false,
            progress:2,
            iminfo:{
                "url": this.$route.query.url,
                "iModelId": this.$route.query.projectId,
                "versionName":this.$route.query.versionName,
                "versionId": this.$route.query.versionId,
                "openMode":this.$route.query.openMode,
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
          this.main()
    },
    mounted(){
     
    },
    beforeDestroy(){
        if (theViewPort){
            IModelApp.viewManager.dropViewport(theViewPort);
            theViewPort = undefined;
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
        
        async loginAndOpenImodel(state) {
            this.progress = this.randomNum(5,20);

            const imbcontext = new IModelBankAccessContext(this.iminfo.iModelId, this.iminfo.url, IModelApp.hubDeploymentEnv);
                     
            IModelApp.authorizationClient = IModelBankAuthorizationClient.createFromCredentials({
                email: "test",
                password: "test",
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
                window.eventHub.$emit('viewList_init', viewSpecs);
            }
            // window.eventHub.$emit('viewList_init', viewSpecs);
        },
        async  openView(state) {
            // find the canvas.
            const parent = document.getElementById("imodelview");
            if (parent) {
                await this.buildViewList(state);
                
                if (!theViewPort){
                    theViewPort = ScreenViewport.create(parent, state.viewState);
                }
                IModelApp.viewManager.addViewport(theViewPort);
            }
        },
        async main() {
            this.isLoading = true; 
            RPC.init();
            DisplayTestApp.startup({},this.iminfo.projectId, this.iminfo.url);

            if(this.$route.query && this.$route.query.isStandalone){
                window.eventHub.$emit('tile_progress_init');
                window.eventHub.$emit('keyin_init');
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
           
            await this.openView(activeViewState);
            configViewFlags();
            
            this.isLoading = false; 
            this.progress = 0;
            window.eventHub.$emit('categories_init');
            window.eventHub.$emit('render_mode_init');
            window.eventHub.$emit('render_model_init');
            window.eventHub.$emit('tile_progress_init');
            window.eventHub.$emit('keyin_init');
        }
    }
}
</script>

<style lang="less" scoped>
.view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.imodelview {
  position: absolute;
  top: 82px;
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

