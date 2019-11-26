<template>
    <div class='keyin'>
        <el-select v-model="currTool" filterable placeholder="Select A Tool" size="mini" @change="toolChange">
            <el-option
            v-for="item in keyins"
            :key="item.toolId"
            :value="item.keyin"
            :label="item.keyin">
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
            currTool: '',
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
                if(tool.keyin){
                    this.keyins.push(tool);
                }
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

            let keyin = this.parseKeyin(item);
            if (undefined === keyin.tool) {
                console.log("Cannot find a key-in that matches: " + input);
                return;
            }
            let maxArgs = keyin.tool.maxArgs;
            if (keyin.args.length < keyin.tool.minArgs || (undefined !== maxArgs && keyin.args.length > maxArgs)) {
                console.log("Incorrect number of arguments");
                return;
            }
            let tool = new keyin.tool();
            let runStatus = false;
            try {
                runStatus = keyin.args.length > 0 ? tool.parseAndRun(...keyin.args) : tool.run();
                if (!runStatus)
                    console.log("Key-in failed to run");
            } catch (e) {
                console.log("Key-in caused the following exception to occur: " + e);
            }
            //IModelApp.tools.run(item, this.GLOBAL_DATA.theViewPort);
        },
        parseKeyin(input) {
            const tools = IModelApp.tools.getToolList();
            let tool = undefined;
            const args = [];
            const findTool = (lowerKeyin) => tools.find((x) => x.keyin.toLowerCase() === lowerKeyin || x.englishKeyin.toLowerCase() === lowerKeyin);

            // try the trivial, common case first
            tool = findTool(input.toLowerCase());
            if (undefined !== tool)
                return { tool, args };

            // Tokenize to separate keyin from arguments
            // ###TODO handle quoted arguments
            // ###TODO there's actually nothing that prevents a Tool from including leading/trailing spaces in its keyin, or sequences of more than one space...we will fail to find such tools if they exist...
            const tokens = input.split(" ").filter((x) => 0 < x.length);
            if (tokens.length <= 1)
                return { tool, args };

            // Find the longest starting substring that matches a tool's keyin.
            for (let i = tokens.length - 2; i >= 0; i--) {
                let substr = tokens[0];
                for (let j = 1; j <= i; j++) {
                    substr += " ";
                    substr += tokens[j];
                }

                tool = findTool(substr.toLowerCase());
                if (undefined !== tool) {
                    for (let k = i + 1; k < tokens.length; k++)
                        args.push(tokens[k]);

                    break;
                }
            }
            return { tool, args };
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