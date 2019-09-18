<template>
    <div @click="dialogVisible = true">
        <i class="iconfont icon-info"></i>
        <el-dialog
            title="Debug Info"
            :visible.sync="dialogVisible"
            width="50%"
            >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="Track Memory:">
                    <el-select v-model="form.memory" placeholder="" @change="memIndexChange">
                        <el-option label="None" value="-1"></el-option>
                        <el-option label="ViewportTileTrees" value="0"></el-option>
                        <el-option label="AllTileTrees" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <table border="1" style="width:100%" v-show="form.memory != '-1'">
                        <tr>
                            <td style="width:50%">
                                <div>
                                    <label v-for="(val,key) in form.texture">{{val}}</label>
                                </div>
                            </td>
                            <td style="width:50%">
                                <div>
                                    <label v-for="(val,key) in form.buffer">{{val}}</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%">
                                <div>
                                    <label>Total:{{form.total}}</label>
                                </div>
                            </td>
                            <td style="width:50%">
                                <div>
                                    <label>Total Tile Tree:{{form.totalTileTrees}}</label>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <el-button
                        :disabled="form.memory != '1'"
                        type="success"
                        size="mini"
                        @click="purge">Purge
                    </el-button>
                </el-form-item>
                <el-form-item label="Tools Setting"> 
                    <el-collapse v-model="activeNames">
                        <el-collapse-item title="" name="1">
                           <el-form ref="toolSettings" :model="toolSettings" label-width="80px">
                               <el-form-item >
                                    <el-checkbox label="Preserve World Up When Rotating" 
                                    v-model="toolSettings.pwuCheck" @change="PWUCheckChange"></el-checkbox>
                                </el-form-item>
                                <el-form-item label="Animation Duration (ms):">
                                    <el-input
                                        type="number"
                                        min = 0
                                        step = 1
                                        @blur="changeAnimationDuration"
                                        v-model="toolSettings.animationTime">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Pick Radius (inches): ">
                                    <el-input
                                        type="number"
                                        min = 0
                                        step= 0.01
                                        @blur="changePickRadius"
                                        v-model="toolSettings.viewToolPickRadiusInches">
                                    </el-input>
                                </el-form-item>
                                <el-form-item >
                                    <el-checkbox label="Walk Enforce Z Up" 
                                    v-model="toolSettings.walkEnforceZUp" @change="walkEnforceZUpChange"></el-checkbox>
                                </el-form-item>
                                <el-form-item label="Walk Camera Angle (degrees): ">
                                    <el-input
                                        type="number"
                                        min = 0
                                        step= 0.1
                                        @blur="changeWalkCameraAngle"
                                        v-model="toolSettings.walkCameraAngle">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Walk Velocity (meters per second): ">
                                    <el-input
                                        type="number"
                                        min = 0
                                        step= 0.1
                                        @blur="changeWalkVelocity"
                                        v-model="toolSettings.walkVelocity">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Wheel Zoom Bump Distance (meters): ">
                                    <el-input
                                        type="number"
                                        min = 0
                                        step= 0.025
                                        @blur="changeWheelZoomBumpDistance"
                                        v-model="toolSettings.wheelZoomBumpDistance">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Wheel Zoom Ratio: ">
                                    <el-input
                                        type="number"
                                        min = 0
                                        step= 0.025
                                        @blur="changeWheelZoomRatio"
                                        v-model="toolSettings.wheelZoomRatio">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Interial damping: ">
                                    <el-input
                                        type="number"
                                        min= 0,
                                        max= 1,
                                        step= 0.05,
                                        @blur="changeDamping"
                                        v-model="toolSettings.damping">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Interial duration (seconds): ">
                                    <el-input
                                        type="number"
                                        min= 0,
                                        max= 10,
                                        step= 0.05,
                                        @blur="changeInertiaDuration"
                                        v-model="toolSettings.inertiaDuration">
                                    </el-input>
                                </el-form-item>
                           </el-form>
                           
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
            </el-form>        
        </el-dialog>
    </div>
</template>

<script>
import {
  IModelApp,
  RenderMemory,
  TileTree,
  TileTreeSet,
  Viewport,
  ToolSettings
} from "@bentley/imodeljs-frontend";
import { assert, BeTimePoint,BeDuration } from "@bentley/bentleyjs-core";


