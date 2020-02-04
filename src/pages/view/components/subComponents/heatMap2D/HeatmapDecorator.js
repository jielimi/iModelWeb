/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { GraphicBranch, IModelApp, GraphicType } from "@bentley/imodeljs-frontend";
import { Geometry, Point3d, Range3d, Transform,StrokeOptions,PolyfaceBuilder,Point2d } from "@bentley/geometry-core";
import { ColorDef, Gradient, ImageBuffer, ImageBufferFormat, RenderTexture, RenderMaterial, TextureMapping, GraphicParams } from "@bentley/imodeljs-common";
import { dispose } from "@bentley/bentleyjs-core";
/** This file contains the code that implements the heatmap decorator including
 * logic which generates the graphics of the heatmap.
 */
/**
 * Context to build a grid with
 * * XY Coordinates are in a grid within specified range.
 * * Z coordinates are initially constant
 * * z values are modified by later directives.
 */
class SampleGridBuilder {
    constructor(range, gridSize) {
        this._gridSize = gridSize;
        this._range = range.clone();
        this.data = [];
        for (let j = 0; j <= this._gridSize; j++) {
            const row = [];
            for (let i = 0; i <= this._gridSize; i++) {
                row.push(0.0);
            }
            this.data.push(row);
        }
    }
    /** Return the closest x index for given x value */
    closestXIndex(x) {
        return this.closestGridIndex(x, this._range.low.x, this._range.high.x);
    }
    /** Return the closest y index for given y value */
    closestYIndex(y) {
        return this.closestGridIndex(y, this._range.low.y, this._range.high.y);
    }
    closestGridIndex(q, q0, q1) {
        if (q < q0)
            return 0;
        if (q > q1)
            return this._gridSize;
        return Math.floor(0.5 + this._gridSize * (q - q0) / (q1 - q0));
    }
    /**
     * Set grid point z to larger of current and zNew
     * @param i x direction index
     * @param j y direction index
     * @param zNew
     */
    setGridZToMax(i, j, zNew) {
        if (i >= 0 && i <= this._gridSize && j >= 0 && j <= this._gridSize) {
            const zOld = this.data[j][i];
            this.data[j][i] = Math.max(zOld, zNew);
        }
    }
    /**
     * * Apply zNew to grid point i,j
     * * for grid points within baseRadius, apply cubic (bell-like) falloff
     * @param i
     * @param j
     * @param zNew
     * @param baseRadius radius of base circle
     */
    setGridZToCubicMax(iMid, jMid, zNew, baseRadius) {
        const n = Math.ceil(baseRadius);
        this.setGridZToMax(iMid, jMid, zNew);
        let u, v, f;
        if (n > 1) {
            for (let j = -n; j <= n; j++) {
                for (let i = -n; i <= n; i++) {
                    const r = Geometry.hypotenuseXY(i, j);
                    if (r < baseRadius) {
                        u = r / baseRadius;
                        v = 1.0 - u;
                        // general cubic bezier on 4 control values a0,a1,a2,a3 is
                        // v^3 a0 + 3 v^2 u a1 + 3 v u^2 a2 + u^3 a3
                        // here a0 = a1 = 1, a2 = a3 = 0
                        f = v * v * (v + 3 * u);
                        this.setGridZToMax(iMid + i, jMid + j, zNew * f);
                    }
                }
            }
        }
    }
}
/** This class is responsible to building the decoration graphics and supplying them to the rendering
 * system to be displayed on top of the viewport.
 */
