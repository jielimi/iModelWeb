<template>
  <div class="box">
    <div class="difference-area">
        <difference-result :projectId="projectId" :startVersionName="startVersionName" 
        :endVersionName="endVersionName">
        </difference-result>
    </div>
    <div class="views-area">
        <view-start :projectId="projectId"  :versionName="startVersionName"  :versionUrl="startVersionUrl" :id="'imodelEnd'"></view-start>
        <view-end :projectId="projectId"  :versionName="endVersionName"  :versionUrl="endVersionUrl" :id="'imodelStart'"></view-end>
    </div>
    <div class="test">
        <el-button
              type="primary"
              size="mini"
              @click="CanvasEvent()">test
            </el-button>
    </div>
  </div>
</template>

<script>
import differenceResult from './components/differenceResult'
import viewStart from './components/viewStart'
import viewEnd from './components/viewEnd'
import RPC from '../../pages/view/rpc';
import { IModelApp, SnapMode, AccuSnap, NotificationManager,TileAdmin} from "@bentley/imodeljs-frontend";
import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
import { setTimeout } from 'timers';

export default {
    name:'difference',
    data(){
        return{
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
        CanvasEvent(){
           let that = this;
            var viewStartCanvas = document.getElementById("imodelStart").getElementsByTagName("canvas")
            var viewEndCanvas = document.getElementById("imodelEnd").getElementsByTagName("canvas")
            viewEndCanvas[0].addEventListener("mousewheel",function(e){
               
               //console.log(that.GLOBAL_DATA.diffActiveViewState[0].viewState.camera)
               const eyePoint = that.GLOBAL_DATA.diffActiveViewState[0].viewState.camera.getEyePoint();
               const lens = that.GLOBAL_DATA.diffActiveViewState[0].viewState.camera.getLensAngle();
               const focusDist = that.GLOBAL_DATA.diffActiveViewState[0].viewState.camera.getFocusDistance()
               const origin = that.GLOBAL_DATA.diffActiveViewState[0].viewState.getOrigin();
               const extents = that.GLOBAL_DATA.diffActiveViewState[0].viewState.getExtents();
                // viewEndCanvas.dispatchEvent(e);
                that.GLOBAL_DATA.diffActiveViewState[1].viewState.camera.setEyePoint(eyePoint);
                that.GLOBAL_DATA.diffActiveViewState[1].viewState.camera.setLensAngle(lens);
                that.GLOBAL_DATA.diffActiveViewState[1].viewState.camera.setFocusDistance(focusDist);
                that.GLOBAL_DATA.diffActiveViewState[1].viewState.setOrigin(origin);
                that.GLOBAL_DATA.diffActiveViewState[1].viewState.setExtents(extents);
                that.GLOBAL_DATA.diffViewPort[1].synchWithView(true)

            },false);
          
        }
       
    }
}
</script>


<style lang="less" scoped>
.box{
    display: flex;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    background-color: #88C5FB;
    .difference-area{
        width: 200px;
        background-color:#FFFFFF; 
        align-self: stretch;
    }
    .views-area{
        display: flex;
        padding: 0px 10px;
        width: calc(100% - 80px);
        flex-direction: column;
        align-items: stretch;
        align-content: stretch;
        div:first-child{
            height: calc(50% - 10px);
            background-color:#FFFFFF;
            margin: 10px 0;
        }
        div:nth-child(2){
           height: calc(50% - 10px);
           background-color:#FFFFFF;
           margin-bottom: 10px;
        }
    }
};
.test{
    position:absolute;
}
</style>
