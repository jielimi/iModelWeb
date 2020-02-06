<template>
    <div>
        <i class="iconfont icon-relitu heatMap"  @click.self="pop">
            <div v-show="showPop" class="detail">
                <el-switch
                    v-model="showHeatMap"
                    inactive-text="show HeatMap"
                    @change="isShowHeatMap">
                </el-switch>
                <div class=item>
                    <span>Mode:</span>
                    <el-select class="memory-select" v-model="mode" placeholder="" @change="paramChange" size="mini">
                        <el-option label="Random" value="0"></el-option>
                        <el-option label="Circle" value="1"></el-option>
                        <el-option label="Cross" value="2"></el-option>
                    </el-select>
                </div>
                <div class="item request">
                    <span>point Count:</span>
                    <el-input-number v-model="pointCount" @change="paramChange" :min="0" :step="1" size="mini"></el-input-number>
                </div>
                <div class="item request">
                    <span>spread Factor:</span>
                    <el-input-number v-model="spreadFactor" @change="paramChange" :min="0" :step="1" size="mini"></el-input-number>
                </div>
            </div>
        </i>
    </div>
    
</template>

<script>
import {IModelApp, PrimitiveTool, EventHandled} from "@bentley/imodeljs-frontend";
import { BasePointGenerator, RandomPointGenerator, CirclePointGenerator, CrossPointGenerator } from "./PointGenerators"
import HeatmapDecorator from './HeatmapDecorator'
import { Viewport, StandardViewId, IModelConnection, IModelAppOptions } from "@bentley/imodeljs-frontend";
import { Range2d } from "@bentley/geometry-core";
import { ColorDef } from "@bentley/imodeljs-common";
import { Id64String } from "@bentley/bentleyjs-core";


export default {
    name: 'heatmap',
    data () {
        return {
            pointGenerator: new RandomPointGenerator(),
            showDecorator: true,
            range: undefined,
            pointCount: 20,
            spreadFactor: 20,
            _heatmapDecorator:undefined,
            showPop:false,
            showHeatMap:false,
            mode:"0"
        };
    },
    components: {
        
    },
    created () {
        
    },
    methods: {
        isShowHeatMap(){
            if(this.showHeatMap){
                this.prepare()
            }else{
                this.teardownHeatmapDecorator()
            }
        },
        paramChange(){
            if(!this.showHeatMap) return;
            switch(this.mode){
                case '0':{
                    this.pointGenerator=new RandomPointGenerator();
                    break;
                }
                case '1':{
                    this.pointGenerator=new CirclePointGenerator();
                    break;
                }
                case '2':{
                    this.pointGenerator=new CrossPointGenerator();
                    break;
                }
                    
            }
            this.teardownHeatmapDecorator()
            this.prepare();
        },
        pop(){
            this.showPop = !this.showPop;
        },
        prepare(){
            let vp = IModelApp.viewManager.selectedView;
            // To make the heatmap look better, we want a top view, with a white background, etc.
            vp.setStandardRotation(StandardViewId.Top);

            const range = vp.view.computeFitRange();
            const height = range.zHigh;
            this.height = height;
            const aspect = vp.viewRect.aspect;
            range.expandInPlace(1);

            vp.view.lookAtVolume(range, aspect);
            vp.synchWithView(false);

            const style = vp.displayStyle.clone();
            style.backgroundColor = ColorDef.white.clone();
            vp.displayStyle = style;

            /* Grab the range of the contents of the view.  We'll use this to size the heatmap. */
            const range2d = Range2d.createFrom(range);
            this.range = range2d;
            this.setupHeatmapDecorator()

        },
        setupHeatmapDecorator()
        {
            const points = this.pointGenerator.generatePoints(this.pointCount, this.range);
            this._heatmapDecorator = new HeatmapDecorator(points, this.range, this.spreadFactor, this.height);
            IModelApp.viewManager.addDecorator(this._heatmapDecorator);
        },
        register(toolNamespace){
                
        },
        teardownHeatmapDecorator()
        {
            if (undefined === this._heatmapDecorator)
                return;
            IModelApp.viewManager.dropDecorator(this._heatmapDecorator);
            this._heatmapDecorator = undefined;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .heatMap {
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
        .item{
            margin-bottom: 10px; 
            span{
                font-size:14px;
            }
        }
    }
</style>