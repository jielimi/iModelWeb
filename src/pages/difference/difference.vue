<template>
  <div class="box">
    <div class="views-title-content">
         <div style="text-align: center;">
            <span class="title">
            Version:{{startVersionName}} compare Version:{{endVersionName}}
            </span>
        </div>

        <el-button v-if="isSync"
              type="primary"
              @click="sync()">Sync
        </el-button>
        <el-button v-if="!isSync"
              type="primary"
              @click="unSync()">unSync
        </el-button>
        
        <el-button v-show="isColor"
              type="primary"
              @click="color()">Color
        </el-button>
        <el-button v-show="!isColor"
              type="primary"
              @click="removecolor()">Remove Color
        </el-button>
        <div class="mark">
            <div class="square"></div>Add
            <div class="square"></div>Delete
            <div class="square"></div>Modify
        </div>
    
    </div>
    <div class="views-area">
        <viewToolTip ref='tip'></viewToolTip>
        <view-start :projectId="projectId"  :versionName="startVersionName"  :versionUrl="startVersionUrl" :id="'imodelStart'"></view-start>
        <view-end :projectId="projectId"  :versionName="endVersionName"  :versionUrl="endVersionUrl" :id="'imodelEnd'"></view-end>
    </div>
 
  <div class="search">
      <el-button icon="el-icon-search" circle @click="showDiff = true"></el-button>
  </div>

  <el-collapse-transition>
    <div v-show="showDiff" class="difference-area">
        <div class="close">
            <el-button icon="el-icon-close" circle @click="showDiff = false"></el-button>
        </div>
       <difference-result :projectId="projectId" :startVersionName="startVersionName" 
        :endVersionName="endVersionName" ref="result">
        </difference-result>
    </div>
  </el-collapse-transition>

  </div>
</template>

<script>
import differenceResult from './components/differenceResult'
import viewStart from './components/viewStart'
import viewEnd from './components/viewEnd'
import viewCompare from './components/viewCompare'
import viewToolTip from './components/viewToolTip'
import RPC from '../../pages/view/rpc';
import { IModelApp, SnapMode, AccuSnap, NotificationManager,TileAdmin,TwoWayViewportSync} from "@bentley/imodeljs-frontend";
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
import { setTimeout } from 'timers';

export default {
    name:'difference',
    data(){
        return{
            showDiff:false,
            vpConnection:new TwoWayViewportSync(),
            isSync:true,
            isColor:true,
            startVersionName: this.$route.query.startVersionName,
            startVersionUrl:this.$route.query.startVersionUrl,
            endVersionName: this.$route.query.endVersionName,
            endVersionUrl: this.$route.query.endVersionUrl,
            projectId: this.$route.query.projectId
        }
    },
    components:{
        differenceResult,
        viewStart,
        viewEnd,
        viewToolTip
    },
    created(){
       
    },
    mounted(){
        this.main()
    },
    
    methods:{
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
                        opts.notifications = that.$refs.tip.notifications();
                        
                        const imbcontext= new IModelBankAccessContext(that.projectId, that.startVersionUrl, IModelApp.hubDeploymentEnv);
                        opts.imodelClient = imbcontext.client;
                        IModelApp.startup(opts);
                    })
                }

                static setActiveSnapModes(snaps) {
                        IModelApp.accuSnap.setActiveSnapModes(snaps);
                }
                static setActiveSnapMode(snap) { this.setActiveSnapModes([snap]); }
            }
            DisplayTestApp.startup();
        },
        removecolor(){
            this.isColor = !this.isColor;
            this.$refs.result.removecolor();
        },
        color(){
            this.isColor = !this.isColor
            this.$refs.result.color();
        },
        main(){
            // const imbcontext= new IModelBankAccessContext(this.projectId, this.startVersionUrl, IModelApp.hubDeploymentEnv);
            // let opts={}
            // opts.imodelClient = imbcontext.client;
            // IModelApp.startup(opts);
            this.iModelStartup();
            
            RPC.init();
            setTimeout(function(){
                window.eventHub.$emit('difference_imodel_startup');
            })
        },
        sync(){
            this.isSync = !this.isSync;
            this.vpConnection.connect(GLOBAL_DATA.diffViewPort[0], GLOBAL_DATA.diffViewPort[1]);
            IModelApp.tools.run("View.Rotate", GLOBAL_DATA.diffViewPort[1])
            IModelApp.tools.run("View.Rotate", GLOBAL_DATA.diffViewPort[0])
        },
        unSync(){
             this.isSync = !this.isSync;
             this.vpConnection.disconnect();
        }
    }
}
</script>


<style lang="less" scoped>
@import "../../assets/css/color.less";
.search{
    position: absolute;
    left: 20px;
    bottom: 20px;
}
.close{
    position: absolute;
    right: calc(50% - 16px);
    top: 5px;
    z-index: 10;
}
.square{
    width: 20px;
    height: 20px;
}
.mark{
    vertical-align: bottom;
    display: inline-block;
    div{
        display: inline-block;
        margin-right:5px; 
    }
    div:nth-child(1){
        background-color: @green;
    }
    div:nth-child(2){
        background-color: @red;
    }
    div:nth-child(3){
        background-color: @yellow;
    }
}
.views-title-content{
    width: 100%;
    height: 80px;
    text-align: left;
    box-sizing: border-box;
    padding: 10px 20px;
    background-color: @whiteBGColor;
    border: 1px solid @defaultBorderColor;
    margin-bottom: 10px;
    .title{
        font-size: 16px;
        margin-left: 60px;
        font-weight: 600;
        vertical-align: middle;
    }
    button{
        width: 100px;
        height: 30px;
    }
    
}
.box{
    box-sizing: border-box;
    padding: 10px;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    background-color:@cyan;
    .difference-area {
        position: absolute;
        width: 1000px;
        bottom: 14px;
        right: calc(50% - 500px);
        background-color:#FFFFFF; 
        overflow-y: auto;
    } 
    .views-area{
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
  }
    
};
.sync{
    left: 25px;
    top:20px;
    position:absolute;
}
</style>
