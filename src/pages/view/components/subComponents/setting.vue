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
                        <div>
                            <el-checkbox v-model="showVisibleEdges"  @change="handleVisibleEdgesCheckChange">
                                <span>Visible Edges</span>
                            </el-checkbox>
                            <div v-show="showVisibleEdges">
                                <el-checkbox v-model="transparencyActive" @change="handleTransparencyCheckChange">
                                    <span>Transparency</span>
                                    <input type="range" :disabled="!transparencyActive" v-model="currTransparency" class="range" min="0.0" max="1.0" step="0.05" @change="handleTransparencyChange">
                                </el-checkbox>
                                <el-checkbox v-model="colorActive" @change="handleColorCheckChange">
                                    <span>Color</span>
                                    <input type="color" :disabled="!colorActive" v-model="currColor" @change="handleColorChange">
                                </el-checkbox>
                                <el-checkbox v-model="weightActive" @change="handleWeightCheckChange">
                                    <span>Weight</span>
                                    <input type="number" :disabled="!weightActive" class="weight" min="1" max="31" step="1" v-model="currWeight" @change="handleWeightChange">
                                </el-checkbox>
                                <el-form label-width="58px">
                                    <el-form-item label="Style">
                                        <el-select v-model="pattern" size="mini" @change="handleVisibleStyleChange">
                                            <el-option v-for="item in entries" :label="item.name" :key="item.value" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div>
                            <el-checkbox v-model="showHiddenEdges" :disabled="!showVisibleEdges"  @change="handleHiddenEdgesCheckChange">
                                <span>Hidden Edges</span>
                            </el-checkbox>
                            <div v-show="showHiddenEdges && showVisibleEdges">
                                <el-checkbox v-model="hiddenWeightActive" @change="handleHiddenWeightCheckChange">
                                    <span>Weight</span>
                                    <input type="number" :disabled="!hiddenWeightActive" class="weight" min="1" max="31" step="1" v-model="currHiddenWeight" @change="handleHiddenWeightChange">
                                </el-checkbox>
                                <el-form label-width="58px">
                                    <el-form-item label="Style">
                                        <el-select v-model="hiddenPattern" size="mini" @change="handleHiddenStyleChange">
                                            <el-option v-for="item in entries" :label="item.name" :key="item.value" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="Environment" name="3">
                        <el-checkbox v-model="showSkyBox"  @change="handleShowSkyBoxCheckChange">
                            <span>Sky Box</span>
                        </el-checkbox>
                        <div v-show="showSkyBox">
                            <el-radio-group v-model="radio" @change="handelRadioChange">
                                <el-radio :label="'2colors'">2 Colors</el-radio>
                                <el-radio :label="'4colors'">4 Colors</el-radio>
                            </el-radio-group>
                            <div class="color-group">
                                <span class="color-label">Sky Color</span>
                                <input type="color" v-model="skyColor" @change="handleSkyColorChange">
                                <span class="color-label">Ground Color</span>
                                <input type="color" v-model="groundColor" @change="handleGroundColorChange">
                                
                            </div>
                            <div class="color-group" v-show="radio==='4colors'">
                                <span class="color-label">Zenith Color</span>
                                <input type="color" v-model="zenithColor" @change="handleZenithColorChange">
                                <span class="color-label">Nadir Color</span>
                                <input type="color" v-model="nadirColor" @change="handleNadirColorChange">
                            </div>
                            <div>
                                <span class="transparency-label">Sky Exponent</span>
                                <input type="range" class="range" min="0.0" max="20.0" step="0.25" v-model="skyTransparency" @change="handleSkyExponentChange">
                            </div>
                            <div>
                                <span class="transparency-label">Ground Exponent</span>
                                <input type="range" class="range" min="0.0" max="20.0" step="0.25" v-model="groundTransparency" @change="handleGroundExponentChange">
                            </div>
                        </div>
                        <el-checkbox v-model="showGroundPlane"  @change="handleShowGroundPlaneChange">
                            <span>Ground Plane</span>
                        </el-checkbox>
                    </el-collapse-item>
                </el-collapse>
                <el-checkbox class="occlusion" v-model="showOcclusion" @change="handleOcclusionCheckChange">
                    <span>Ambient Occlusion</span>
                </el-checkbox>
                <el-form v-show="showOcclusion">
                    <div>
                        <span class="occlusion-label">Bias:</span>
                        <input type="range" class="occlusion-range" v-model="aoBias" min="0.0" max="1.0" step="0.025" @change="handelBiasChange">
                    </div>
                    <div>
                        <span class="occlusion-label">Length Cap:</span>
                        <input type="range" class="occlusion-range" v-model="aoZLengthCap" min="0.0" max="0.25" step="0.000025" @change="handelZLengthCapChange">
                    </div>
                    <div>
                        <span class="occlusion-label">Intensity:</span>
                        <input type="range" class="occlusion-range" v-model="aoIntensity" min="1.0" max="16.0" step="0.1" @change="handelIntensityChange">
                    </div>
                    <div>
                        <span class="occlusion-label">Step:</span>
                        <input type="range" class="occlusion-range" v-model="aoTexelStepSize" min="1.0" max="5.0" step="0.005" @change="handelTexelStepSizeChange">
                    </div>
                    <div>
                        <span class="occlusion-label">Blur Delta:</span>
                        <input type="range" class="occlusion-range" v-model="aoBlurDelta" min="0.5" max="1.5" step="0.0001" @change="handelBlurDeltaChange">
                    </div>
                    <div>
                        <span class="occlusion-label">Blur Sigma:</span>
                        <input type="range" class="occlusion-range" v-model="aoBlurSigma" min="0.5" max="5.0" step="0.0001" @change="handelBlurSigmaChange">
                    </div>
                    <div>
                        <span class="occlusion-label">Blur Step:</span>
                        <input type="range" class="occlusion-range" v-model="aoBlurTexelStepSize" min="1.0" max="5.0" step="0.005" @change="handelBlurTexelStepSizeChange">
                    </div>
                </el-form>
            </div>
        </i>
    </div>
