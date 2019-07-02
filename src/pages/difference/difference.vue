<template>
  <div class="box">
    
    <div class="views-area">
        <view-start :projectId="projectId"  :versionName="startVersionName"  :versionUrl="startVersionUrl" :id="'imodelEnd'"></view-start>
        <view-end :projectId="projectId"  :versionName="endVersionName"  :versionUrl="endVersionUrl" :id="'imodelStart'"></view-end>
    </div>
    <div class="difference-area">
        <difference-result :projectId="projectId" :startVersionName="startVersionName" 
        :endVersionName="endVersionName">
        </difference-result>
    </div>
    <div class="sync">
        <el-button v-show="isSync"
              type="primary"
              size="mini"
              @click="sync()">Sync
        </el-button>
        <el-button v-show="!isSync"
              type="primary"
              size="mini"
              @click="unSync()">unSync
        </el-button>
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
        viewEnd
    },
    created(){
       
    },
    mounted(){
        this.main()
    },
    
    methods:{
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

.box{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    background-color: #88C5FB;
    .difference-area {
        margin-left: 10px;
        width: calc(100% - 20px);
        height: calc(100% - 550px);
        overflow-y: auto;
        background-color:#FFFFFF; 
    } 
    .views-area{
        display: flex;
        padding: 10px;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        .view-area{
            position: relative;
            width: calc(50% - 10px);
            height: 500px;
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
