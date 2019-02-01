<template>
    <div>
        <i class="iconfont icon-Gear-4 setting" @click.self="detail">
            <div v-show="isShowDetail" class="detail" id="changeRenderModeMenu">
                <el-select v-model="modeValue" @change="changeRenderMode" size="mini">
                    <el-option
                        v-for="mode in modeOptions"
                        :key="mode.value"
                        :label="mode.name"
                        :value="mode.value">
                    </el-option>
                </el-select>
                <el-checkbox-group v-model="checkList">
                    <el-checkbox v-for="mode in options" :label="mode.id" :key="mode.id" @change="applyRenderModeChange($event,mode.id)">{{mode.text}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
import { RenderMode } from "@bentley/imodeljs-common/lib/common"
export default {
    name: 'setting',
    data () {
        return {
            isShowDetail: false,
            modeValue: RenderMode.SmoothShade,
            renderModeOptions: {
                flags: new Map(),
                mode: RenderMode.SmoothShade
            },
            modeOptions:[
                {"value": RenderMode.SmoothShade,"name": "Smooth Shade"},
                {"value": RenderMode.SolidFill,"name": "Solid Fill"},
                {"value": RenderMode.HiddenLine,"name": "Hidden Line"},
                {"value": RenderMode.Wireframe,"name": "Wireframe"}
            ],
            checkList: [],
            options: [
                {"id": "skybox", "text": "Skybox"},
                {"id": "groundplane", "text": "Ground Plane"},
                {"id": "ACSTriad", "text": "ACS Triad"},
                {"id": "fill", "text": "Fill"},
                {"id": "grid", "text": "Grid"},
                {"id": "textures", "text": "Textures"},
                {"id": "visibleEdges", "text": "Visible Edges"},
                {"id": "hiddenEdges", "text": "Hidden Edges"},
                {"id": "materials", "text": "Materials"},
                {"id": "lights", "text": "Lights"},
                {"id": "monochrome", "text": "Monochrome"},
                {"id": "constructions", "text": "Constructions"},
                {"id": "transparency", "text": "Transparency"},
                {"id": "weights", "text": "Line Weight"},
                {"id": "styles", "text": "Line Styles"}
            ]
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('render_mode_init',this.updateRenderModeOptionsMap);
    },
    methods: {
        detail() {
            this.isShowDetail = !this.isShowDetail;
        },
        updateRenderModeOptionsMap() {
            let skybox = false;
            let groundplane = false;
            if (this.GLOBAL_DATA.theViewPort.view.is3d()) {
                const view = this.GLOBAL_DATA.theViewPort.view;
                debugger;
                const env = view.getDisplayStyle3d().environment;
                skybox = env.sky.display;
                groundplane = env.ground.display;
            }
            const viewflags = this.GLOBAL_DATA.theViewPort.view.viewFlags;
            const lights = viewflags.sourceLights || viewflags.solarLight || viewflags.cameraLights;

            this.checkList = [];
            this.updateRenderModeOption("skybox", skybox, this.renderModeOptions.flags);
            this.updateRenderModeOption("groundplane", groundplane, this.renderModeOptions.flags);
            this.updateRenderModeOption("ACSTriad", viewflags.ACSTriad, this.renderModeOptions.flags);
            this.updateRenderModeOption("fill", viewflags.fill, this.renderModeOptions.flags);
            this.updateRenderModeOption("grid", viewflags.grid, this.renderModeOptions.flags);
            this.updateRenderModeOption("textures", viewflags.textures, this.renderModeOptions.flags);
            this.updateRenderModeOption("visibleEdges", viewflags.visibleEdges, this.renderModeOptions.flags);
            this.updateRenderModeOption("hiddenEdges", viewflags.hiddenEdges, this.renderModeOptions.flags);
            this.updateRenderModeOption("materials", viewflags.materials, this.renderModeOptions.flags);
            this.updateRenderModeOption("lights", lights, this.renderModeOptions.flags);
            this.updateRenderModeOption("monochrome", viewflags.monochrome, this.renderModeOptions.flags);
            this.updateRenderModeOption("constructions", viewflags.constructions, this.renderModeOptions.flags);
            this.updateRenderModeOption("weights", viewflags.weights, this.renderModeOptions.flags);
            this.updateRenderModeOption("styles", viewflags.styles, this.renderModeOptions.flags);
            this.updateRenderModeOption("transparency", viewflags.transparency, this.renderModeOptions.flags);
            // console.log(this.renderModeOptions);
            this.renderModeOptions.mode = viewflags.renderMode;
            this.modeValue = viewflags.renderMode;
        },
        updateRenderModeOption(id,enabled,options){
            options.set(id, enabled);
            if(enabled){
                this.checkList.push(id);
            }
        },
        applyRenderModeChange($event,mode){
            const menuDialog = document.getElementById("changeRenderModeMenu");
            const newValue = this.checkList.indexOf(mode) >= 0 ? true : false;
            this.renderModeOptions.flags.set(mode, newValue);
            IModelApp.tools.run("View.ChangeRenderMode", this.GLOBAL_DATA.theViewPort, this.renderModeOptions.flags, menuDialog, this.renderModeOptions.mode);
        },
        changeRenderMode(thing){
            const view = this.GLOBAL_DATA.theViewPort
            const activeView = this.GLOBAL_DATA.activeViewState.viewState;

             view.viewFlags.renderMode = Number.parseInt(thing, 10);
             view.synchWithView(true);
            
            // const menuDialog = document.getElementById("changeRenderModeMenu");
            // this.renderModeOptions.mode = this.modeValue;
            // IModelApp.tools.run("View.ChangeRenderMode", this.GLOBAL_DATA.theViewPort, this.renderModeOptions.flags, menuDialog, this.renderModeOptions.mode);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-checkbox+.el-checkbox {
        margin-left: 0;
    }
    .setting {
        position: relative;
        .detail {
            position: absolute;
            left: 0;
            top: 45px;
            z-index: 999;
            width: 200px;
            padding-bottom: 10px;
            text-align: left;
            border: 1px solid #666;
            background-color: #E9F2F9;
            .el-checkbox {
                display: block;
                margin-left: 15px;
                margin-top: 5px;
            }
        }
    }
</style>