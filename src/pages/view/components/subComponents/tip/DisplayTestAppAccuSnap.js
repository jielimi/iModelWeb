import { SnapMode, AccuSnap, BeButton} from "@bentley/imodeljs-frontend";
import { BeEvent } from "@bentley/bentleyjs-core"

export class DisplayTestAppAccuSnap extends AccuSnap {
    constructor() {
        super(...arguments);
        this._activeSnaps = [SnapMode.NearestKeypoint];
        this.onChanged = new BeEvent();
    }
    get keypointDivisor() { return 2; }
    getActiveSnapModes() { return this._activeSnaps; }
    setActiveSnapModes(snaps) {
        this._activeSnaps.length = snaps.length;
        for (let i = 0; i < snaps.length; i++)
            this._activeSnaps[i] = snaps[i];
    }
    onPreButtonEvent(evt) {
        if (evt.button === BeButton.Data && evt.isDown) {
            if (this.currHit && this.currHit.isElementHit) {
                this.onChanged.raiseEvent(this.currHit.sourceId)
            }
        }
    }
}
