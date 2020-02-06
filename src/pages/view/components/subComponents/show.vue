<template>
    <div>
        <i class="iconfont icon-xianshi" @click="show">
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
import { Point3d } from "@bentley/geometry-core";
export default {
    name: 'show',
    data () {
        return {
            k:0
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        show(){
            const cameraView = IModelApp.viewManager.selectedView.view;
            console.log(cameraView);
            const oldCameraPos = cameraView.getEyePoint();
            console.log(oldCameraPos);
            const viewTarget = cameraView.getTargetPoint().clone();
            console.log(viewTarget);

            let testStart =new Point3d(99414.20859624643, 80203.27502658173, 1.164153218269862e-14);
            let testEnd =new Point3d(99449.80522466963,80138.58606168664, 62.077442147221376)
            
            if(this.k == 0){
                this.k++;
                cameraView.lookAt(testStart, testEnd, cameraView.getYVector());
            }
            if(this.k != 0){
                cameraView.moveCameraWorld(testStart.vectorTo(testEnd))
            }
            
            
            IModelApp.viewManager.selectedView.synchWithView(false);
            // IModelApp.viewManager.selectedView.clearNeverDrawn();
            // IModelApp.viewManager.selectedView.iModel.selectionSet.emptyAll();
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>