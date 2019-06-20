<template>
     <div class="view-area" :id=id></div>
</template>

<script>
import RPC from '../../../pages/view/rpc';

import { ScreenViewport } from '@bentley/imodeljs-frontend';
import { IModelVersion } from '@bentley/imodeljs-common'

import { AccessToken, UserInfo, ChangeSetQuery } from "@bentley/imodeljs-clients";
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
import { IModelConnection, IModelApp, ViewState, AuthorizedFrontendRequestContext } from "@bentley/imodeljs-frontend";

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
        //const imbcontext= new IModelBankAccessContext(this.projectId, this.versionUrl, IModelApp.hubDeploymentEnv);
        // const imbcontext= new IModelBankAccessContext(this.projectId, "http://127.0.0.1:4002", IModelApp.hubDeploymentEnv);

        // let opts={}
        // opts.imodelClient = imbcontext.client;
        // IModelApp.startup(opts);
        this.main();
    },
    methods: {
      async loginAndOpenImodel(state) {
            // this.progress = this.randomNum(5,20);
        
           
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
          
            // this.progress = this.randomNum(40,50);
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
                    // this.theViewPort = frontend_1.ScreenViewport.create(parent, state.viewState); 
                    this.theViewPort = ScreenViewport.create(parent, state.viewState);
                    this.GLOBAL_DATA.theViewPort = this.theViewPort;
                }
                IModelApp.viewManager.addViewport(this.theViewPort);
            }
        },
        async main() {
            this.isLoading = true; 
            //RPC.init();
            
            try{
                //this.progress = this.randomNum(0,5);
                await this.loginAndOpenImodel(activeViewState);
                //this.progress = this.randomNum(80,95);
            } catch (reason){
                this.isLoading = false; 
                return;
            }
            this.GLOBAL_DATA.activeViewState = activeViewState;
            await this.openView(activeViewState);
            this.GLOBAL_DATA.activeViewState = activeViewState;
            this.isLoading = false; 
            this.progress = 0;
            window.eventHub.$emit('categories_init');
            window.eventHub.$emit('render_mode_init');
            window.eventHub.$emit('render_model_init');
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.view-area{
    position: relative;
}

</style>