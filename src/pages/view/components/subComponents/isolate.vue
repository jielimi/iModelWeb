<template>
    <div>
        <i class="iconfont icon-color isolote" @click.self="pop">
        	<div v-show="isolating" class="detail">
        		<el-checkbox v-model="colorActive" @change="handleColorCheckChange">
        			<span>Color</span>
        			<input type="color" :disabled="!colorActive" value="#ffffff" @change="handleColorChange">
        		</el-checkbox>
        		<el-checkbox v-model="transparencyActive" @change="handleTransparencyCheckChange">
        			<span>Transparency</span>
        			<input type="range" :disabled="!transparencyActive" class="range" min="0.0" max="1.0" step="0.05" value="0.0" @change="handleTransparencyChange">
        		</el-checkbox>
        		<el-checkbox v-model="ignoreMaterial" @change="handleIgnoreMaterialChange">
        			<span>Ignore Material</span>
        		</el-checkbox>
                <hr />
                <el-button-group>
					<el-button size="mini" @click="apply">Apply</el-button>
					<el-button size="mini" @click="setDefault">Default</el-button>
					<el-button size="mini" @click="clear">Clear</el-button>
				</el-button-group>
        	</div>
        </i>
    </div>
</template>

<script>
import { dispose, Id64String, IDisposable } from "@bentley/bentleyjs-core";
import { ColorByName, ColorDef, RgbColor } from "@bentley/imodeljs-common";
import { IModelApp, EmphasizeElements,FeatureOverrideProvider, FeatureSymbology  } from "@bentley/imodeljs-frontend";
const provider = {
	elementOvrs: new Map(),
	appearance: FeatureSymbology.Appearance.defaults,
	defaultOvrs: undefined,
    addFeatureOverrides(ovrs, _vp) {
    	this.elementOvrs.forEach(function(value, key){
    		ovrs.overrideElement(key, value);
    	});
    	if (undefined !== this.defaultOvrs){
    		ovrs.setDefaultOverrides(this.defaultOvrs);
    	}
    }
};
export default {
    name: 'isolate',
    data () {
        return {
        	colorActive: false,
        	currColor: undefined,
        	transparencyActive: false,
        	currTransparency: 0,
        	isolating: false,
        	ignoreMaterial: false
        };
    },
    components: {},
    created () {},
    methods: {
    	pop(){
    		this.isolating = !this.isolating;
    	},
    	handleColorCheckChange(){
    		if(this.colorActive){
				this.updateAppearance('rgb',this.convertHexToRgb(this.currColor));
        	}else{
        		this.updateAppearance('rgb',undefined);
        	}
    	},
        handleColorChange(e){
        	this.currColor = e.target.value;
        	this.updateAppearance('rgb',this.convertHexToRgb(e.target.value));
        },
        handleTransparencyCheckChange(){
        	if(this.transparencyActive){
        		this.updateAppearance('transparency',parseFloat(this.currTransparency));
        	}else{
        		this.updateAppearance('transparency',undefined);
        	}
        },
        handleTransparencyChange(e){
        	this.currColor = e.target.value;
        	this.updateAppearance('transparency',parseFloat(e.target.value));
        },
        handleIgnoreMaterialChange(){
        	this.updateAppearance('ignoresMaterial',this.ignoreMaterial);
        },
        updateAppearance(field,value){
        	let props = provider.appearance.toJSON();
      		props[field] = value;
      		provider.appearance = FeatureSymbology.Appearance.fromJSON(props);
        },
        apply(){
			for(const id of this.GLOBAL_DATA.theViewPort.iModel.selectionSet.elements){
				provider.elementOvrs.set(id, provider.appearance);
			}
			this.GLOBAL_DATA.theViewPort.featureOverrideProvider = provider;
			this.sync();
        },
        setDefault(){
        	let pro = this.GLOBAL_DATA.theViewPort.featureOverrideProvider;
        	provider.defaultOvrs = provider.appearance;
        	this.GLOBAL_DATA.theViewPort.featureOverrideProvider = provider;
        	this.sync();
        },
        clear(){
			provider.elementOvrs.clear();
			provider.defaultOvrs = undefined;
			this.GLOBAL_DATA.theViewPort.featureOverrideProvider = provider;
			this.sync();
        },
        sync(){
        	this.GLOBAL_DATA.theViewPort.setFeatureOverrideProviderChanged();
        },
        convertHexToRgb(hex) {
		  // Parse a hex color string formatted as "#FFFFFF"
		  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		  return result ? new RgbColor(
		    parseInt(result[1], 16),
		    parseInt(result[2], 16),
		    parseInt(result[3], 16),
		  ) : undefined;
		}

    }  
}
</script>
<style lang="less" scoped>
	.isolote {
        position: relative;
        .detail {
            position: absolute;
            right: 0;
            top: 45px;
            z-index: 999;
            width: 300px;
            max-height: 350px;
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
        }
        .el-checkbox {
        	display: inline-block;
        }
        .range {
        	position: relative;
    		top: 7px;
        }
        hr {
        	width: 95%;
        	margin: 15px auto 0;;
        	color: #ccc;
        }
        .el-button-group {
        	margin-left: 54px;
        }
        button:focus {
            background-color: #fff;
            color: #606266;
            border: 1px solid #dcdfe6;
        }
    }
</style>