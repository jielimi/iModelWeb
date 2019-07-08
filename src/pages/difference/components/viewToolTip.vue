<template>
    <div v-show="showToolTip" class="tip">
        <div class="close-wrap">
            <a href="javascript:;" @click="closeTip" class="close">X</a>
        </div>
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="BaseInfo" name="1">
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
    
</template>

<script>
import { IModelApp, SnapMode, AccuSnap, NotificationManager} from "@bentley/imodeljs-frontend";


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
    components: {},
    created () {
    },
    methods: {
        getExtraParam(param) {
            this.general = '';
            this.geometry = '';
            this.rawData = '';
            this.material = '';
            this.extend = '';
            let that = this;
            this.$get('api/view/detailMsg',{},param).then(res=>{
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
       displayTestAppAccuSnap() {
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
            return new DisplayTestAppAccuSnap();
       },
       notifications(){
           let that = this;
           class Notifications extends NotificationManager {
                constructor() {
                    super();
                }
                get isToolTipSupported() { return true; }
                _showToolTip(el, message, pt, options) {
                    that.showToolTip = true;
                    that.baseInfo = {};
                   
                    that.baseInfo.id = message.Id;
                    that.baseInfo.type = message.Type;
                    that.baseInfo.category = message.Category;
                    that.baseInfo.model = message.Model;
                    let imodeltoken = '';
                    
                    if(el.parentElement.parentElement.id == 'imodelEnd'){
                        imodeltoken = that.GLOBAL_DATA.diffActiveViewState[1].iModelConnection.iModelToken
                    }else if(el.parentElement.parentElement.id == 'imodelStart'){
                        imodeltoken = that.GLOBAL_DATA.diffActiveViewState[0].iModelConnection.iModelToken
                    }else{
                        return;
                    }
                   
                    if(message.Id){
                        let param = {
                            id:message.Id,
                            imodeltoken:JSON.stringify(imodeltoken)
                        };
                        that.getExtraParam(param);
                    }
                    
                }
            }
            return new Notifications();
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
    background-color: rgba(69, 77, 102, 0.8);
    padding: 10px;
    text-align: left;
    position: absolute;
    top: 160px;
    left: 15px;
    width: 12%;
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


</style>