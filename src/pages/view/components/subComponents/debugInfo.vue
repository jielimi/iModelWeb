<template>
    <div class="debug-panel">
        <i class="iconfont icon-info"  @click="dialogVisible = true"></i>
        <el-dialog
            title="Debug Info"
            :visible.sync="dialogVisible"
            width="50%">
            <div class="item">
                <el-checkbox v-model="showFPS"  @change="handleFPSCheckChange">
                    <span v-show="fpsStatus == 0">Track FPS</span>
                    <span v-show="fpsStatus == 1">Tracking FPS...</span>
                    <span v-show="fpsStatus == 2">FPS: <span>{{ fps }}</span></span>
                </el-checkbox>
            </div>
            <div class="item request">
                <span>Max Active Requests:</span>
                <el-input-number v-model="maxActiveRequests" @change="handleRequestsChange" :min="0" :step="1" size="mini"></el-input-number>
            </div>
            <div class="item">
                <el-checkbox v-model="showTileRequests" @change="toggle">
                    <span>Track Tile Requests</span>
                </el-checkbox>
                <div class="tile-wrap" v-show="isShowRequest">
                    <table border="1" style="width:100%">
                        <tr>
                            <td style="width:50%">
                                <div class="request-inner">
                                    <span>Active:<span>{{ active }}</span></span>
                                    <span>Pending:<span>{{ pending }}</span></span>
                                    <span>Canceled:<span>{{ canceled }}</span></span>
                                    <span>Total:<span>{{ total }}</span></span>
                                    <span>Selected:<span>{{ selected }}</span></span>
                                    <span>Ready:<span>{{ ready }}</span></span>
                                    <span>Progress:<span>{{ progress }}</span></span>
                                    <span>&nbsp;</span>
                                </div>
                            </td>
                            <td style="width:50%">
                                <div class="request-inner">
                                    <span>Completed:<span>{{ completed }}</span></span>
                                    <span>Timed Out:<span>{{ timedOut }}</span></span>
                                    <span>Failed:<span>{{ failed }}</span></span>
                                    <span>Empty:<span>{{ empty }}</span></span>
                                    <span>Undisplayable:<span>{{ undisplayable }}</span></span>
                                    <span>Elided:<span>{{ elided }}</span></span>
                                    <span>Cache Misses:<span>{{ cacheMisses }}</span></span>
                                    <span>Dispatched:<span>{{ dispatched }}</span></span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="btn-wrap" colspan="2">
                                <el-button size="mini">Reset</el-button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class=item>
                <div>
                    <span>Track Memory:</span>
                    <el-select class="memory-select" v-model="form.memory" placeholder="" @change="memIndexChange" size="mini">
                        <el-option label="None" value="-1"></el-option>
                        <el-option label="ViewportTileTrees" value="0"></el-option>
                        <el-option label="AllTileTrees" value="1"></el-option>
                    </el-select>
                </div>
                <div>
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
                        <tr>
                            <td class="btn-wrap" colspan="2">
                                <el-button :disabled="form.memory != '1'" type="success" size="mini" @click="purge">Purge</el-button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="item">
                <el-collapse>
                    <el-collapse-item title="Tools Setting">
                       <div class="setting-inner">
                            <el-checkbox label="Preserve World Up When Rotating" v-model="toolSettings.pwuCheck" @change="PWUCheckChange"></el-checkbox>
                        </div>
                        <div class="setting-inner">
                            <span>Animation Duration (ms): </span>
                            <el-input-number
                                size="mini"
                                :min = "0"
                                :step = 1
                                @blur="changeAnimationDuration"
                                v-model="toolSettings.animationTime">
                            </el-input-number>
                        </div>
                        <div class="setting-inner">
                            <span>Pick Radius (inches): </span>
                            <el-input-number
                                size="mini"
                                :min = "0"
                                :step= 0.01
                                @blur="changePickRadius"
                                v-model="toolSettings.viewToolPickRadiusInches">
                            </el-input-number>
                        </div>
                        <div class="setting-inner">
                            <el-checkbox label="Walk Enforce Z Up" 
                            v-model="toolSettings.walkEnforceZUp" @change="walkEnforceZUpChange"></el-checkbox>
                        </div>
                        <div class="setting-inner" label="Walk Camera Angle (degrees): ">
                            <span>Animation Duration (ms):</span>
                            <el-input-number
                                size="mini"
                                :min = "0"
                                :step= 0.1
                                @blur="changeWalkCameraAngle"
                                v-model="toolSettings.walkCameraAngle">
                            </el-input-number>
                        </div>
                        <div class="setting-inner">
                            <span>Walk Velocity (meters per second): </span>
                            <el-input-number
                                size="mini"
                                :min = "0"
                                :step= 0.1
                                @blur="changeWalkVelocity"
                                v-model="toolSettings.walkVelocity">
                            </el-input-number>
                        </div>
                        <div class="setting-inner">
                            <span>Wheel Zoom Bump Distance (meters): </span>
                            <el-input-number
                                size="mini"
                                :min = "0"
                                :step= 0.025
                                @blur="changeWheelZoomBumpDistance"
                                v-model="toolSettings.wheelZoomBumpDistance">
                            </el-input-number>
                        </div>
                        <div class="setting-inner">
                            <span>Wheel Zoom Ratio: </span>
                            <el-input-number
                                size="mini"
                                :min = "0"
                                :step= 0.025
                                @blur="changeWheelZoomRatio"
                                v-model="toolSettings.wheelZoomRatio">
                            </el-input-number>
                        </div>
                        <div class="setting-inner">
                            <span>Interial damping: </span>
                            <el-input-number
                                size="mini"
                                :min= "0"
                                :max= "1"
                                :step= 0.05
                                @blur="changeDamping"
                                v-model="toolSettings.damping">
                            </el-input-number>
                        </div>
                        <div class="setting-inner">
                            <span>Interial duration (seconds): </span>
                            <el-input-number
                                size="mini"
                                :min= "0"
                                :max= "10"
                                :step= 0.05
                                @blur="changeInertiaDuration"
                                v-model="toolSettings.inertiaDuration">
                            </el-input-number>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>        
        </el-dialog>
    </div>
