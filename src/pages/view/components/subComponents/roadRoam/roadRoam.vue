<template>
    <div>
        <i class="iconfont icon-icon-feixingmanyou roadRoam"  @click.self="pop">
            <div v-show="showPop" class="detail">
                <el-button @click="setPath">setPath</el-button>
                <el-button @click="clearPath">clearPath</el-button>
                <el-button @click="roadRoam">roadRoam</el-button>
            </div>
        </i>
    </div>
    
</template>

<script>

import { Arc3d,Transform,Matrix3d} from "@bentley/geometry-core";

import {IModelJson as GeomJson,LineString3d,Point3d,Vector3d,Angle} from "@bentley/geometry-core";
import {AccuDrawHintBuilder,AccuDrawShortcuts,BeButtonEvent,DecorateContext,DynamicsContext,
    EventHandled, GraphicType,HitDetail,IModelApp,PrimitiveTool,SnapStatus } from "@bentley/imodeljs-frontend";
import {ColorDef, GeometryStreamProps,LinePixels} from "@bentley/imodeljs-common";
import { BeTimePoint, BeDuration } from "@bentley/bentleyjs-core";
import { RoadRoamTool,points } from "./RoadRoamTool"

export default {
    name: 'roadRoam',
    data () {
        return {
            points:[],
            showPop:false
        };
    },
    components: {
        
    },
    created () {
        
    },
    methods: {
        pop(){
            this.showPop = !this.showPop;
            // if(!this.showPop){
            //     IModelApp.tools.startDefaultTool()
            // }
        },
        setPath(){
            IModelApp.tools.run("iModelWeb.roadRoam");
        },
        clearPath(){
            RoadRoamTool.clearPath()
        },
        // async roadRoam(){
        //     function pro(){
        //     return new Promise(resolve => {
        //         setTimeout(() => {
        //         resolve()
        //         }, 1000)
        //     })
        //     }
        //     this.points = RoadRoamTool.copyPath();
        //     const vp = IModelApp.viewManager.selectedView;
        //     const cameraView = IModelApp.viewManager.selectedView.view;
        //     let len = this.points.length;

        //     for (let item = 0; item < len; item++){
        //         await pro();
        //         let eyePoint = vp.view.camera.eye;
        //         let target = this.points[item];
        //         const direction = eyePoint.vectorTo(target.origin);
        //         const startFrust = vp.getWorldFrustum();
        //         const lensAngle = direction.angleTo(target.direction);
        //         //const axis = direction.crossProduct(target.direction);
        //         cameraView.lookAtUsingLensAngle(eyePoint, target.origin, Vector3d.unitZ(), lensAngle);// frustNum is now current
        //         vp.synchWithView(true);
        //         vp.animateToCurrent(startFrust); //from start to current
        //         const endFrust = vp.getWorldFrustum();
        //         cameraView.moveCameraWorld(eyePoint.vectorTo(target.origin));
        //         vp.synchWithView(true);
        //         vp.animateToCurrent(endFrust);
        //         let test = vp.getWorldFrustum();
        //         console.log(test,endFrust);             
        //     }
        // },
        // getAllTransform(target){
        //     const vp = IModelApp.viewManager.selectedView;
        //     const frustum = vp.getFrustum();
        //     const newFrustNum = frustum.clone();
        //     const eyePoint = vp.view.camera.eye;
        //     const direction = eyePoint.vectorTo(target.origin);
        //     const translation = Transform.createTranslation(direction);
        //     newFrustNum.multiply(translation); // 平移

        //     const angle = direction.angleTo(target.direction);
        //     const axis = direction.crossProduct(target.direction);
        //     const rotate = Matrix3d.createRotationAroundVector(axis,angle);//旋转

        //     if(rotate === undefined){
        //         return newFrustNum;
        //     }
        //     const rotation = Transform.createFixedPointAndMatrix(eyePoint,rotate);
        //     newFrustNum.multiply(rotation);
        //     return newFrustNum;
        // },
        getAllTransform(target){
            const vp = IModelApp.viewManager.selectedView;
            const frustum = vp.getFrustum();
            const newFrustNum = frustum.clone();
            const eyePoint = vp.view.camera.eye;
            const direction = eyePoint.vectorTo(target.origin);
            const translation = Transform.createTranslation(direction);
            newFrustNum.multiply(translation); // 平移

            const angle = direction.angleTo(target.direction);
            const axis = direction.crossProduct(target.direction);
            const rotate = Matrix3d.createRotationAroundVector(axis,angle);//旋转

            if(rotate === undefined){
                return newFrustNum;
            }
            const rotation = Transform.createFixedPointAndMatrix(eyePoint,rotate);
            newFrustNum.multiply(rotation);
            return newFrustNum;
        },
        async roadRoam(){
            let points = RoadRoamTool.copyPath();
            const vp = IModelApp.viewManager.selectedView;
            const cameraView = IModelApp.viewManager.selectedView.view;
            let len = points.length;

            for (let item = 0; item < len-1; item++){
                let targetPoint = points[item];
                let startFrust = vp.getFrustum();
                let eyePoint = vp.view.camera.eye;
                let endFrust = this.getAllTransform(targetPoint);
            
                vp.setupViewFromFrustum(endFrust) //eyepoint没变
            }
        },
        register(toolNamespace){
            RoadRoamTool.toolId = 'iModelWeb.roadRoam';
            RoadRoamTool.register(toolNamespace);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.roadRoam {
        position: relative;
        .detail {
            position: absolute;
            right: 0;
            top: 38px;
            z-index: 999;
            width: 300px;
            max-height: 350px;
            overflow-y: auto;
            padding-bottom: 10px;
            text-align: left;
            border: 1px solid #666;
            background-color: #E9F2F9;
            padding: 10px;
            .el-checkbox {
                display: block;
                margin-left: 15px;
                margin-top: 10px;
            }
        }
}

</style>