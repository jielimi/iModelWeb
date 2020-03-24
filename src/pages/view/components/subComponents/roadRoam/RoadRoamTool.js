import { roadRoamMakerDecorator } from "./roadRoamMaker"
import { BezierCurve3d, Path } from "@bentley/geometry-core";
import { EventHandled, GraphicType, IModelApp, PrimitiveTool } from "@bentley/imodeljs-frontend";
import { LinePixels } from "@bentley/imodeljs-common";

class RoadRoamTool extends PrimitiveTool {
    constructor() {
        super(...arguments);
    }
    requireWriteableTarget() { return false; }
    onPostInstall() { super.onPostInstall(); this.setupAndPromptForNextAction(); }
    setupAndPromptForNextAction() {
        IModelApp.accuSnap.enableSnap(true);

        if (0 === RoadRoamTool._points.length)
            return;
    }
    decorate(context) {
        if (undefined === this.viewport ||
            !this.viewport.view.is3d() ||
            this.viewport.view.iModel !== context.viewport.view.iModel) {
            return;
        }
        const builder = context.createGraphicBuilder(GraphicType.WorldOverlay);
        const color = context.viewport.getContrastToBackgroundColor();
        builder.setSymbology(color, color, 2, LinePixels.Code2);
        const bezierPoints = this.getBezierPoints();
        RoadRoamTool.bezierPoints = bezierPoints;
        const length = bezierPoints.length;
        const bezierLines = [];
        RoadRoamTool.targetPoints = []
        // 只有两个点，直线
        if (length === 2) {
            bezierLines.push(BezierCurve3d.create(bezierPoints));
        }
        else if (length > 2) {
            // 现在这个数组，偶数位都是端点，奇数位都是控制点
            for (let i = 0; i < length; i++) {
                if (i % 2 === 0 && i < length - 1) {
                    let curve = BezierCurve3d.create([
                        bezierPoints[i],
                        bezierPoints[i + 1],
                        bezierPoints[i + 2]
                    ])
                    bezierLines.push(curve);
                    let len = length *2 -1;
                    for(let item = i;item <=i+2;item++){
                        let param = {
                            origin:bezierPoints[item],
                            direction:curve.fractionToPointAndDerivative(item/len).direction,
                            test:curve.fractionToPointAndDerivative(item/len).origin
                        
                        }
                        RoadRoamTool.targetPoints.push(param)
                    }
                }
            }
        }
        
        builder.addPath(Path.createArray(bezierLines));
        builder.setSymbology(color, color, 8);
        builder.addPointString(RoadRoamTool._points);
        context.addDecorationFromBuilder(builder);
    }

    onDynamicFrame(ev, context) {
        // const tmpPoints = points.slice(); // Create shallow copy of accepted points
        // tmpPoints.push(ev.point.clone());
        // const builder = context.createSceneGraphicBuilder();
        // builder.setSymbology(ColorDef.from(65,105,225), ColorDef.red, 8, LinePixels.Code2);
        // builder.addLineString(tmpPoints);
        // context.addGraphic(builder.finish());
    }

    getBezierPoints() {
        const _points = RoadRoamTool._points;
        const length = _points.length;
        if (length <= 2) {
            return _points;
        }
        const points = [];
        for (let i = 0; i < length - 2; i++) {
            const [controlPoint1, controlPoint2] = this.getControlPoints(_points[i], _points[i + 1], _points[i + 2]);
            points.push(_points[i], controlPoint1);
        }
        // 剩最后两个点没加进去
        const [c1, c2] = this.getControlPoints(_points[length - 3], _points[length - 2], _points[length - 1]);
        return [...points, _points[length - 2], c2, _points[length - 1]];
    }
    getControlPoints(p0, p1, p2) {
        // 0和1的中点
        const mid01 = p0.interpolate(0.5, p1);
        // 1和2的中点
        const mid12 = p1.interpolate(0.5, p2);
        // 中点的中点
        const mid = mid01.interpolate(0.5, mid12);
        // 三个中点的连线平移到 p1
        const dx = p1.x - mid.x;
        const dy = p1.y - mid.y;
        const dz = p1.z - mid.z;
        const controlPoint1 = mid01.plusXYZ(dx, dy, dz);
        const controlPoint2 = mid12.plusXYZ(dx, dy, dz);
        return [controlPoint1, controlPoint2];
    }

    async onDataButtonDown(ev) {
        if (undefined === ev.viewport) {
            return EventHandled.Yes;
          } else if (undefined === this.viewport) {
            this.viewport = ev.viewport;
          } else if (this.viewport.view.iModel !== ev.viewport.view.iModel) {
            this.viewport = ev.viewport;
          }

        RoadRoamTool._points.push(ev.point.clone());
        IModelApp.viewManager.invalidateDecorationsAllViews();

        this.setupAndPromptForNextAction();

        if (!this.isDynamicsStarted)
            this.beginDynamics();
            
        roadRoamMakerDecorator.createMaker(ev._point.clone());
        return EventHandled.Yes;
    }

    static copyPath() {
        return RoadRoamTool.targetPoints.slice();
        //return RoadRoamTool._points.slice();
    }
    static clearPath(){
        RoadRoamTool._points = [];
        RoadRoamTool.bezierPoints = [];
        RoadRoamTool.targetPoints = [];
        roadRoamMakerDecorator.clear();
    }
    onRestartTool() {
        const tool = new DrawingAidTestTool();
        if (!tool.run())
            this.exitTool();
    }
}
RoadRoamTool.toolId = "iModelWeb.roadRoam";
RoadRoamTool.bezierPoints = [];
RoadRoamTool._points = [];
export {RoadRoamTool}