export default class HeatmapDecorator {
    constructor(points, range, spreadFactor, height) {
        this._height = height;
        this._points = points;
        this._range = HeatmapDecorator._computeSquareRange(range);
        this._spreadFactor = spreadFactor;
    }
    /** When the inputs change we have to throw away the current graphics.  Also tell the
     * viewport that the exiting decoration need to be redrawn.
     */
    _decorationChanged() {
        this._graphics = dispose(this._graphics);
        const vp = IModelApp.viewManager.selectedView;
        if (undefined !== vp)
            vp.invalidateDecorations();
    }
    /** Basic utility function to build a range around an array of points.
     * * All the points will be inside the range.
     * * The range's xLength === yLength.
     */
    static _computeSquareRange(inRange) {
        const rectangularRange = Range3d.createRange2d(inRange);
        const xLen = rectangularRange.xLength();
        const yLen = rectangularRange.yLength();
        const offset = yLen > xLen ? (yLen - xLen) / 2 : (xLen - yLen) / 2;
        const offsetDir = yLen > xLen ? Point3d.create(1, 0, 0) : Point3d.create(0, 1, 0);
        const squareRange = rectangularRange;
        let point = rectangularRange.low;
        point = point.plusScaled(offsetDir, -offset);
        squareRange.extend(point);
        point = rectangularRange.high;
        point = point.plusScaled(offsetDir, offset);
        squareRange.extend(point);
        return squareRange;
    }
    /* Change the heatmap points */
    setPoints(points) {
        this._points = points;
        this._decorationChanged();
    }
    /* Change the spread factor */
    setSpreadFactor(spreadFactor) {
        if (0 < spreadFactor && 100 >= spreadFactor) {
            this._spreadFactor = spreadFactor;
            this._decorationChanged();
        }
    }
    /** Build a sampled grid with
     * * grid that covers the range of the given points.
     * * is a square with side length 2^N
     * * value at grid point is the max over value of all points for which this is the closest grid point.
     */
    buildSampledGrid(gridSize) {
        const baseRadius = gridSize * (this._spreadFactor / 100);
        const grid = new SampleGridBuilder(this._range, gridSize);
        for (const point of this._points) {
            const i = grid.closestXIndex(point.x);
            const j = grid.closestYIndex(point.y);
            const r = point.z * baseRadius;
            grid.setGridZToCubicMax(i, j, point.z, r); // r is radius pointz represent the color
            //grid.setGridZToCubicMax(i, j, 10, 10);
        }
        return grid.data;
    }
    /** Convert grid of values to an image array
     * * each pixel is represented by four Uint8 values -> RGBA
     * * each value is converted to a color using a thematic gradient
     */
    gridToImageBuffer(valueGrid, gridSize) {
        /* Build a gradient to define a smoothly varying set of colors that we will use to represent intensities */
        const marginColor = ColorDef.from(0, 0, 255, 255);
        const thematicSettings = Gradient.ThematicSettings.fromJSON({ colorScheme: Gradient.ThematicColorScheme.Custom, mode: Gradient.ThematicMode.Smooth, stepCount: 0, rangeLow: 0.0, rangeHigh: 1.0, marginColor });
        const gradient = Gradient.Symb.createThematic(thematicSettings);
        gradient.keys.push(new Gradient.KeyColor({ value: 0.0, color: marginColor }));
        gradient.keys.push(new Gradient.KeyColor({ value: 0.5, color: ColorDef.from(0, 255, 0, 150) }));
        gradient.keys.push(new Gradient.KeyColor({ value: 0.75, color: ColorDef.from(255, 255, 0, 100) }));
        gradient.keys.push(new Gradient.KeyColor({ value: 1.0, color: ColorDef.from(255, 0, 0, 50) }));
        /* Form the image here.  For each grid point, map the intensity to a colorDef and then extract the r,g,b,a values. */
        const imageArray = new Uint8Array(4 * gridSize * gridSize);
        for (let j = 0; j <= gridSize; j++) {
            for (let i = 0; i <= gridSize; i++) {
                const colorDef = gradient.mapColor(valueGrid[i][j]);
                const colors = colorDef.colors;
                const baseIndex = 4 * ((j * gridSize) + i);
                imageArray[baseIndex + 0] = colors.r;
                imageArray[baseIndex + 1] = colors.g;
                imageArray[baseIndex + 2] = colors.b;
                imageArray[baseIndex + 3] = 255 - colors.t;
            }
        }
        return ImageBuffer.create(imageArray, ImageBufferFormat.Rgba, gridSize);
    }
    /* Create the graphics that represent the heatmap */
    _createGraphics(context) {
        if (0 === this._points.length)
            return undefined;
        /* Step 1: Build a grid of numbers to represent the intensities of the heatmap */
        const gridSizePowerOf2 = 8; // 2^8 (256x256)
        const gridSize = Math.pow(2, gridSizePowerOf2);
        const valueGrid = this.buildSampledGrid(gridSize);
        /* Step 2: Convert the grid to an image buffer */
        const imageBuffer = this.gridToImageBuffer(valueGrid, gridSize);
        if (undefined === imageBuffer)
            return undefined;
        /* Step 3: Convert the image buffer to a texture */
        // const textureParams = new RenderTexture.Params(undefined, RenderTexture.Type.Normal, false);
        const textureParams = new RenderTexture.Params(undefined, 0, false);
        const texture = IModelApp.renderSystem.createTextureFromImageBuffer(imageBuffer, context.viewport.iModel, textureParams);
        if (undefined === texture)
            return undefined;
        /* Step 4: Create a render material that can be used to map the texture onto a surface. */
        const mappingParams = new TextureMapping.Params();
        const textureMapping = new TextureMapping(texture, mappingParams);
        const materialParams = new RenderMaterial.Params();
        materialParams.textureMapping = textureMapping;
        const material = IModelApp.renderSystem.createMaterial(materialParams, context.viewport.iModel);
        const graphicParams = new GraphicParams();
        graphicParams.material = material;
        /* Step 5: activate the render material and then create a square shape.  The material will be displayed at the
           location of the shape. */
        const builder = context.createGraphicBuilder(GraphicType.WorldOverlay);
        builder.activateGraphicParams(graphicParams);

        // const strokeOptions = new StrokeOptions();
        // strokeOptions.needParams = true;
        // const polyfaceBuilder = PolyfaceBuilder.create(strokeOptions);
        // polyfaceBuilder.toggleReversedFacetFlag();
        // const uvParams = [Point2d.create(0, 0), Point2d.create(1, 0), Point2d.create(1, 1), Point2d.create(0, 1)];
        // polyfaceBuilder.addQuadFacet(this._points, uvParams);
        // const polyface = polyfaceBuilder.claimPolyface(false);
        // builder.addPolyface(polyface, true);
        

        const corners = this._range.corners();
        for (const corner of corners) {
            corner.z = this._height;
        }
        const shapePoints = [];
        shapePoints.push(corners[0]);
        shapePoints.push(corners[2]);
        shapePoints.push(corners[3]);
        shapePoints.push(corners[1]);
        shapePoints.push(corners[0]);
        builder.addShape(shapePoints);
        return builder.finish();
    }
    /* Implement this method to add Decorations into the supplied DecorateContext. */
    decorate(context) {
        /* This method is called for every rendering frame.  We will reuse our graphics since the heatmap graphics
           don't typically change.  If they do change, we invalidate the graphics and then regenerate them here for
           the next frame. */
        if (undefined === this._graphics) {
            this._graphics = this._createGraphics(context);
        }
        if (undefined !== this._graphics) {
            // Create a container to take ownership of our graphics to prevent them from being disposed of by the rendering system.
            const branch = new GraphicBranch(false);
            branch.add(this._graphics);
            const graphic = context.createBranch(branch, Transform.identity);
            context.addDecoration(GraphicType.WorldOverlay, graphic);
        }
    }
}
