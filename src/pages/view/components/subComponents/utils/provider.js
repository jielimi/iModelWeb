import { FeatureSymbology  } from "@bentley/imodeljs-frontend";
let provider = {
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
    },
    toJSON() {
        if (0 === this.elementOvrs.size)
          return undefined;
        const elementOvrs = [];
        this.elementOvrs.forEach((value, key) => {
          const elem = { id: key, fsa: JSON.stringify(value.toJSON()) };
          elementOvrs.push(elem);
        });
        // Put the default override into the array as well, at the end with a special ID that we can find later.
        if (undefined !== this.defaultOvrs) {
          const elem = { id: "-default-", fsa: JSON.stringify(this.defaultOvrs.toJSON()) };
          elementOvrs.push(elem);
        }
        return elementOvrs;
      },
      sync(vp){ vp.setFeatureOverrideProviderChanged(); },
      clear(vp){
        this.elementOvrs.clear();
        this.defaultOvrs = undefined;
        this.sync(vp);
      },
      overrideElementsByArray(vp,elementOvrs) {
        elementOvrs.forEach((eo) => {
          const fsa = FeatureSymbology.Appearance.fromJSON(JSON.parse(eo.fsa));
          if (eo.id === "-default-")
            this.defaults = fsa;
          else
            this.elementOvrs.set(eo.id, fsa);
        });
    
        this.sync(vp);
      }
};

export {provider}
