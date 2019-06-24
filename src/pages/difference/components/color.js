// import { dispose, Id64String, IDisposable } from "@bentley/bentleyjs-core";
import { ColorByName, ColorDef, LinePixels, RgbColor } from "@bentley/imodeljs-common";
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
}

function convertHexToRgb(hex) {
    // Parse a hex color string formatted as "#FFFFFF"
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new RgbColor(
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ) : undefined;
}

function updateAppearance(field,value){
    let props = provider.appearance.toJSON();
      props[field] = value;
      provider.appearance = FeatureSymbology.Appearance.fromJSON(props);
}


function apply(viewPort){
    for(const id of viewPort.iModel.selectionSet.elements){
        provider.elementOvrs.set(id, provider.appearance);
    }
    viewPort.featureOverrideProvider = provider;
    viewPort.setFeatureOverrideProviderChanged()
}

function handleColorChange(colorHex,viewPort){
    updateAppearance('rgb',convertHexToRgb(colorHex));
    apply(viewPort);
}

function clear(viewPort){
    provider.elementOvrs.clear();
    provider.defaultOvrs = undefined;
    viewPort.featureOverrideProvider = provider;
    viewPort.setFeatureOverrideProviderChanged()
}

module.exports={
    handleColorChange,
    clear
}


