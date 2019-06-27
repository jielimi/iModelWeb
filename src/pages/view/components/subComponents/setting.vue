<template>
    <div>
        <i class="iconfont icon-Gear- setting" @click.self="detail">
            <div v-show="isShowDetail" class="detail" id="changeRenderModeMenu">
                <el-form label-width="100px">
                    <el-form-item label="Style:">
                        <el-select v-model="style" size="mini" @change="handleStyleChange">
                            <el-option v-for="item in styleEntries" :label="item.name" :key="item.value" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form label-width="100px">
                    <el-form-item label="Render Mode:">
                        <el-select v-model="modeValue" @change="changeRenderMode" size="mini">
                            <el-option
                                v-for="mode in modeOptions"
                                :key="mode.value"
                                :label="mode.name"
                                :value="mode.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item title="View Flags" name="1">
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox v-for="mode in options" :label="mode.label" :key="mode.label" v-show="!(mode.only3d && !is3d)" @change="handelViewFlagChange($event,mode.label)">{{mode.flag}}</el-checkbox>
                        </el-checkbox-group>
                        <div class="shadowWrap">
                            <el-checkbox v-model="shadowActive"  @change="handleShadowCheckChange">
                                <span>Shadows</span>
                            </el-checkbox>
                            <div class="colorWrap" v-show="shadowActive">
                                <span>Shadow Color</span>
                                <input type="color" :value="currentShadowColor" @change="handleShadowColorChange">
                            </div>
                        </div>
                        
                    </el-collapse-item>
                    <el-collapse-item title="Edge Display" name="2">
                        <div>简化流程：设计简洁直观的操作流程；</div>
                    </el-collapse-item>
                    <el-collapse-item title="Environment" name="3">
                        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </i>
    </div>
</template>

<script>
import {
  ViewState,
  ViewState3d,
  Viewport,
  DisplayStyle3dState,
  DisplayStyle2dState,
  DisplayStyleState,
} from "@bentley/imodeljs-frontend";
import { RenderMode, ViewFlags, ColorDef } from "@bentley/imodeljs-common";
export default {
    name: 'setting',
    data () {
        return {
            isShowDetail: false,
            view: '',
            is3d: '',
            style: '',
            styleEntries: [],
            displayStyles: new Map(),
            activeName: '2',
            scratchViewFlags: new ViewFlags(),
            shadowActive: false,
            currentShadowColor: '#FFFFFF',
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
                {"label": "acsTriad", "flag": "ACS Triad","only3d": false},
                {"label": "grid", "flag": "Grid","only3d": false},
                {"label": "fill", "flag": "Fill","only3d": false},
                {"label": "materials", "flag": "Materials","only3d": false},
                {"label": "textures", "flag": "Textures","only3d": false},
                {"label": "monochrome", "flag": "Monochrome","only3d": false},
                {"label": "constructions", "flag": "Constructions","only3d": false},
                {"label": "transparency", "flag": "Transparency","only3d": false},
                {"label": "weights", "flag": "Line Weight","only3d": false},
                {"label": "styles", "flag": "Line Styles","only3d": false},
                {"label": "clipVolume", "flag": "Clip Volume","only3d": true},
                {"label": "forceSurfaceDiscard", "flag": "Force Surface Discard","only3d": true}
            ]
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('render_mode_init',this.initSetting);
    },
    methods: {
        detail() {
            this.isShowDetail = !this.isShowDetail;
        },
        initSetting(){
            this.view = this.GLOBAL_DATA.theViewPort.view;
            this.is3d = this.view.is3d();
            this.initStylePicker();
            this.addViewFlagAttribute();
        },
        async initStylePicker(){
            this.styleEntries = [];
            this.displayStyles = new Map();
            let is3d = this.view.is3d();
            let sqlName = is3d ? DisplayStyle3dState.classFullName : DisplayStyle2dState.classFullName;
            let displayStyleProps = await this.view.iModel.elements.queryProps({ from: sqlName, where: "IsPrivate=FALSE" });
            let promises = [];
            for (const displayStyleProp of displayStyleProps) {
                this.styleEntries.push({ name: displayStyleProp.code.value, value: displayStyleProp.id });
                let displayStyle;
                if (is3d){
                    displayStyle = new DisplayStyle3dState(displayStyleProp, this.view.iModel);
                }
                else{
                    displayStyle = new DisplayStyle2dState(displayStyleProp, this.view.iModel);
                }
                // ###TODO: Is there such a concept as "2d reality models"???
                promises.push(displayStyle.loadContextRealityModels());
                this.displayStyles.set(displayStyleProp.id, displayStyle);
            }
            this.style = this.view.displayStyle.id;
            await Promise.all(promises);
        },
        handleStyleChange(id){
            this.GLOBAL_DATA.theViewPort.displayStyle = this.displayStyles.get(id);
            this.GLOBAL_DATA.theViewPort.invalidateScene();
        },
        addViewFlagAttribute(label, flag){
            const viewflags = this.view.viewFlags;
            let that = this;
            this.options.forEach(function(value,index){
                // that.options.set(value.label,viewflags[value.label]);
                if(viewflags[value.label]){
                    that.checkList.push(value.label);
                }
            });
            this.addShadowsToggle();
        },
        addShadowsToggle(){
            if (this.GLOBAL_DATA.theViewPort.view.is3d()){
                this.currentShadowColor = this.GLOBAL_DATA.theViewPort.view.getDisplayStyle3d().settings.solarShadowsSettings.color;
            }
            let that = this;
            this.GLOBAL_DATA.theViewPort.onDisplayStyleChanged.addListener(function(vp){
                that.updateShadowUI(vp.view)
            });
        },
        handleShadowCheckChange($event){
            const vf = this.GLOBAL_DATA.theViewPort.viewFlags.clone(this._scratchViewFlags);
            vf.shadows = $event;
            this.GLOBAL_DATA.theViewPort.viewFlags = vf;
            this.sync();
        },
        updateShadowUI(view){
            if (view.is3d()){
                this.currentShadowColor = view.getDisplayStyle3d().settings.solarShadowsSettings.color;
            }
            // this.currentShadowColor = undefined === this.currentShadowColor ? "#FFFFFF" : this.currentShadowColor.toHexString();
        },
        handleShadowColorChange(e){
            this.currentShadowColor = e.target.value;
            this.GLOBAL_DATA.theViewPort.view.getDisplayStyle3d().settings.solarShadowsSettings.color = new ColorDef(this.currentShadowColor);
            this.sync();
        },
        handelViewFlagChange($event,label){
            const vf = this.GLOBAL_DATA.theViewPort.viewFlags.clone(this.scratchViewFlags);
            vf[label] = $event;
            this.GLOBAL_DATA.theViewPort.viewFlags = vf;
            this.sync();
        },
        changeRenderMode(thing){
            this.view.viewFlags.renderMode = Number.parseInt(thing, 10);
            this.sync();
        },
        sync() {
            this.GLOBAL_DATA.theViewPort.synchWithView(true);
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
            width: 320px;
            max-height: 400px;
            overflow-y: auto;
            padding-bottom: 10px;
            text-align: left;
            border: 1px solid #666;
            background-color: #E9F2F9;
            .el-checkbox {
                display: block;
                margin-left: 15px;
                margin-top: 5px;
            }
            .shadowWrap {
                position: relative;
                margin-bottom: 10px;
                .colorWrap {
                    position: absolute;
                    right: 10px;
                    top: -4px;
                }
            }
        }
    }
</style>