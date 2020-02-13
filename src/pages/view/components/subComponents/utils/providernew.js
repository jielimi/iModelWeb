export class Provider {
    constructor(vp) {
        this._elementOvrs = new Map();
        this._vp = vp;
    }
    addFeatureOverrides(ovrs, _vp) {
        this._elementOvrs.forEach((value, key) => ovrs.overrideElement(key, value));
        if (undefined !== this._defaultOvrs)
            ovrs.setDefaultOverrides(this._defaultOvrs);
    }
    overrideElements(app) {
        for (const id of this._vp.iModel.selectionSet.elements)
            this._elementOvrs.set(id, app);
        this.sync();
    }
    overrideElementsByArray(elementOvrs) {
        elementOvrs.forEach((eo) => {
            const fsa = FeatureSymbology.Appearance.fromJSON(JSON.parse(eo.fsa));
            if (eo.id === "-default-")
                this.defaults = fsa;
            else
                this._elementOvrs.set(eo.id, fsa);
        });
        this.sync();
    }
    toJSON() {
        if (0 === this._elementOvrs.size)
            return undefined;
        const elementOvrs = [];
        this._elementOvrs.forEach((value, key) => {
            const elem = { id: key, fsa: JSON.stringify(value.toJSON()) };
            elementOvrs.push(elem);
        });
        // Put the default override into the array as well, at the end with a special ID that we can find later.
        if (undefined !== this._defaultOvrs) {
            const elem = { id: "-default-", fsa: JSON.stringify(this._defaultOvrs.toJSON()) };
            elementOvrs.push(elem);
        }
        return elementOvrs;
    }
    clear() {
        this._elementOvrs.clear();
        this._defaultOvrs = undefined;
        this.sync();
    }
    set defaults(value) {
        this._defaultOvrs = value;
        this.sync();
    }
    sync() { this._vp.setFeatureOverrideProviderChanged(); }
    static get(vp) {
        return vp.featureOverrideProvider instanceof Provider ? vp.featureOverrideProvider : undefined;
    }
    static remove(vp) {
        if (undefined !== this.get(vp))
            vp.featureOverrideProvider = undefined;
    }
    static getOrCreate(vp) {
        let provider = this.get(vp);
        if (undefined === provider) {
            provider = new Provider(vp);
            vp.featureOverrideProvider = provider;
        }
        return provider;
       
    }
}