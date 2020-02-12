/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { compareStrings, SortedArray, } from "@bentley/bentleyjs-core";
export class NamedViewStatePropsString {
    constructor(name, viewState, selectedElements, overrideElements) {
        this._name = name;
        this._viewStatePropsString = viewState;
        this._selectedElements = selectedElements;
        this._overrideElements = overrideElements;
    }
    get name() { return this._name; }
    get viewStatePropsString() { return this._viewStatePropsString; }
    get selectedElements() { return this._selectedElements; }
    get overrideElements() { return this._overrideElements; }
}
export class NamedVSPSList extends SortedArray {
    constructor() {
        super((lhs, rhs) => compareStrings(lhs.name, rhs.name));
    }
    static create(viewNames) {
        const viewList = new NamedVSPSList();
        viewList.populate(viewNames);
        return viewList;
    }
    clear() {
        super.clear();
    }
    populate(viewStateStrings) {
        this.clear();
        if (undefined === viewStateStrings)
            return;
        if (0 === viewStateStrings.length)
            return;
        for (const vss of viewStateStrings)
            this.insert(vss);
    }
    findName(name) {
        for (let i = 0; i < this.length; ++i) {
            const nvsp = this.get(i);
            if (nvsp.name === name) {
                return i;
            }
        }
        return -1;
    }
    removeName(name) {
        const ndx = this.findName(name);
        if (ndx >= 0) {
            const nvsp = this.get(ndx);
            if (undefined !== nvsp) {
                this.remove(nvsp);
                return;
            }
        }
    }
    getPrintString() {
        // We don't really want all of the other stuff from the SortedArray class in here, just the actual name/propertyString pairs.
        return JSON.stringify(this._array, null, "  ");
    }
    loadFromString(esvString) {
        this.clear();
        if (undefined !== esvString && "" !== esvString) {
            const namedVSPs = JSON.parse(esvString);
            for (const obj of namedVSPs) {
                const esvProps = new NamedViewStatePropsString(obj._name, obj._viewStatePropsString, obj._selectedElements, obj._overrideElements);
                this.insert(esvProps);
            }
        }
    }
}