</template>

<script>
import {
  IModelApp,  
  Environment,
  SkyBox,
  SkyGradient,
  ViewState,
  ViewState3d,
  Viewport,
  DisplayStyle3dState,
  DisplayStyle2dState,
  DisplayStyleState,
} from "@bentley/imodeljs-frontend";
import { RenderMode, ViewFlags, ColorDef, HiddenLine, LinePixels, AmbientOcclusion } from "@bentley/imodeljs-common";
export default {
    name: 'setting',
    data () {
        return {
            isShowDetail: false,
            view: '',
            is3d:true,
            style: '',
            styleEntries: [],
            displayStyles: new Map(),
            activeName: '',
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
                {"label": "forceSurfaceDiscard", "flag": "Force Surface Discard","only3d": true},
                {"label": "backgroundMap", "flag": "Background Map","only3d": false}
            ],
            showVisibleEdges: false,
            showHiddenEdges: false,
            transparencyActive: false,
            currTransparency: '0.0',
            colorActive: false,
            currColor: '#FFFFFF',
            weightActive: false,
            hiddenWeightActive: false,
            currWeight: 1,
            currHiddenWeight: 1,
            entries: [
                { name: "Not overridden", value: LinePixels.Invalid },
                { name: "Solid", value: LinePixels.Solid },
                { name: "Hidden Line", value: LinePixels.HiddenLine },
                { name: "Invisible", value: LinePixels.Invisible },
                { name: "Code1", value: LinePixels.Code1 },
                { name: "Code2", value: LinePixels.Code2 },
                { name: "Code3", value: LinePixels.Code3 },
                { name: "Code4", value: LinePixels.Code4 },
                { name: "Code5", value: LinePixels.Code5 },
                { name: "Code6", value: LinePixels.Code6 },
                { name: "Code7", value: LinePixels.Code7 }
            ],
            pattern: LinePixels.Invalid,
            hiddenPattern: LinePixels.Invalid,
            showSkyBox: false,
            showGroundPlane: false,
            radio: '2colors',
            skyColor: '#FFFFFF',
            groundColor: '#FFFFFF',
            zenithColor: '#FFFFFF',
            nadirColor: '#FFFFFF',
            skyTransparency: '0.0',
            groundTransparency: '0.0',
            showOcclusion: false,
            aoBias:'0.0',
            aoZLengthCap:'0.0',
            aoIntensity:'0.0',
            aoTexelStepSize:'0.0',
            aoBlurDelta:'0.0',
            aoBlurSigma:'0.0',
            aoBlurTexelStepSize:'0.0'
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
            //IModelApp.viewManager.selectedView.view = JSON.parse(JSON.stringify(IModelApp.viewManager.selectedView.view));
            this.is3d = IModelApp.viewManager.selectedView.view.is3d();
            this.initStylePicker();
            this.addViewFlagAttribute();
            this.initEdgeDisplay();
            this.initEnvironment();
            this.initOcclusion();
        },
        async initStylePicker(){
            this.styleEntries = [];
            this.displayStyles = new Map();
            // let is3d = IModelApp.viewManager.selectedView.view.is3d();
            let sqlName = this.is3d ? DisplayStyle3dState.classFullName : DisplayStyle2dState.classFullName;
            let displayStyleProps = await IModelApp.viewManager.selectedView.view.iModel.elements.queryProps({ from: sqlName, where: "IsPrivate=FALSE" });
            let promises = [];
            for (const displayStyleProp of displayStyleProps) {
                this.styleEntries.push({ name: displayStyleProp.code.value, value: displayStyleProp.id });
                let displayStyle;
                if (this.is3d){
                    displayStyle = new DisplayStyle3dState(displayStyleProp, IModelApp.viewManager.selectedView.view.iModel);
                }
                else{
                    displayStyle = new DisplayStyle2dState(displayStyleProp, IModelApp.viewManager.selectedView.view.iModel);
                }
                // ###TODO: Is there such a concept as "2d reality models"???
                // promises.push(displayStyle.loadContextRealityModels());
                this.displayStyles.set(displayStyleProp.id, displayStyle);
            }
            this.style = IModelApp.viewManager.selectedView.view.displayStyle.id;
            await Promise.all(promises);
        },
        handleStyleChange(id){
            IModelApp.viewManager.selectedView.displayStyle = this.displayStyles.get(id);
            IModelApp.viewManager.selectedView.invalidateScene();
        },
        addViewFlagAttribute(label, flag){
            const viewflags = IModelApp.viewManager.selectedView.view.viewFlags;
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
            if (this.is3d){
                this.currentShadowColor = IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.solarShadowsSettings.color;
            }
            let that = this;
            IModelApp.viewManager.selectedView.onDisplayStyleChanged.addListener(function(vp){
                that.updateShadowUI(vp.view)
            });
        },
        handleShadowCheckChange($event){
            const vf = IModelApp.viewManager.selectedView.viewFlags.clone(this.scratchViewFlags);
            vf.shadows = $event;
            IModelApp.viewManager.selectedView.viewFlags = vf;
            this.sync();
        },
        updateShadowUI(view){
            if (view.is3d()){
                this.currentShadowColor = view.getDisplayStyle3d().settings.solarShadowsSettings.color;
            }
            // this.currentShadowColor = undefined === this.currentShadowColor ? "#FFFFFF" : this.currentShadowColor.toHexString();
        },
        handleShadowColorChange($event){
            this.currentShadowColor = $event.target.value;
            IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.solarShadowsSettings.color = new ColorDef(this.currentShadowColor);
            this.sync();
        },
        handelViewFlagChange($event,label){
            const vf = IModelApp.viewManager.selectedView.viewFlags.clone(this.scratchViewFlags);
            vf[label] = $event;
            IModelApp.viewManager.selectedView.viewFlags = vf;
            this.sync();
        },
        changeRenderMode(thing){
            IModelApp.viewManager.selectedView.view.viewFlags.renderMode = Number.parseInt(thing, 10);
            this.sync();
        },
        initEdgeDisplay(){
            const hlSettings = this.is3d ? IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.hiddenLineSettings : HiddenLine.Settings.defaults;
            this.currTransparency = hlSettings.transparencyThreshold.toString();
            this.currColor = hlSettings.visible.color ? hlSettings.visible.color.toHexString() : "#FFFFFF";
            this.pattern = hlSettings.visible.pattern ? hlSettings.visible.pattern : LinePixels.Invalid
            this.hiddenPattern = hlSettings.hidden.pattern ? hlSettings.hidden.pattern : LinePixels.Invalid
            this.showVisibleEdges = IModelApp.viewManager.selectedView.viewFlags.clone(this.scratchViewFlags).visibleEdges;
        },
        handleVisibleEdgesCheckChange($event){
            const vf = IModelApp.viewManager.selectedView.viewFlags.clone(this.scratchViewFlags);
            vf.visibleEdges = $event;
            IModelApp.viewManager.selectedView.viewFlags = vf;
            this.sync();
        },
        handleHiddenEdgesCheckChange($event){
            const vf = IModelApp.viewManager.selectedView.viewFlags.clone(this.scratchViewFlags);
            vf.hiddenEdges = $event;
            IModelApp.viewManager.selectedView.viewFlags = vf;
            this.sync();
        },
        handleTransparencyCheckChange($event){
            this.updateEdgeDisplayItem();
        },
        handleTransparencyChange($event){
            this.updateEdgeDisplayItem();
        },
        handleColorCheckChange($event){
            this.updateEdgeDisplayItem();
        },
        handleColorChange($event){
            this.updateEdgeDisplayItem();
        },
        handleWeightCheckChange($event){
            this.updateEdgeDisplayItem();
        },
        handleHiddenWeightCheckChange($event){
            const oldHLSettings = IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.hiddenLineSettings;
            const oldHLEdgeSettings = oldHLSettings.visible;
            const oldHLEdgeSettingsHidden = oldHLSettings.hidden;
            this.updateEdgeDisplay(
                parseFloat(this.currTransparency),
                this.colorActive ? new ColorDef(this.currColor) : (oldHLEdgeSettings.ovrColor ? oldHLEdgeSettings.color : undefined),
                parseInt(this.pattern, 10),
                parseInt(this.hiddenPattern, 10),
                this.weightActive ? parseInt(this.currWeight) : oldHLEdgeSettings.width,
                this.hiddenWeightActive ? parseInt(this.currHiddenWeight) : oldHLEdgeSettingsHidden.width,
                true);
        },
        handleWeightChange($event){
            this.updateEdgeDisplayItem();
        },
        handleHiddenWeightChange($event){
            const oldHLSettings = IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.hiddenLineSettings;
            const oldHLEdgeSettings = oldHLSettings.visible;
            const oldHLEdgeSettingsHidden = oldHLSettings.hidden;
            this.updateEdgeDisplay(
                parseFloat(this.currTransparency),
                this.colorActive ? new ColorDef(this.currColor) : (oldHLEdgeSettings.ovrColor ? oldHLEdgeSettings.color : undefined),
                parseInt(this.pattern, 10),
                parseInt(this.hiddenPattern, 10),
                this.weightActive ? parseInt(this.currWeight) : oldHLEdgeSettings.width,
                this.hiddenWeightActive ? parseInt(this.currHiddenWeight) : oldHLEdgeSettingsHidden.width,
                true);
        },
        handleVisibleStyleChange($event){
            this.updateEdgeDisplayItem();
        },
        handleHiddenStyleChange($event){
            const oldHLSettings = IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.hiddenLineSettings;
            const oldHLEdgeSettings = oldHLSettings.visible;
            const oldHLEdgeSettingsHidden = oldHLSettings.hidden;
            this.updateEdgeDisplay(
                parseFloat(this.currTransparency),
                this.colorActive ? new ColorDef(this.currColor) : (oldHLEdgeSettings.ovrColor ? oldHLEdgeSettings.color : undefined),
                parseInt(this.pattern, 10),
                parseInt(this.hiddenPattern, 10),
                this.weightActive ? parseInt(this.currWeight) : oldHLEdgeSettings.width,
                this.hiddenWeightActive ? parseInt(this.currHiddenWeight) : oldHLEdgeSettingsHidden.width,
                true);
        },
        updateEdgeDisplayItem(){
            const oldHLSettings = IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.hiddenLineSettings;
            const oldHLEdgeSettings = oldHLSettings.visible;
            const oldHLEdgeSettingsHidden = oldHLSettings.hidden;
            this.updateEdgeDisplay(
                parseFloat(this.currTransparency),
                this.colorActive ? new ColorDef(this.currColor) : (oldHLEdgeSettings.ovrColor ? oldHLEdgeSettings.color : undefined),
                parseInt(this.pattern, 10),
                parseInt(this.hiddenPattern, 10),
                this.weightActive ? parseInt(this.currWeight) : oldHLEdgeSettings.width,
                this.hiddenWeightActive ? parseInt(this.currHiddenWeight) : oldHLEdgeSettingsHidden.width,
                false);
        },
        updateEdgeDisplay(transThresh,color,pattern,hiddenPattern,width,hiddenWidth,hiddenEdge){
            const oldHLSettings = IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.hiddenLineSettings;
            const newHLSettings = HiddenLine.Settings.fromJSON({
                visible: hiddenEdge ? oldHLSettings.visible : HiddenLine.Style.fromJSON({
                    ovrColor: color ? true : false,
                    color,
                    pattern,
                    width
                }),
                hidden: !hiddenEdge ? HiddenLine.Style.fromJSON({
                    ovrColor: oldHLSettings.hidden.ovrColor,
                    color: oldHLSettings.hidden.color,
                    pattern: oldHLSettings.hidden.pattern,
                    width: (oldHLSettings.hidden.width === undefined || (width !== undefined && oldHLSettings.hidden.width <= width) ? oldHLSettings.hidden.width : width), // verify hidden width <= visible width
                }) : HiddenLine.Style.fromJSON({
                    ovrColor: color ? true : false,
                    color,
                    pattern: hiddenPattern,
                    width: (hiddenWidth === undefined || (oldHLSettings.visible.width !== undefined && hiddenWidth <= oldHLSettings.visible.width) ? hiddenWidth : oldHLSettings.visible.width), // verify hidden width <= visible width
                }, true),
                transThreshold: transThresh
            });
            IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.hiddenLineSettings = newHLSettings;
            this.sync();
        },
        initEnvironment(){
            let currentEnvironment;
            if (this.is3d) {
                const view3d = IModelApp.viewManager.selectedView.view;
                const style = view3d.getDisplayStyle3d();
                const env = style.environment.sky;
                this.showSkyBox = env.display;
                if (env instanceof SkyGradient){
                    currentEnvironment = env;
                }
            }
            this.radio = (undefined !== currentEnvironment && currentEnvironment.twoColor) ? "2colors" : "4colors";
            this.skyColor = undefined === currentEnvironment ? "#FFFFFF" : currentEnvironment.skyColor.toHexString();
            this.groundColor = undefined === currentEnvironment ? "#FFFFFF" : currentEnvironment.groundColor.toHexString();
            this.zenithColor = undefined === currentEnvironment ? "#FFFFFF" : currentEnvironment.zenithColor.toHexString();
            this.nadirColor = undefined === currentEnvironment ? "#FFFFFF" : currentEnvironment.nadirColor.toHexString();
            this.skyTransparency = undefined === currentEnvironment ? "#FFFFFF" : currentEnvironment.skyExponent.toString();
            this.groundTransparency = undefined === currentEnvironment ? "#FFFFFF" : currentEnvironment.groundExponent.toString();
        },
        handleShowSkyBoxCheckChange($event){
            const view3d = IModelApp.viewManager.selectedView.view;
            const style = view3d.getDisplayStyle3d();
            const env = style.environment;
            env['sky'].display = $event;
            view3d.getDisplayStyle3d().environment = env; // setter converts it to JSON
            this.sync();
        },
        handelRadioChange(value){
            this.updateEnvironment({ twoColor: value === "2colors" });
        },
        handleSkyColorChange(e){
            this.updateEnvironment({ skyColor: new ColorDef(e.target.value) });
        },
        handleGroundColorChange(e){
            this.updateEnvironment({ groundColor: new ColorDef(e.target.value) })
        },
        handleZenithColorChange(e){
            this.updateEnvironment({ zenithColor: new ColorDef(e.target.value) })
        },
        handleNadirColorChange(e){
            this.updateEnvironment({ nadirColor: new ColorDef(e.target.value) })
        },
        handleSkyExponentChange(e){
            this.updateEnvironment({ skyExponent: parseFloat(e.target.value) });
        },
        handleGroundExponentChange(e){
            this.updateEnvironment({ groundExponent: parseFloat(e.target.value) });
        },
        handleShowGroundPlaneChange($event){
            const view3d = IModelApp.viewManager.selectedView.view;
            const style = view3d.getDisplayStyle3d();
            const env = style.environment;
            env['ground'].display = $event;
            view3d.getDisplayStyle3d().environment = env; // setter converts it to JSON
            this.sync();
        },
        updateEnvironment(newEnv){
            const oldEnv = IModelApp.viewManager.selectedView.view.getDisplayStyle3d().environment;
            const oldSkyEnv = oldEnv.sky;
            newEnv = {
              display: oldSkyEnv.display,
              twoColor: undefined !== newEnv.twoColor ? newEnv.twoColor : oldSkyEnv.twoColor,
              zenithColor: undefined !== newEnv.zenithColor ? new ColorDef(newEnv.zenithColor) : oldSkyEnv.zenithColor,
              skyColor: undefined !== newEnv.skyColor ? new ColorDef(newEnv.skyColor) : oldSkyEnv.skyColor,
              groundColor: undefined !== newEnv.groundColor ? new ColorDef(newEnv.groundColor) : oldSkyEnv.groundColor,
              nadirColor: undefined !== newEnv.nadirColor ? new ColorDef(newEnv.nadirColor) : oldSkyEnv.nadirColor,
              skyExponent: undefined !== newEnv.skyExponent ? newEnv.skyExponent : oldSkyEnv.skyExponent,
              groundExponent: undefined !== newEnv.groundExponent ? newEnv.groundExponent : oldSkyEnv.groundExponent,
            };
            IModelApp.viewManager.selectedView.view.getDisplayStyle3d().environment = new Environment(
                {
                    sky: new SkyGradient(newEnv),
                    ground: oldEnv.ground
                });
            this.sync();
        },
        initOcclusion(){

        },
        handleOcclusionCheckChange($event){
            const vf = IModelApp.viewManager.selectedView.viewFlags.clone(this.scratchViewFlags);
            vf.ambientOcclusion = $event;
            IModelApp.viewManager.selectedView.viewFlags = vf;
            this.sync();
        },
        handelBiasChange($event){
            let value = $event.target.value;
            this.updateAmbientOcclusion(parseFloat(value));
        },
        handelZLengthCapChange($event){
            let value = $event.target.value;
            this.updateAmbientOcclusion(undefined, parseFloat(value));
        },
        handelIntensityChange($event){
            let value = $event.target.value;
            this.updateAmbientOcclusion(undefined, undefined, parseFloat(value));
        },
        handelTexelStepSizeChange($event){
            let value = $event.target.value;
            this.updateAmbientOcclusion(undefined, undefined, undefined, parseFloat(value));
        },
        handelBlurDeltaChange($event){
            let value = $event.target.value;
            this.updateAmbientOcclusion(undefined, undefined, undefined, undefined, parseFloat(value));
        },
        handelBlurSigmaChange($event){
            let value = $event.target.value;
            this.updateAmbientOcclusion(undefined, undefined, undefined, undefined, undefined, parseFloat(value));
        },
        handelBlurTexelStepSizeChange($event){
            let value = $event.target.value;
            this.updateAmbientOcclusion(undefined, undefined, undefined, undefined, undefined, undefined, parseFloat(value));
        },
        updateAmbientOcclusion(newBias, newZLengthCap, newIntensity, newTexelStepSize, newBlurDelta, newBlurSigma, newBlurTexelStepSize){
            const oldAOSettings = IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.ambientOcclusionSettings;
            const newAOSettings = AmbientOcclusion.Settings.fromJSON({
                bias: newBias !== undefined ? newBias : oldAOSettings.bias,
                zLengthCap: newZLengthCap !== undefined ? newZLengthCap : oldAOSettings.zLengthCap,
                intensity: newIntensity !== undefined ? newIntensity : oldAOSettings.intensity,
                texelStepSize: newTexelStepSize !== undefined ? newTexelStepSize : oldAOSettings.texelStepSize,
                blurDelta: newBlurDelta !== undefined ? newBlurDelta : oldAOSettings.blurDelta,
                blurSigma: newBlurSigma !== undefined ? newBlurSigma : oldAOSettings.blurSigma,
                blurTexelStepSize: newBlurTexelStepSize !== undefined ? newBlurTexelStepSize : oldAOSettings.blurTexelStepSize,
            });
            IModelApp.viewManager.selectedView.view.getDisplayStyle3d().settings.ambientOcclusionSettings = newAOSettings;
            this.sync();
        },
        sync() {
            IModelApp.viewManager.selectedView.synchWithView(true);
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
            top: 38px;
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
            .el-radio-group {
                display: block;
                margin-left: 15px;
            }
            .color-group {
                margin-top: 5px;
            }
            .color-label {
                display: inline-block;
                width: 75px;
                text-align: right;
            }
            .transparency-label {
                display: inline-block;
                width: 96px;
                text-align: right;
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
            .occlusion {
                margin-left: 10px;
            }
            .occlusion-label {
                display: inline-block;
                margin-left: 20px;
                width: 70px;
                text-align: right;
                font-size: 13px;
                color: #666;
                &:hover {
                    color: #666;
                }
            }
            .occlusion-range {
                position: relative;
                top: 7px;
            }
            .range {
                position: relative;
                top: 7px;
            }
        }
    }
</style>