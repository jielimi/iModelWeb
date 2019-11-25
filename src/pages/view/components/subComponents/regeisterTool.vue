<template>
    <div class="registerTool">
        <markComponent ref="redMark"></markComponent>
        <graffitiComponent ref='graffiti'></graffitiComponent>
        <addComponent ref='add'></addComponent>
        <tipComponent ref='tip' :projectId="projectId" :contextId="contextId" :accessToken="accessToken" :versionName="versionName"></tipComponent>
    </div>
</template>

<script>
import { IModelApp, SnapMode, AccuSnap, NotificationManager,TileAdmin,Tool} from "@bentley/imodeljs-frontend";
import markComponent from './redMark/redMark'
import graffitiComponent from './graffiti'
import addComponent from './addElement/addElement'
import tipComponent from './tip'
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
import {RefreshTilesTool} from './registerTool/RefreshTilesTool'
import { FrontendDevTools } from "@bentley/frontend-devtools";

export default {
    name: 'registerTool',
    data () {
        return {
        };
    },
    components: {
        markComponent,
        graffitiComponent,
        addComponent,
        tipComponent
    },
    props:['projectId','url', 'contextId', 'accessToken','versionName'],
    created () {
        this.iModelStartup();
    },
    methods: {
        iModelStartup(){
            let that = this;
            class DisplayTestApp {
                static tileAdminProps = {
                    retryInterval: 50,
                    enableInstancing: true,
                };

                static startup(opts) {
                    opts = opts ? opts : {};
                    
                    setTimeout(()=>{
                        opts.accuSnap = that.$refs.tip.displayTestAppAccuSnap();
                        opts.notifications = that.$refs.tip.notifications();
                        opts.tileAdmin = TileAdmin.create(DisplayTestApp.tileAdminProps);
                        
                        const imbcontext= new IModelBankAccessContext(that.projectId, that.url, IModelApp.hubDeploymentEnv);
                        opts.imodelClient = imbcontext.client;
                        IModelApp.startup(opts);
                        const toolNamespace = IModelApp.i18n.registerNamespace("SVTTools");
                        that.$refs.redMark.register(toolNamespace);
                        that.$refs.graffiti.register(toolNamespace);
                        that.$refs.add.register(toolNamespace);
                        RefreshTilesTool.register(toolNamespace);
                        window.eventHub.$emit('iModel_startup_finish');
                        return FrontendDevTools.initialize()
                    })
                }

                static setActiveSnapModes(snaps) {
                        IModelApp.accuSnap.setActiveSnapModes(snaps);
                }
                static setActiveSnapMode(snap) { this.setActiveSnapModes([snap]); }
            }
            DisplayTestApp.startup();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.el-collapse-item__header {
    background-color: transparent;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 40px;
    line-height: 48px;
    color: #fff;
    cursor: pointer;
    border-bottom: none;
    font-size: 13px;
    font-weight: 500;
    -webkit-transition: border-bottom-color .3s;
    transition: border-bottom-color .3s;
    outline: 0;
    padding-left: 5px;
}
.tip{
    background-color: rgba(69,77,102,0.8);
    padding: 10px;
    text-align: left;
    position: absolute;
    top: 65px;
    left: 15px;
    width: 15%;
    color: white;
    opacity: 0.6;
    z-index: 1000;
    border: 2px solid;
    border-radius: 5px;
}
.mainMsg{
    margin-bottom: 5px;
    span{
            padding-bottom: 5px;
            width: 100px;
            display: inline-block;
    }
}
.close-wrap {
    text-align: right;
}
.close {
    text-decoration: none;
    color: #fff;
}
.registerTool{
    display: flex;
}

</style>