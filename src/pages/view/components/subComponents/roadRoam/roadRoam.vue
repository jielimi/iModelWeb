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

import { Arc3d} from "@bentley/geometry-core";

import {IModelJson as GeomJson,LineString3d,Point3d,Vector3d,Angle} from "@bentley/geometry-core";
import {AccuDrawHintBuilder,AccuDrawShortcuts,BeButtonEvent,DecorateContext,DynamicsContext,
    EventHandled, GraphicType,HitDetail,IModelApp,PrimitiveTool,SnapStatus } from "@bentley/imodeljs-frontend";
import {ColorDef, GeometryStreamProps,LinePixels} from "@bentley/imodeljs-common";
import { BeTimePoint, BeDuration } from "@bentley/bentleyjs-core";
import { RoadRoamTool } from "./RoadRoamTool"

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
            if(!this.showPop){
                IModelApp.tools.startDefaultTool()
            }
        },
        setPath(){
            IModelApp.tools.run("iModelWeb.roadRoam");
        },
        clearPath(){
            RoadRoamTool.clearPath()
        },
        async roadRoam(){
            function pro(){
            return new Promise(resolve => {
                setTimeout(() => {
                resolve()
                }, 1000)
            })
            }
            this.points = RoadRoamTool.copyPath();
            const vp = IModelApp.viewManager.selectedView;
            const cameraView = IModelApp.viewManager.selectedView.view;
            let len = this.points.length;

            for (let item = 1; item < len; item++){
                await pro();
                let eyePoint = new Point3d(this.points[item-1].x,this.points[item-1].y,this.points[item-1].z);
                let targetPoint = new Point3d(this.points[item].x,this.points[item].y,this.points[item].z);
                const startFrust = vp.getWorldFrustum();
                const lensAngle = Angle.createDegrees(75.6);
                cameraView.lookAtUsingLensAngle(eyePoint, targetPoint, Vector3d.unitZ(),lensAngle);
                vp.synchWithView(true);
                vp.animateToCurrent(startFrust);
                const secondFrust = vp.getWorldFrustum();
                cameraView.moveCameraWorld(eyePoint.vectorTo(targetPoint))
                vp.synchWithView(true);
                vp.animateToCurrent(secondFrust,BeDuration.fromMilliseconds(500));
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