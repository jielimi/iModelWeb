import {Vector3d} from "@bentley/geometry-core";
import {AccuDrawHintBuilder, EventHandled, GraphicType,IModelApp,PrimitiveTool,SnapStatus } from "@bentley/imodeljs-frontend";
import {ColorDef, LinePixels} from "@bentley/imodeljs-common";
let points = [];

class RoadRoamTool extends PrimitiveTool {
    constructor() {
        super(...arguments);
        this._snapGeomId = undefined;
    }
    requireWriteableTarget() { return false; }
    onPostInstall() { super.onPostInstall(); this.setupAndPromptForNextAction(); }
    setupAndPromptForNextAction() {
        IModelApp.accuSnap.enableSnap(true);

        if (0 === points.length)
            return;

        const hints = new AccuDrawHintBuilder();
        hints.enableSmartRotation = true;

        if (points.length > 1 && !(points[points.length - 1].isAlmostEqual(points[points.length - 2])))
            hints.setXAxis(Vector3d.createStartEnd(points[points.length - 2], points[points.length - 1])); // Rotate AccuDraw to last segment...

        hints.setOrigin(points[points.length - 1]);
        hints.sendHints();
    }

    testDecorationHit(id) { return id === this._snapGeomId; }

    decorate(context) {
        if (undefined === this._snapGeomId)
            this._snapGeomId = this.iModel.transientIds.next;

        const builder = context.createGraphicBuilder(GraphicType.WorldDecoration, undefined, this._snapGeomId);

        builder.setSymbology(ColorDef.red, ColorDef.red, 10, LinePixels.Solid);
        builder.addLineString(points);
        context.addDecorationFromBuilder(builder);
    }

    onDynamicFrame(ev, context) { // last line

        const tmpPoints = points.slice(); // Create shallow copy of accepted points
        tmpPoints.push(ev.point.clone()); // Include current cursor location

        const builder = context.createSceneGraphicBuilder();

        builder.setSymbology(ColorDef.red, ColorDef.red, 10, LinePixels.Solid);
        builder.addLineString(tmpPoints); // Only draw current segment in dynamics, accepted segments are drawn as pickable decorations...
        context.addGraphic(builder.finish());
    }

    async onDataButtonDown(ev) {
        points.push(ev.point.clone());
        this.setupAndPromptForNextAction();

        if (!this.isDynamicsStarted)
            this.beginDynamics();

        return EventHandled.No;
    }

    static copyPath() {
        return points.slice();
    }
    static clearPath(){
        points = [];
    }

    async onResetButtonUp(_ev) {
        if (undefined !== IModelApp.accuSnap.currHit) {
            const status = await IModelApp.accuSnap.resetButton(); // TESTING ONLY - NOT NORMAL TOOL OPERATION - Exercise AccuSnap hit cycling...only restart when no current hit or not hot snap on next hit...
            if (SnapStatus.Success === status)
                return EventHandled.No;
        }
        this.onReinitialize();
        return EventHandled.No;
    }
    onRestartTool() {
        const tool = new DrawingAidTestTool();
        if (!tool.run())
            this.exitTool();
    }
}

export {RoadRoamTool}