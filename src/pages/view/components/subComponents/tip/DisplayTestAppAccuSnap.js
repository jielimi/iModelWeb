import { SnapMode, AccuSnap} from "@bentley/imodeljs-frontend";

export class DisplayTestAppAccuSnap extends AccuSnap {
    constructor() {
        super(...arguments);
        this._activeSnaps = [SnapMode.NearestKeypoint];
    }
    get keypointDivisor() { return 2; }
    getActiveSnapModes() { return this._activeSnaps; }
    setActiveSnapModes(snaps) {
        this._activeSnaps.length = snaps.length;
        for (let i = 0; i < snaps.length; i++)
            this._activeSnaps[i] = snaps[i];
    }
}
