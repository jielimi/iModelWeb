<template>
    <div>
        <i class="iconfont icon-cut" @click="clip"></i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
import { ClipVector, ClipShape, Point3d } from "@bentley/geometry-core";
export default {
    name: 'clip',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        clip(){
            
            const points = [];
            points[0] = Point3d.create(620.0, 197.0, 0.0);
            points[1] = Point3d.create(682.0, 201.0, 0.0);
            points[2] = Point3d.create(682.0, 246.0, 0.0);
            points[3] = Point3d.create(620.0, 245.0, 0.0);
            const s = ClipShape.createShape(points, 100.0, 200.0);
            let clipVector ='';
            

            if (undefined !== s) {
            const clipShapes = [];
            clipShapes[0] = s;
            clipVector = ClipVector.createClipShapeClones(clipShapes);
            }
            console.log("clipVector",clipVector)
        
            // this.GLOBAL_DATA.activeViewState.viewState.setViewClip(clipVector)
          
                this.GLOBAL_DATA.theViewPort.view.setViewClip(clipVector);

                //  viewport.view.setViewClip(clip);
                this.GLOBAL_DATA.theViewPort.synchWithView(true);

            // let test = this.GLOBAL_DATA.activeViewState.viewState.getViewClip();
            // test.setInvisible(true);
            
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>