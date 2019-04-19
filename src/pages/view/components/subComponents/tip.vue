<template>
    <div v-show="showToolTip" class="tip">
    <div v-html='message'>
        {{message}}
    </div>
    <div class="externalMsg">
        extra Msg:{{extraMsg}}
    </div>
    </div>
</template>

<script>

import { IModelApp, SnapMode, AccuSnap, NotificationManager} from "@bentley/imodeljs-frontend";
import { MarkTool } from "./mark/iModelWebMarkTool";


export default {
    name: 'tootip',
    data () {
        return {
            showToolTip:false,
            message:'',
            extraMsg:''
        };
    },
    components: {
        
    },
    props:['projectId', 'contextId', 'accessToken','versionName'],
    created () {
        this.iModelStartup();
    },
    methods: {
       getExtraParam(param) {
            this.$get('api/extraMsg',{},param).then(res=>{
                if(res.state === 0){
                    this.extraMsg = res.data.extraMsg.property
                }
            })
       },
       iModelStartup() {
           let that = this;
           class DisplayTestAppAccuSnap extends AccuSnap {
                constructor() {
                    super(...arguments);
                    this._activeSnaps =  [SnapMode.NearestKeypoint];
                }
                keypointDivisor() { return 2; }
                getActiveSnapModes() { 
                    return this._activeSnaps; 
                }
                setActiveSnapModes(snaps) {
                    this._activeSnaps.length = snaps.length;
                    for (let i = 0; i < snaps.length; i++)
                    this._activeSnaps[i] = snaps[i];
                }
            }

            class Notifications extends NotificationManager {
                constructor() {
                    super();
                }
                get isToolTipSupported() { return true; }
                _showToolTip(el, message, pt, options) {
                    that.showToolTip = true;
                    that.message = message;
                    let id = message.split('</b>')[1].split(",")[0].trim();
                  
                    let param = {
                        id:id,
                        projectId:that.projectId,
                        contextId:that.contextId,
                        accessToken:that.accessToken,
                        versionName:that.versionName
                    };

                    that.getExtraParam(param);
                }
            }
            
            class SVTIModelApp extends IModelApp {
                static onStartup() {
                    IModelApp.accuSnap = new DisplayTestAppAccuSnap();
                    //IModelApp.notifications = new Notifications();

                    const toolNamespace = IModelApp.i18n.registerNamespace("iModelWeb");
                    MarkTool.register(toolNamespace);
                    console.log("onstartup")
                }

                static setActiveSnapModes(snaps) {
                    IModelApp.accuSnap.setActiveSnapModes(snaps);
                }

                static setActiveSnapMode(snap) { this.setActiveSnapModes([snap]); }
            }

            SVTIModelApp.startup();
            
       }
        
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.tip{
    padding: 10px;
    text-align: left;
    position: absolute;
    top: 65px;
    left: 15px;
    width: 150px;
    color: white;
    opacity: 0.6;
    z-index: 1000;
    border: 2px solid;
    border-radius: 5px;
}

</style>