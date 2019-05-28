<template>
    <div class="registerTool">
        <markComponent ref="redMark"></markComponent>
        <graffitiComponent ref='graffiti'></graffitiComponent>
        <div v-show="showToolTip" class="tip">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item title="BaseInfo" name="1">
                    <!-- <div v-for="(value, key, index) in baseInfo">
                        {{key}}: {{value}}
                    </div> -->
                    <table>
                        <tr v-for="(value, key, index) in baseInfo">
                            <td>{{key}}</td>
                            <td>{{value}}</td>
                        </tr>
                    </table>
                </el-collapse-item>
                <el-collapse-item title="General" name="2" v-if="general">
                    <table>
                        <tr v-for="(value, key, index) in general">
                            <td>{{key}}</td>
                            <td>{{value}}</td>
                        </tr>
                    </table>
                </el-collapse-item>
                <el-collapse-item title="Geometry" name="3" v-if="geometry">
                    <table>
                        <tr v-for="(value, key, index) in geometry">
                            <td>{{key}}</td>
                            <td>{{value}}</td>
                        </tr>
                    </table>
                </el-collapse-item>
                <el-collapse-item title="RawData" name="4" v-if="rawData">
                    <table>
                        <tr v-for="(value, key, index) in rawData">
                            <td>{{key}}</td>
                            <td>{{value}}</td>
                        </tr>
                    </table>
                </el-collapse-item>
                <el-collapse-item title="Material" name="5" v-if="material">
                </el-collapse-item>
                <el-collapse-item title="Extend" name="6" v-if="extend">
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
import { IModelApp, SnapMode, AccuSnap, NotificationManager} from "@bentley/imodeljs-frontend";

import markComponent from './redMark/redMark'
import graffitiComponent from './graffiti'

export default {
    name: 'tootip',
    data () {
        return {
            showToolTip:false,
            message:'',
            extraMsg:[],
            activeName: '1',
            baseInfo: '',
            general: '',
            geometry: '',
            rawData: '',
            material: '',
            extend: ''
        };
    },
    components: {
        markComponent,
        graffitiComponent
    },
    props:['projectId', 'contextId', 'accessToken','versionName'],
    created () {
        this.iModelStartup();
    },
    methods: {
        getExtraParam(param) {
            this.general = '';
            this.geometry = '';
            this.rawData = '';
            this.material = '';
            this.extend = '';
            let that = this;
            this.$get('api/detailMsg',{},param).then(res=>{
                if(res.state === 0){
                    res.data.extraMsg.geom.forEach(function(ele){
                        if(ele.appearance){
                            that.general = ele.appearance;
                        }else {
                            for(let key in ele){
                                that.geometry = ele[key];
                                return;
                            }
                        }
                    });
                    that.geometry.pitch = res.data.extraMsg.raw.pitch;
                    that.geometry.roll = res.data.extraMsg.raw.roll;
                    that.geometry.yaw = res.data.extraMsg.raw.yaw;
                    that.rawData = {};
                    that.rawData.bBoxHigh = res.data.extraMsg.raw.bBoxHigh;
                    that.rawData.bBoxLow = res.data.extraMsg.raw.bBoxLow;
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
                    if(message.indexOf('Element.Id') === -1){
                        that.showToolTip = false;
                        return;
                    }
                    that.showToolTip = true;
                    that.baseInfo = {};
                    that.message = message;
                    that.message = that.message.replace(new RegExp(',','gm'), '<br>');
                    that.message = that.message.replace(new RegExp('<b>','gm'), '');
                    that.message = that.message.replace(new RegExp('</b>','gm'), '');
                    that.message = that.message.replace(new RegExp(' ','gm'), '');
                    let arr = that.message.split('<br>');
                    that.baseInfo.id = arr[0].substring(arr[0].indexOf(':')+1);
                    that.baseInfo.type = arr[1].substring(arr[1].indexOf(':')+1);
                    that.baseInfo.category = arr[2].substring(arr[2].indexOf(':')+1);
                    that.baseInfo.model = arr[3].substring(arr[3].indexOf(':')+1);
                    if(message.indexOf('</b>') !== -1) {
                        let id = message.split('</b>')[1].split(",")[0].trim();
                    
                        var test = {
                            changeSetId: "b981c0e09fe2bc1259d7f1c852def830ff2bdb28",    
                            key: "fc536f57-e3e5-4bf1-811d-0aebc644945e:b981c0e09fe2bc1259d7f1c852def830ff2bdb28:0",
                            openMode: 1
                        }
                        let param = {
                            id:id,
                            imodeltoken:JSON.stringify(that.GLOBAL_DATA.activeViewState.iModelConnection.iModelToken)
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
                    
                    setTimeout(()=>{
                       that.$refs.redMark.register(toolNamespace);
                       that.$refs.graffiti.register(toolNamespace);
                    })

                    
                    // MarkTool.register(toolNamespace);
                    //GraffitiTool.register(toolNamespace);
                }
                static setActiveSnapModes(snaps) {
                    IModelApp.accuSnap.setActiveSnapModes(snaps);
                }
                static setActiveSnapMode(snap) { this.setActiveSnapModes([snap]); }
            }
            SVTIModelApp.startup();
       },
       closeTip() {
            this.showToolTip = false;
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