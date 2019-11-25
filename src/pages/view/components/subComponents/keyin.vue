<template>
    <div class='keyin'>
        <el-select v-model="toolId" placeholder="Select A Tool" size="mini" @change="toolChange">
            <el-option
            v-for="item in keyins"
            :label="item.toolId"
            :value="item.toolId"
            :key="item.toolId">
            </el-option>
        </el-select>
        <span class="fps">
            <el-checkbox v-model="showFPS"  @change="handleFPSCheckChange">
                <span v-show="fpsStatus == 0">Track FPS</span>
                <span v-show="fpsStatus == 1">Tracking FPS...</span>
                <span v-show="fpsStatus == 2">FPS: <span>{{ fps }}</span></span>
            </el-checkbox>
        </span>
    </div>
</template>

<script>
// import { BeEvent } from "@bentley/bentleyjs-core";
import { IModelApp,PerformanceMetrics } from "@bentley/imodeljs-frontend";
export default {
    name: 'keyin',
    data () {
        return {
            fps: 0,
            showFPS: false,
            fpsStatus: 0,
            _metrics: undefined,
            toolId: '',
            keyins: []
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('keyin_init',this.init);
    },
    methods: {
        init(){
            let tools = IModelApp.tools.getToolList();
            for (const tool of tools) {
                this.keyins.push(tool);
            }
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
        toolChange(item){
            //IModelApp.tools.run(item, this.GLOBAL_DATA.theViewPort);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-select {
        margin-right: 10px;
    }
</style>