export default {
    name: 'debuginfo',
    data () {
        return {
            dialogVisible: false,
            form:{
                memory:'None',
                oldMemIndex:'0',
                total:'',
                totalTileTrees:'',
                texture:[],
                buffer:[]
            },
            
            toolSettings:{
                pwuCheck:ToolSettings.preserveWorldUp,
                animationTime:ToolSettings.animationTime.milliseconds,
                viewToolPickRadiusInches:ToolSettings.viewToolPickRadiusInches,
                walkEnforceZUp:ToolSettings.walkEnforceZUp, //Whether the walk tool enforces worldZ be aligned with screenY
                walkCameraAngle:ToolSettings.walkCameraAngle.degrees,
                walkVelocity:ToolSettings.walkVelocity,
                wheelZoomBumpDistance:ToolSettings.wheelZoomBumpDistance,
                wheelZoomRatio:ToolSettings.wheelZoomRatio,
                damping:ToolSettings.viewingInertia.damping,
                inertiaDuration:ToolSettings.viewingInertia.duration.milliseconds / 1000
            },
            _curIntervalId:'',
            
        };
    },
    components: {
        
    },
    created () {},
    methods: {
         formatMemory(numBytes) {
            let suffix = "b";
            if (numBytes >= 1024) {
                numBytes /= 1024;
                suffix = "kb";
                if (numBytes >= 1024) {
                numBytes /= 1024;
                suffix = "mb";
                }
            }
            return numBytes.toFixed(2) + suffix;
        },
        collectTileTreeMemory(stats, owner) {
            const tree = owner.tileTree;
            if (undefined !== tree)
                tree.collectStatistics(stats);
        },
        clearInterval() {
            if (undefined !== this._curIntervalId) {
                clearInterval(this._curIntervalId);
                this._curIntervalId = undefined;
            }
        },
        memIndexChange(index){
            if(this.oldMemIndex == index){
                return;
            }

            if ("-1" === index) {
                this.clearInterval();
                return;
            }

            if (undefined === this._curIntervalId) {
                this._curIntervalId = setInterval(() => this.unpdate(index), 1000);
            }

            this.oldMemIndex = index;
        },
        unpdate(index){
            const calcMem = [
                (stats, vp) => {
                    vp.collectStatistics(stats);
                    const trees = new TileTreeSet();
                    vp.discloseTileTrees(trees);
                    return trees.size;
                },
                (stats, vp) => {
                    let numTrees = 0;
                    vp.view.iModel.tiles.forEachTreeOwner((owner) => {
                    this.collectTileTreeMemory(stats, owner);
                    if (undefined !== owner.tileTree)
                        ++numTrees;
                    });
                    return numTrees;
                },
            ];

            let _stats = new RenderMemory.Statistics();
            let _vp = this.GLOBAL_DATA.theViewPort;
            const calc = calcMem[index];
            _stats.clear();
            const numTrees = calc(_stats, _vp);
            this.form.total = this.formatMemory(_stats.totalBytes);
            this.form.totalTileTrees = numTrees;

            //Texture
            this.updateTexture(_stats.consumers, _stats.totalBytes - _stats.buffers.totalBytes);;
            // Buffer
            this.updateBuffer(_stats.buffers.consumers, _stats.buffers.totalBytes);
        },
        updateTexture(stats,totalBytes){
            let lables = ["Surface Textures", "Vertex Tables", "Feature Tables", 
            "Feature Overrides", "Clip Volumes", "Planar Classifiers", "Shadow Maps"]
            this.form.texture=[];
            for(let index =0;index < lables.length;index++){
                const stat = stats[index];
                if (0 === stat.totalBytes) {
                    continue;
                }else{
                    let item = lables[index] + "(" +stat.count + "): " + this.formatMemory(stat.totalBytes);
                    this.form.texture.push(item)
                }
            }
        },
        updateBuffer(stats,totalBytes){
            let lables = ["Surfaces", "Visible Edges", "Silhouettes", "Polyline Edges", 
            "Polylines", "Point Strings", "Point Clouds", "Instances"];
            this.form.buffer=[];
            for(let index =0;index < lables.length;index++){
                const stat = stats[index];
                if (0 === stat.totalBytes) {
                    continue;
                }else{
                    let item = lables[index] + "(" +stat.count + "): " + this.formatMemory(stat.totalBytes);
                    this.form.buffer.push(item)
                }
            }
        },
        purge(){
            let _vp = this.GLOBAL_DATA.theViewPort;
            const purge = IModelApp.viewManager.purgeTileTrees(BeTimePoint.now());
            if (undefined !== purge) {
                purge();
                this._vp.invalidateScene(); // to trigger reloading of tiles we actually do want to continue drawing
                this.update(this.oldMemIndex);
            }

        },
        opendebug(){
           
        },
        // Tools setting
        PWUCheckChange(){
            ToolSettings.preserveWorldUp = !ToolSettings.preserveWorldUp
            IModelApp.toolAdmin.exitViewTool();
        },
        changeAnimationDuration(){
            ToolSettings.animationTime = BeDuration.fromMilliseconds(this.toolSettings.animationTime); 
            IModelApp.toolAdmin.exitViewTool();
        },
        changePickRadius(){
            ToolSettings.viewToolPickRadiusInches = this.toolSettings.viewToolPickRadiusInches;
             IModelApp.toolAdmin.exitViewTool();
        },
        walkEnforceZUpChange(){
            ToolSettings.walkEnforceZUp = !ToolSettings.walkEnforceZUp;
            IModelApp.toolAdmin.exitViewTool();
        },
        changeWalkCameraAngle(){
            ToolSettings.walkCameraAngle.setDegrees(this.toolSettings.walkCameraAngle); 
            IModelApp.toolAdmin.exitViewTool();
        },
        changeWalkVelocity(){
            ToolSettings.walkVelocity = this.toolSettings.walkVelocity;
             IModelApp.toolAdmin.exitViewTool();
        },
        changeWheelZoomBumpDistance(){
            ToolSettings.wheelZoomBumpDistance = this.toolSettings.wheelZoomBumpDistance; 
            IModelApp.toolAdmin.exitViewTool();
        },
        changeWheelZoomRatio(){
            ToolSettings.wheelZoomRatio = this.toolSettings.wheelZoomRatio;
             IModelApp.toolAdmin.exitViewTool();
        },
        changeDamping(){
            ToolSettings.viewingInertia.damping = this.toolSettings.damping;
             IModelApp.toolAdmin.exitViewTool();
        },
        changeInertiaDuration(){
            ToolSettings.viewingInertia.duration = BeDuration.fromMilliseconds(this.toolSettings.inertiaDuration * 1000);
             IModelApp.toolAdmin.exitViewTool();
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>