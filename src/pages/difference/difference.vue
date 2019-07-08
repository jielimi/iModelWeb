<template>
  <div class="box">
    <div class="views-title">
        <span>
            Version:{{startVersionName}} compare Version:{{endVersionName}}
        </span>
        <el-button v-show="isSync"
              type="primary"
              @click="sync()">Sync
        </el-button>
        <el-button v-show="!isSync"
              type="primary"
              
              @click="unSync()">unSync
        </el-button>
        
        <el-button v-show="isColor"
              type="primary"
              @click="color()">color
        </el-button>
        <el-button v-show="!isColor"
              type="primary"
              @click="removecolor()">remove color
        </el-button>
    
    </div>
    <div class="views-area">
        <!-- <view-compare :projectId="projectId" :versionName="startVersionName" :versionUrl="startVersionUrl" :id="'imodelStart'"></view-compare>
        <view-compare :projectId="projectId" :versionName="endVersionName" :versionUrl="endVersionUrl" :id="'imodelEnd'"></view-compare> -->
        <view-start :projectId="projectId"  :versionName="startVersionName"  :versionUrl="startVersionUrl" :id="'imodelStart'"></view-start>
        <view-end :projectId="projectId"  :versionName="endVersionName"  :versionUrl="endVersionUrl" :id="'imodelEnd'"></view-end>
    </div>
    <div class="difference-area">
        <difference-result :projectId="projectId" :startVersionName="startVersionName" 
        :endVersionName="endVersionName" ref="result">
        </difference-result>
    </div>

    <!-- <div class="mark">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div> -->
  </div>
</template>

<script>
import differenceResult from './components/differenceResult'
import viewStart from './components/viewStart'
import viewEnd from './components/viewEnd'
import viewCompare from './components/viewCompare'
import RPC from '../../pages/view/rpc';
import { IModelApp, SnapMode, AccuSnap, NotificationManager,TileAdmin,TwoWayViewportSync} from "@bentley/imodeljs-frontend";
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
import { setTimeout } from 'timers';

export default {
    name:'difference',
    data(){
        return{
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
        viewCompare

    },
    created(){
       
    },
    mounted(){
        this.main()
    },
    
    methods:{
        removecolor(){
            this.isColor = !this.isColor;
            this.$refs.result.removecolor();
        },
        color(){
            this.isColor = !this.isColor
            this.$refs.result.color();
        },
        main(){
            const imbcontext= new IModelBankAccessContext(this.projectId, this.startVersionUrl, IModelApp.hubDeploymentEnv);
            let opts={}
            opts.imodelClient = imbcontext.client;
            IModelApp.startup(opts);
            
            RPC.init();
            setTimeout(function(){
                window.eventHub.$emit('difference_imodel_startup');
            })
        },
        sync(){
            this.isSync = !this.isSync;
            this.vpConnection.connect(this.GLOBAL_DATA.diffViewPort[0], this.GLOBAL_DATA.diffViewPort[1]);
            IModelApp.tools.run("View.Rotate", this.GLOBAL_DATA.diffViewPort[1])
            IModelApp.tools.run("View.Rotate", this.GLOBAL_DATA.diffViewPort[0])
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
.views-title{
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    padding: 10px 20px;
    background-color: @whiteBGColor;
    border: 1px solid @defaultBorderColor;
    margin-bottom: 10px;
    span{
        font-size: 16px;
        margin-right: 20px;
    }
    button{
        width: 100px;
        height: 30px;
    }
    .button+.button {
     margin-left: 0px;
    }
}
.box{
    display: flex;
    padding: 10px;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    background-color:@cyan;
    .difference-area {
        margin-left: 10px;
        width: calc(100% - 20px);
        height: calc(100% - 550px);
        overflow-y: auto;
        background-color:#FFFFFF; 
    } 
    .views-area{
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        .view-area{
            position: relative;
            width: calc(50% - 20px);
            height: 600px;
            background-color:#FFFFFF;
            padding: 5px;
            box-sizing: border-box;
        }
  }
    
};
.sync{
    left: 25px;
    top:20px;
    position:absolute;
}
</style>