</template>

<script>
import {
  IModelApp,
  PerformanceMetrics,
  Target,
  TileAdmin,
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
            activeNames: '',
            showFPS: false,
            fpsStatus: 0,
            _metrics: undefined,
            _curIntervalId: undefined,
            _curRequestIntervalId: undefined,
            fps: 0,
            maxActiveRequests: 0,
            showTileRequests: false,
            isShowRequest: false,
            active: 0,
            pending: 0,
            canceled: 0,
            total: 0,
            selected: 0,
            ready: 0,
            progress: 0,
            completed: 0,
            timedOut: 0,
            failed: 0,
            empty: 0,
            undisplayable: 0,
            elided: 0,
            cacheMisses: 0,
            dispatched: 0,
            form:{
                memory:'-1',
                oldMemIndex:'0',
                total:'',
                totalTileTrees:'',
                texture:[],
                buffer:[]
            },
            toolSettings:{
                pwuCheck:ToolSettings.preserveWorldUp,// If true, view rotation tool keeps the up vector (worldZ) aligned with screenY.
                animationTime:ToolSettings.animationTime.milliseconds,//Duration of animations of viewing operations.you can try undo to test it
                viewToolPickRadiusInches:ToolSettings.viewToolPickRadiusInches,//Radius in screen inches to search for elements that anchor viewing operations,you can try pan to test it (0.1 or 1000)
                walkEnforceZUp:ToolSettings.walkEnforceZUp, //Whether the walk tool enforces worldZ be aligned with screenY
                walkCameraAngle:ToolSettings.walkCameraAngle.degrees,//Camera angle enforced for walk tool
                walkVelocity:ToolSettings.walkVelocity,//Speed, in meters per second, for the walk tool
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
    created () {
        window.eventHub.$on('render_mode_init',this.init);
    },
    methods: {
        init(){
            this.maxActiveRequests = IModelApp.tileAdmin.maxActiveRequests;
        },
        handleFPSCheckChange($event){
            if($event){
                this.fpsStatus = 1;
                this.GLOBAL_DATA.theViewPort.continuousRendering = $event;
                this._metrics = new PerformanceMetrics(false, true);
                this._curIntervalId = setInterval(() => this.updateFPS(), 500);
            }else{
                this.fpsStatus = 0;
                this._metrics = undefined;
                this.clearInterval();
            }
            this.GLOBAL_DATA.theViewPort.target.performanceMetrics = this._metrics;
        },
        updateFPS(){
            const metrics = this._metrics;
            this.fps = (metrics.spfTimes.length / metrics.spfSum).toFixed(2);
            this.fpsStatus = 2;
        },
        clearInterval(){
            if (undefined !== this._curIntervalId) {
                clearInterval(this._curIntervalId);
                this._curIntervalId = undefined;
            }
        },
        handleRequestsChange(){
            IModelApp.tileAdmin.maxActiveRequests = this.maxActiveRequests;
        },
        toggle(){
            if (undefined !== this._curRequestIntervalId) {
                this.isShowRequest = false;
                this.clearRequestInterval();
            } else {
                this.isShowRequest = true;
                this.update();
                this._curRequestIntervalId = setInterval(() => this.update(), 500);
            }
        },
        update(){
            const stats = IModelApp.tileAdmin.statistics;
            this.active = stats.numActiveRequests;
            this.pending = stats.numPendingRequests;
            this.canceled = stats.numCanceled;
            this.total = stats.numActiveRequests + stats.numPendingRequests;
            this.selected = this.GLOBAL_DATA.theViewPort.numSelectedTiles;
            this.ready = this.GLOBAL_DATA.theViewPort.numReadyTiles;
            this.progress = this.computeProgress(this.GLOBAL_DATA.theViewPort);
            this.completed = stats.totalCompletedRequests;
            this.timedOut = stats.totalTimedOutRequests;
            this.failed = stats.totalFailedRequests;
            this.empty = stats.totalEmptyTiles;
            this.undisplayable = stats.totalUndisplayableTiles;
            this.elided = stats.totalElidedTiles;
            this.cacheMisses = stats.totalCacheMisses;
            this.dispatched = stats.totalDispatchedRequests;
        },
        computeProgress(vp){
            const ready = vp.numReadyTiles;
            const requested = vp.numRequestedTiles;
            const total = ready + requested;
            const ratio = (total > 0) ? (ready / total) : 1.0;
            return Math.round(ratio * 100);
        },
        reset(){
            IModelApp.tileAdmin.resetStatistics();
            this.update();
        },
        clearRequestInterval(){
            if (undefined !== this._curRequestIntervalId) {
                clearInterval(this._curRequestIntervalId);
                this._curRequestIntervalId = undefined;
            }
        },
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
    .debug-panel {
        .item {
            margin-top: 10px;
        }
        .tile-wrap {
            margin-top: 5px;
        }
        .memory-select {
            margin-top: 10px;
            margin-bottom: 10px;
        }
        table {
            border-collapse: collapse;
            text-align: right;
            .request-inner > span {
                display: block;
                margin: 5px 3px 5px 0;
            }
            label{
                display: block;
                margin: 5px 3px 5px 0;
            }
            .btn-wrap {
                padding: 5px 0;
                text-align: center;
            }
        }
        .setting-inner {
            margin-top: 5px;
            span {
                display: inline-block;
                width: 230px;
                text-align: right;
            }
        }
        
        .clearfix:after {
            visibility: hidden;
            display: block;
            font-size: 0;
            content: " ";
            clear: both;
            height: 0;
        }
    }
    
</style>