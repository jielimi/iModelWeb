<template>
<div>
    <div class="tool-bar">toolbar</div>
    <canvas class="imodelview" id="imodelview">canvas</canvas>
</div>
</template>

<script>
import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"
import * as common_1 from "@bentley/imodeljs-common/lib/common"
// 下面这部分是sviModeApp的部分
function stringToSnapMode(name) {
    switch (name) {
        case "Keypoint": return 2 /* NearestKeypoint */;
        case "Nearest": return 1 /* Nearest */;
        case "Center": return 8 /* Center */;
        case "Origin": return 16 /* Origin */;
        case "Intersection": return 64 /* Intersection */;
        default: return 2 /* NearestKeypoint */;
    }
}
class SVTAccuSnap extends frontend_1.AccuSnap {
    getActiveSnapModes() {
        const select = document.getElementById("snapModeList"); // 这个是工具栏第7个，杠铃下面有个钢琴那个，不知道什么意思，回头看,感觉是一个新增的工具才这么处理了
        const snapMode = stringToSnapMode(select.value);
        const snaps = [];
        snaps.push(snapMode);
        return snaps;
    }
}

class MeasurePointsTool extends frontend_1.PrimitiveTool {
    constructor() {
        super(...arguments);
        this.points = [];
    }
    requireWriteableTarget() { return false; }
    onPostInstall() { super.onPostInstall(); frontend_1.IModelApp.accuSnap.enableSnap(true); }
    onRestartTool() {
        this.exitTool();
    }
}

MeasurePointsTool.toolId = "Measure.Points";

class SVTIModelApp extends frontend_1.IModelApp {
   static onStartup() {
    //    console.log("yezi test")
    //frontend_1.IModelApp.accuSnap = new SVTAccuSnap();
    const svtToolNamespace = frontend_1.IModelApp.i18n.registerNamespace("SVTTools");
    MeasurePointsTool.register(svtToolNamespace);
  }
}
// 上面这部分是sviModeApp的部分

export default {
    name:'imodelviewer',
    data(){
        return{
            isLoading:false,
            configuration:{
                "useIModelBank": true
            }
        }
    },
    created(){

    },
    mounted(){
     this.main();
    },
    methods:{
    
    async main (){
       // step1: start the app 
       SVTIModelApp.startup();

       //step2:RPC 
       let rpcConfiguration;
       rpcConfiguration = common_1.BentleyCloudRpcManager.initializeClient({ info: { title: "SimpleViewApp", version: "v1.0" } },
        [common_1.IModelTileRpcInterface, common_1.StandaloneIModelRpcInterface, common_1.IModelReadRpcInterface]);

       //这部分貌似也可以不要
       console.log(rpcConfiguration.interfaces())
        for (const definition of rpcConfiguration.interfaces()){
            common_1.RpcOperation.forEach(definition,
            (operation) => operation.policy.token = (_request) => new common_1.IModelToken("test", "test", "test", "test"));
        }
    }

    }
}
</script>

<style lang="less" scoped>

</style>

