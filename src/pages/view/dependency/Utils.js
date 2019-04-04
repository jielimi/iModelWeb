import {
    IModelApp,
    SnapMode
} from "@bentley/imodeljs-frontend";
// const tooltip_js_1 = require("tooltip.js");
import * as tooltip_js_1 from 'tooltip'
//import tooltip_js_1 from 'tootip.js/dist/tooltip'
import { AccuSnap } from "./AccuSnap";
import { NotificationManager } from "./NotificationManager";
import { DrawingAidTestTool } from "./DrawingAidTestTool";
// import * as imodeljs_frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"

class DisplayTestAppAccuSnap extends AccuSnap {
constructor() {
    super(...arguments);
    this._activeSnaps =  [SnapMode.NearestKeypoint];
}
keypointDivisor() { return 2; }
getActiveSnapModes() { return this._activeSnaps; }
setActiveSnapModes(snaps) {
    this._activeSnaps.length = snaps.length;
    for (let i = 0; i < snaps.length; i++)
    this._activeSnaps[i] = snaps[i];
}
}

class Notifications extends NotificationManager {
    get isToolTipSupported() { return true; }
    get isToolTipOpen() { return undefined !== this._toolTip; }
    clearToolTip() {
        if (!this.isToolTipOpen)
            return;
        this._toolTip.dispose();
        this._el.removeChild(this._tooltipDiv);
        this._toolTip = undefined;
        this._el = undefined;
        this._tooltipDiv = undefined;
    }
    _showToolTip(el, message, pt, options) {
        String.prototype.replaceAll  = function(s1,s2){   
            return this.replace(new RegExp(s1,"gm"),s2);   
        }
        message = message.replaceAll("<b>","");
        message = message.replaceAll("</b>","");
        message = message.replaceAll("<br>","<br><br>");
        message = message.replaceAll(",","<br><br>");
        message = message.replaceAll("Element.","");
        this.clearToolTip();
        const rect = el.getBoundingClientRect();
        if (undefined === pt)
            pt = { x: rect.width / 2, y: rect.height / 2 };
        const location = document.createElement("div");
        location.style.position = "absolute";
        location.style.top = 10 + "px";
        location.style.right = 0;
        
        el.appendChild(location);
        this._el = el;
        this._tooltipDiv = location;
        this._toolTip = new tooltip_js_1.default(location, { trigger: "manual", html: true, placement: (options && options.placement) ? options.placement : "right-start", title: message });
        this._toolTip.show();
    }
}
 

export class SVTIModelApp extends IModelApp {
    static onStartup() {
    IModelApp.accuSnap = new DisplayTestAppAccuSnap();
    IModelApp.notifications = new Notifications();
    console.log("onstartup")
    const svtToolNamespace = IModelApp.i18n.registerNamespace("SVTTools");
    DrawingAidTestTool.register(svtToolNamespace);
}

static setActiveSnapModes(snaps) {
    IModelApp.accuSnap.setActiveSnapModes(snaps);
}

static setActiveSnapMode(snap) { this.setActiveSnapModes([snap]); }

}

