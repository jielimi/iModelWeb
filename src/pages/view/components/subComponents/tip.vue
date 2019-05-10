<template>
    <div v-show="showToolTip" class="tip">
        <div class="mainMsg">
            <div><span>Id</span>0x20000000026</div>
            <div><span>Type</span>PhysicalObject</div>
            <div><span>Category</span>Plan Border</div>
            <div><span>Model</span>mydgn</div>
        </div>
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="General" name="1">
                <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            </el-collapse-item>
            <el-collapse-item title="Geometry" name="2">
                <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
            </el-collapse-item>
            <el-collapse-item title="RawData" name="3">
                <div>简化流程：设计简洁直观的操作流程；</div>
                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
            </el-collapse-item>
            <el-collapse-item title="Material" name="4">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
            <el-collapse-item title="Extend" name="5">
                Extented:{{extraMsg}}
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>

import { IModelApp, SnapMode, AccuSnap, NotificationManager} from "@bentley/imodeljs-frontend";
import { MarkTool } from "./mark/iModelWebMarkTool";
import { GraffitiTool } from "./graffiti/graffitiTool";


export default {
    name: 'tootip',
    data () {
        return {
            showToolTip:false,
            message:'',
            extraMsg:[],
            activeName: '1'
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
            this.$get('api/detailMsg',{},param).then(res=>{
                if(res.state === 0){
                    // for(var i = 0; i< res.data.extraMsg.length;i++){
                    //     delete res.data.extraMsg[i].className
                    //     delete res.data.extraMsg[i].element
                    //     delete res.data.extraMsg[i].id
                    // }
                    // this.extraMsg = res.data.extraMsg
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

                    if(message.indexOf('</b>') !== -1) {
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
            }
            
            class SVTIModelApp extends IModelApp {
                static onStartup() {
                    IModelApp.accuSnap = new DisplayTestAppAccuSnap();
                    IModelApp.notifications = new Notifications();

                    const toolNamespace = IModelApp.i18n.registerNamespace("iModelWeb");
                    MarkTool.register(toolNamespace);
                    GraffitiTool.register(toolNamespace);
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

.subtitle{

}

</style>