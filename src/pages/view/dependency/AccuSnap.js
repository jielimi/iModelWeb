"use strict";
/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module LocatingElements */
// Object.defineProperty(exports, "__esModule", { value: true });
const geometry_core_1 = require("@bentley/geometry-core");
const Tool_1 = require("@bentley/imodeljs-frontend/lib/tools/Tool");
const ElementLocateManager_1 = require("@bentley/imodeljs-frontend/lib/ElementLocateManager");
const Sprites_1 = require("@bentley/imodeljs-frontend/lib/Sprites");
const HitDetail_1 = require("@bentley/imodeljs-frontend/lib/HitDetail");
const IModelApp_1 = require("@bentley/imodeljs-frontend/lib/IModelApp");
const bentleyjs_core_1 = require("@bentley/bentleyjs-core");
const imodeljs_common_1 = require("@bentley/imodeljs-common");
/** @hidden Virtual cursor for using AccuSnap with touch input. */
class TouchCursor {
    constructor(vp) {
        this.position = new geometry_core_1.Point3d();
        this._offsetPosition = new geometry_core_1.Point3d();
        this._isDragging = false;
        this._inTouchTap = false;
        this._size = vp.pixelsFromInches(0.3);
        this._yOffset = this._size * 1.75;
        this._outlineColor = (imodeljs_common_1.ColorDef.black === vp.getContrastToBackgroundColor() ? "black" : "white");
        this._fillColor = this.getFillColor(false);
    }
    getFillColor(isSelected) { return isSelected ? "rgba(35,187,252,.5)" : "rgba(128,128,128,.25)"; }
    isSelected(pt) { return this.position.distance(geometry_core_1.Point3d.create(pt.x, pt.y)) < this._size; }
    setPosition(vp, worldLocation) {
        const pt4 = vp.worldToView4d(worldLocation);
        if (pt4.w > 1.0 || pt4.w < 0) // outside of frustum.
            return false;
        const viewLocation = pt4.realPoint();
        if (undefined === viewLocation || !vp.viewRect.containsPoint(viewLocation))
            return false; // outside this viewport rect
        viewLocation.x = Math.floor(viewLocation.x) + 0.5;
        viewLocation.y = Math.floor(viewLocation.y) + 0.5;
        viewLocation.z = 0.0;
        const offsetLocation = new geometry_core_1.Point3d(viewLocation.x, viewLocation.y - this._yOffset, viewLocation.z);
        if (!vp.viewRect.containsPoint(offsetLocation))
            return false; // outside this viewport rect
        this.position.setFrom(viewLocation);
        this._offsetPosition.setFrom(offsetLocation);
        vp.invalidateDecorations();
        return true;
    }
    drawDecoration(ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,.5)";
        ctx.fillStyle = "white";
        ctx.strokeRect(-2, -(this._yOffset + 2), 5, 5);
        ctx.fillRect(-1, -(this._yOffset + 1), 3, 3);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this._outlineColor;
        ctx.fillStyle = this._fillColor;
        ctx.shadowColor = this._outlineColor;
        ctx.shadowBlur = 15;
        ctx.moveTo(-this._size, 0);
        ctx.bezierCurveTo(-this._size, -this._size * 0.85, -this._size * 0.6, -this._yOffset * 0.6, 0, -this._yOffset * 0.8);
        ctx.bezierCurveTo(this._size * 0.6, -this._yOffset * 0.6, this._size, -this._size * 0.85, this._size, 0);
        ctx.arc(0, 0, this._size, 0, Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(0, 0, this._size * 0.75, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-this._size * 0.4, 0);
        ctx.lineTo(this._size * 0.4, 0);
        ctx.moveTo(-this._size * 0.4, this._size * 0.25);
        ctx.lineTo(this._size * 0.4, this._size * 0.25);
        ctx.stroke();
    }
    isButtonHandled(ev) { return (0 /* Data */ === ev.button && 2 /* Touch */ === ev.inputSource && !this._inTouchTap); }
    doTouchMove(ev) {
        if (undefined === ev.viewport || !ev.isSingleTouch)
            return false;
        if (!this._isDragging || !this.setPosition(ev.viewport, ev.point))
            return false;
        ev.viewPoint = this._offsetPosition;
        IModelApp_1.IModelApp.toolAdmin.convertTouchMoveToMotion(ev); // tslint:disable-line:no-floating-promises
        return true;
    }
    doTouchMoveStart(ev, startEv) {
        if (undefined === ev.viewport || !ev.isSingleTouch)
            return false;
        return (this._isDragging = this.isSelected(startEv.viewPoint));
    }
    doTouchStart(ev) {
        this._fillColor = this.getFillColor(ev.isSingleTouch && this.isSelected(ev.viewPoint));
        if (undefined !== ev.viewport)
            ev.viewport.invalidateDecorations();
    }
    doTouchEnd(ev) {
        this._isDragging = false;
        this._fillColor = this.getFillColor(false);
        if (undefined !== ev.viewport)
            ev.viewport.invalidateDecorations();
    }
    async doTouchTap(ev) {
        if (undefined === ev.viewport || !ev.isSingleTouch || 1 !== ev.tapCount)
            return false;
        if (!this.isSelected(ev.viewPoint)) {
            if (!this.setPosition(ev.viewport, ev.point))
                return false;
            ev.viewPoint = this._offsetPosition;
            IModelApp_1.IModelApp.toolAdmin.convertTouchMoveToMotion(ev); // tslint:disable-line:no-floating-promises
            return false;
        }
        ev.viewPoint = this._offsetPosition;
        this._inTouchTap = true;
        await IModelApp_1.IModelApp.toolAdmin.convertTouchTapToButtonDownAndUp(ev);
        this._inTouchTap = false;
        return true;
    }
    static createFromTouchTap(ev) {
        if (undefined === ev.viewport || !ev.isSingleTouch || 1 !== ev.tapCount)
            return undefined;
        const touchCursor = new TouchCursor(ev.viewport);
        if (!touchCursor.setPosition(ev.viewport, ev.point) && !touchCursor.setPosition(ev.viewport, ev.viewport.view.getCenter()))
            return undefined;
        ev.viewPoint = touchCursor._offsetPosition;
        IModelApp_1.IModelApp.toolAdmin.convertTouchMoveToMotion(ev); // tslint:disable-line:no-floating-promises
        return touchCursor;
    }
}
// exports.TouchCursor = TouchCursor;
//export {TouchCursor, AccuSnap,TentativeOrAccuSnap} ;
/** AccuSnap is an aide for snapping to interesting points on elements or decorations as the cursor moves over them.
 * @see [Using AccuSnap]($docs/learning/frontend/primitivetools.md#AccuSnap)
 */
class AccuSnap {
    constructor() {
        /** Views that need to be flashed */
        this.needFlash = new Set();
        /** Views that are already flashed */
        this.areFlashed = new Set();
        /** The "+" that indicates where the snap point is */
        this.cross = new Sprites_1.SpriteLocation();
        /** The icon that indicates what type of snap is active */
        this.icon = new Sprites_1.SpriteLocation();
        /** The icon that indicates an error */
        this.errorIcon = new Sprites_1.SpriteLocation();
        /** Number of times "suppress" has been called -- unlike suspend this is not automatically cleared by tools */
        this._suppressed = 0;
        /** Time motion stopped. */
        this._motionStopTime = 0;
        /** Location of cursor when we last checked for motion */
        this._lastCursorPos = new geometry_core_1.Point2d();
        /** @hidden */
        this.toolState = new AccuSnap.ToolState();
        /** @hidden */
        this._settings = new AccuSnap.Settings();
    }
    /** @hidden */
    onInitialized() { }
    get _searchDistance() { return this.isLocateEnabled ? 1.0 : this._settings.searchDistance; }
    get _hotDistanceInches() { return IModelApp_1.IModelApp.locateManager.apertureInches * this._settings.hotDistanceFactor; }
    /** Whether locate of elements under the cursor is enabled by the current InteractiveTool. */
    get isLocateEnabled() { return this.toolState.locate; }
    /** Whether snapping to elements under the cursor is enabled by the current InteractiveTool. */
    get isSnapEnabled() { return this.toolState.enabled; }
    /** Whether the user setting for snapping is enabled. Snapping is done only when both the user and current InteractiveTool have enabled it. */
    get isSnapEnabledByUser() { return this._settings.enableFlag; }
    isFlashed(view) { return (this.areFlashed.has(view)); }
    needsFlash(view) { return (this.needFlash.has(view)); }
    setNeedsFlash(view) { this.needFlash.add(view); this.clearIsFlashed(view); view.invalidateDecorations(); }
    setIsFlashed(view) { this.areFlashed.add(view); }
    clearIsFlashed(view) { this.areFlashed.delete(view); }
    static toSnapDetail(hit) { return (hit && hit instanceof HitDetail_1.SnapDetail) ? hit : undefined; }
    getCurrSnapDetail() { return AccuSnap.toSnapDetail(this.currHit); }
    /** Determine whether there is a current hit that is *hot*. */
    get isHot() { const currSnap = this.getCurrSnapDetail(); return !currSnap ? false : currSnap.isHot; }
    /** @hidden */
    destroy() { this.currHit = undefined; this.aSnapHits = undefined; }
    get _doSnapping() { return this.isSnapEnabled && this.isSnapEnabledByUser && !this._isSnapSuspended; }
    get _isSnapSuspended() { return (0 !== this._suppressed || 0 !== this.toolState.suspended); }
    /** Get the current snap divisor to use to use for SnapMode.NearestKeypoint.
     * A subclass of IModelApp can implement onStartup to return a subclass of AccuSnap that implements this method to provide a snap divisor ui component.
     */
    get keypointDivisor() { return 2; }
    /** Get the current active SnapModes. SnapMode position determines priority, with the first entry being the highest. The SnapDetail will be returned for the first SnapMode that produces a hot snap.
     * A subclass of IModelApp can implement onStartup to return a subclass of AccuSnap that implements this method to provide a SnapMode ui component.
     */
    getActiveSnapModes() {
        const snaps = [];
        snaps.push(2 /* NearestKeypoint */);
        return snaps;
    }
    /** Can be implemented by a subclass of AccuSnap to implement a SnapMode override that applies only to the next point.
     * This method will be called whenever a new tool is installed and on button events.
     */
    synchSnapMode() { }
    /** Check whether current tentative snap has valid curve geometry for finding extended intersections. */
    get _searchForExtendedIntersections() {
        const snap = IModelApp_1.IModelApp.tentativePoint.getCurrSnap();
        return (undefined !== snap && undefined !== snap.primitive);
    }
    /**
     * Check to see whether its appropriate to generate an AccuSnap point, given the current user
     * and command settings, and whether a tentative point is currently active.
     */
    get isActive() {
        // Unless we're snapping in intersect mode (to find extended intersections), skip if tentative point active...
        if (IModelApp_1.IModelApp.tentativePoint.isActive) {
            if (!this._doSnapping || !this._searchForExtendedIntersections)
                return false;
            const snaps = this.getActiveSnapModes();
            for (const snap of snaps) {
                if (snap === 64 /* Intersection */)
                    return true;
            }
            return false;
        }
        return this._doSnapping || this.isLocateEnabled;
    }
    initializeForCheckMotion() {
        this._lastCursorPos.setFrom(IModelApp_1.IModelApp.toolAdmin.currentInputState.lastMotion);
    }
    /** Clear the current AccuSnap info. */
    clear() { this.setCurrHit(undefined); }
    setCurrHit(newHit) {
        const newSnap = AccuSnap.toSnapDetail(newHit);
        const currSnap = this.getCurrSnapDetail();
        const sameElem = (undefined !== newHit && newHit.isSameHit(this.currHit));
        const sameHit = (sameElem && !newSnap);
        const sameSnap = (sameElem && undefined !== newSnap && undefined !== currSnap);
        const samePt = (sameHit || (sameSnap && newSnap.snapPoint.isAlmostEqual(currSnap.snapPoint)));
        const sameHot = (sameHit || (sameSnap && (this.isHot === newSnap.isHot)));
        const sameBaseSnapMode = (!newSnap || !currSnap || newSnap.snapMode === currSnap.snapMode);
        const sameType = (sameHot && (!currSnap || (currSnap.getHitType() === newHit.getHitType())));
        // see if it is the same point on the same element, the hot flags are the same multiple snaps, and the snap modes are the same
        if (samePt && sameType && sameBaseSnapMode) {
            // we know that nothing about the screen could change, just save the new hit and return to avoid screen flash
            this.currHit = newHit;
            return;
        }
        this.erase();
        // if we hit the same element with the same "hotness" as last time, we don't need to erase it
        //  multiple snaps: but only if the old and new snap modes are the same
        if (!sameHot || !sameBaseSnapMode) {
            this.unFlashViews();
            this.setFlashHit(newHit);
        }
        // if we didn't get a new hit, we're done
        if (undefined === (this.currHit = newHit))
            return;
        // draw sprites for this hit
        this.showSnapSprite();
    }
    /** flash a hit in a single view. */
    flashHitInView(hit, context) {
        const viewport = context.viewport;
        if (!viewport || !this.hitShouldBeHilited(hit) || !this.needsFlash(viewport))
            return;
        hit.draw(context);
        this.setIsFlashed(viewport);
    }
    setNeedsFlashView(view) {
        if (!this.isFlashed(view) && !this.needsFlash(view))
            this.setNeedsFlash(view);
    }
    /** flash a hit in its view. */
    setFlashHit(hit) {
        if (hit !== undefined && this.hitShouldBeHilited(hit))
            this.setNeedsFlashView(hit.viewport);
    }
    erase() {
        this.clearToolTip(undefined); // make sure there's no tooltip up.
        this.clearSprites(); // remove all sprites from the screen
    }
    async showElemInfo(viewPt, vp, hit) {
        if (IModelApp_1.IModelApp.viewManager.doesHostHaveFocus) {
            const msg = await IModelApp_1.IModelApp.toolAdmin.getToolTip(hit);
            this.showLocateMessage(viewPt, vp, msg);
        }
    }
    showLocateMessage(viewPt, vp, msg) {
        if (IModelApp_1.IModelApp.viewManager.doesHostHaveFocus)
            vp.openToolTip(msg, viewPt);
    }
    async displayToolTip(viewPt, vp, uorPt) {
        
        // if the tooltip is already displayed, or if user doesn't want it, quit.
        if (0 === this._motionStopTime || !this._settings.toolTip || !IModelApp_1.IModelApp.notifications.isToolTipSupported || IModelApp_1.IModelApp.notifications.isToolTipOpen)
            return;
        const accuSnapHit = this.currHit;
        const tpHit = IModelApp_1.IModelApp.tentativePoint.getCurrSnap();
        // if we don't have either an AccuSnap or a tentative point hit, quit.
        if (!accuSnapHit && !tpHit && !this.errorIcon.isActive)
            return;
        // when the tentative button is first pressed, we pass nullptr for uorPt so that we can know to show the tooltip more quickly.
        const timeout = (undefined === tpHit || undefined !== uorPt ? this._settings.toolTipDelay : bentleyjs_core_1.BeDuration.fromSeconds(.1));
        // have we waited long enough to show the balloon?
        if ((this._motionStopTime + timeout.milliseconds) > Date.now())
            return;
        this._motionStopTime = 0; // If application chooses to not display tool tip, make sure we don't ask again until we see another motion/motion stopped...
        let theHit;
        // determine which type of hit
        if (tpHit) {
            if (uorPt) {
                // see if he came back somewhere near the currently snapped element
                const aperture = (this._settings.stickyFactor * vp.pixelsFromInches(IModelApp_1.IModelApp.locateManager.apertureInches) / 2.0) + 1.5;
                if (!IModelApp_1.IModelApp.locateManager.picker.testHit(tpHit, vp, uorPt, aperture, IModelApp_1.IModelApp.locateManager.options))
                    return;
            }
            theHit = tpHit;
        }
        else {
            theHit = accuSnapHit;
        }
        // if we're currently showing an error, get the error message...otherwise display hit info...
        if (!this.errorIcon.isActive && theHit) {
            return this.showElemInfo(viewPt, vp, theHit);
        }
        // If we have an error explanation...use it as is!
        if (this.explanation) {
            this.showLocateMessage(viewPt, vp, this.explanation);
            return;
        }
        // if we don't have an explanation yet, translate the error code.
        if (!this.errorKey)
            return;
        this.explanation = IModelApp_1.IModelApp.i18n.translate(this.errorKey);
        if (!this.explanation)
            return;
        // Get the "best" rejected hit to augment the error explanation with the hit info...
        if (!theHit)
            theHit = this.aSnapHits ? this.aSnapHits.hits[0] : undefined;
        this.showLocateMessage(viewPt, vp, this.explanation);
    }
    clearToolTip(ev) {
        if (!IModelApp_1.IModelApp.notifications.isToolTipOpen)
            return;
        if (ev && (5 > ev.viewPoint.distanceXY(IModelApp_1.IModelApp.notifications.toolTipLocation)))
            return;
        IModelApp_1.IModelApp.notifications.clearToolTip();
    }
    /** Display the sprites for the current snap to indicate its position on the screen and what snap mode it represents. */
    showSnapSprite() {
        const snap = this.getCurrSnapDetail();
        if (!snap)
            return;
        const crossPt = snap.snapPoint;
        const viewport = snap.viewport;
        const crossSprite = Sprites_1.IconSprites.getSpriteFromUrl(snap.isHot ? "sprites/SnapCross.png" : "sprites/SnapUnfocused.png");
        this.cross.activate(crossSprite, viewport, crossPt);
        const snapSprite = snap.sprite;
        if (snapSprite)
            this.icon.activate(snapSprite, viewport, AccuSnap.adjustIconLocation(viewport, crossPt, snapSprite.size));
    }
    static adjustIconLocation(vp, input, iconSize) {
        const out = vp.worldToView(input);
        out.x += (iconSize.x / 3.0);
        out.y -= (iconSize.y * 1.3);
        return vp.viewToWorld(out, out);
    }
    /** try to indicate what's wrong with the current point (why we're not snapping). */
    showSnapError(out, ev) {
        this.explanation = out.explanation;
        this.errorKey = out.reason;
        this.errorIcon.deactivate();
        const vp = ev.viewport;
        let errorSprite;
        switch (out.snapStatus) {
            case 600 /* FilteredByApp */:
                errorSprite = Sprites_1.IconSprites.getSpriteFromUrl("sprites/SnapAppFiltered.png");
                break;
            case 700 /* FilteredByAppQuietly */:
                this.errorKey = undefined;
                break;
            case 300 /* NotSnappable */:
                errorSprite = Sprites_1.IconSprites.getSpriteFromUrl("sprites/SnapNotSnappable.png");
                this.errorKey = ElementLocateManager_1.ElementLocateManager.getFailureMessageKey("NotSnappable");
                break;
        }
        if (!errorSprite)
            return;
        const spriteSize = errorSprite.size;
        const pt = AccuSnap.adjustIconLocation(vp, ev.rawPoint, spriteSize);
        this.errorIcon.activate(errorSprite, vp, pt);
    }
    clearSprites() {
        this.errorIcon.deactivate();
        this.cross.deactivate();
        this.icon.deactivate();
    }
    /** determine whether a hit should be hilited or not. */
    hitShouldBeHilited(hit) {
        if (!hit)
            return false;
        if (hit.isModelHit)
            return false; // Avoid annoying flashing of reality models.
        const snap = AccuSnap.toSnapDetail(hit);
        return !snap || snap.isHot || this._settings.hiliteColdHits;
    }
    unFlashViews() {
        this.needFlash.clear();
        this.areFlashed.forEach((vp) => {
            vp.setFlashed(undefined, 0.0);
        });
        this.areFlashed.clear();
    }
    adjustPointIfHot(pt, view) {
        const currSnap = this.getCurrSnapDetail();
        if (!currSnap || !currSnap.isHot || view !== currSnap.viewport)
            return;
        pt.setFrom(currSnap.adjustedPoint);
    }
    /** Implemented by sub-classes to update ui to show current enabled state. */
    onEnabledStateChange(_isEnabled, _wasEnabled) { }
    getHitAndList(holder) {
        const hit = this.currHit;
        if (hit) {
            holder.setHitList(this.aSnapHits);
            this.aSnapHits = undefined;
        }
        return hit;
    }
    initCmdState() { this.toolState.suspended = 0; }
    suspend(doSuspend) {
        const previousDoSnapping = this._doSnapping;
        if (doSuspend)
            this.toolState.suspended++;
        else if (this.toolState.suspended > 0)
            this.toolState.suspended--;
        this.onEnabledStateChange(this._doSnapping, previousDoSnapping);
    }
    suppress(doSuppress) {
        const previousDoSnapping = this._doSnapping;
        if (doSuppress)
            this._suppressed++;
        else if (this._suppressed > 0)
            this._suppressed--;
        this.onEnabledStateChange(this._doSnapping, previousDoSnapping);
        return this._suppressed;
    }
    enableSnap(yesNo) {
        const previousDoSnapping = this._doSnapping;
        this.toolState.enabled = yesNo;
        if (!yesNo) {
            this.clear();
            if (undefined !== this.touchCursor) {
                this.touchCursor = undefined;
                IModelApp_1.IModelApp.viewManager.invalidateDecorationsAllViews();
            }
        }
        this.onEnabledStateChange(this._doSnapping, previousDoSnapping);
    }
    intersectXY(tpSnap, second) {
        // Get single segment curve from each snap to intersect...
        const tpSegment = tpSnap.getCurvePrimitive();
        if (undefined === tpSegment)
            return undefined;
        const segment = second.getCurvePrimitive();
        if (undefined === segment)
            return undefined;
        const worldToView = second.viewport.worldToViewMap.transform0;
        const detail = geometry_core_1.CurveCurve.IntersectionProjectedXY(worldToView, tpSegment, true, segment, true);
        if (0 === detail.dataA.length)
            return undefined;
        let closeIndex = 0;
        if (detail.dataA.length > 1) {
            const snapPt = worldToView.multiplyPoint3d(1 /* Point */ === tpSnap.geomType && 1 /* Point */ !== second.geomType ? second.getPoint() : tpSnap.getPoint(), 1); // Don't check distance from arc centers...
            let lastDist;
            for (let i = 0; i < detail.dataA.length; i++) {
                const testPt = worldToView.multiplyPoint3d(detail.dataA[i].point, 1);
                const testDist = snapPt.realDistanceXY(testPt);
                if (undefined !== testDist && (undefined === lastDist || testDist < lastDist)) {
                    lastDist = testDist;
                    closeIndex = i;
                }
            }
        }
        const intersect = new HitDetail_1.IntersectDetail(tpSnap, 2 /* InRange */, detail.dataA[closeIndex].point, segment, second.sourceId); // Should be ok to share hit detail with tentative...
        intersect.primitive = tpSegment; // Just save single segment that was intersected for line strings/shapes...
        return intersect;
    }
    static async requestSnap(thisHit, snapModes, hotDistanceInches, keypointDivisor, hitList, out) {
        if (undefined !== thisHit.subCategoryId) {
            const appearance = thisHit.viewport.getSubCategoryAppearance(thisHit.subCategoryId);
            if (appearance.dontSnap) {
                if (out)
                    out.snapStatus = 300 /* NotSnappable */;
                return undefined;
            }
        }
        const requestProps = {
            id: thisHit.sourceId,
            testPoint: thisHit.testPoint,
            closePoint: thisHit.hitPoint,
            worldToView: thisHit.viewport.worldToViewMap.transform0.toJSON(),
            viewFlags: thisHit.viewport.viewFlags,
            snapModes,
            snapAperture: thisHit.viewport.pixelsFromInches(hotDistanceInches),
            snapDivisor: keypointDivisor,
            subCategoryId: thisHit.subCategoryId,
            geometryClass: thisHit.geometryClass,
        };
        if (!thisHit.isElementHit) {
            const thisGeom = IModelApp_1.IModelApp.viewManager.getDecorationGeometry(thisHit);
            if (undefined === thisGeom) {
                if (out)
                    out.snapStatus = 200 /* NoSnapPossible */;
                return undefined;
            }
            requestProps.decorationGeometry = [new imodeljs_common_1.DecorationGeometryProps(thisHit.sourceId, thisGeom)];
        }
        if (snapModes.includes(64 /* Intersection */)) {
            if (undefined !== hitList) {
                for (const hit of hitList.hits) {
                    if (thisHit.sourceId === hit.sourceId)
                        continue;
                    if (!hit.isElementHit) {
                        const geom = IModelApp_1.IModelApp.viewManager.getDecorationGeometry(hit);
                        if (undefined === geom)
                            continue;
                        if (undefined === requestProps.decorationGeometry)
                            requestProps.decorationGeometry = [new imodeljs_common_1.DecorationGeometryProps(hit.sourceId, geom)];
                        else
                            requestProps.decorationGeometry.push(new imodeljs_common_1.DecorationGeometryProps(hit.sourceId, geom));
                    }
                    if (undefined === requestProps.intersectCandidates)
                        requestProps.intersectCandidates = [hit.sourceId];
                    else
                        requestProps.intersectCandidates.push(hit.sourceId);
                    if (5 === requestProps.intersectCandidates.length)
                        break; // Search for intersection with a few of the next best hits...
                }
            }
            if (1 === snapModes.length && undefined === requestProps.intersectCandidates) {
                if (out)
                    out.snapStatus = 200 /* NoSnapPossible */;
                return undefined; // Don't make back end request when only doing intersection snap when we don't have another hit to intersect with...
            }
        }
        const result = await thisHit.viewport.iModel.requestSnap(requestProps);
        if (out)
            out.snapStatus = result.status;
        if (result.status !== 0 /* Success */)
            return undefined;
        const snap = new HitDetail_1.SnapDetail(thisHit, result.snapMode, result.heat, result.snapPoint);
        snap.setCurvePrimitive(undefined !== result.curve ? geometry_core_1.IModelJson.Reader.parse(result.curve) : undefined, undefined, result.geomType);
        if (undefined !== result.parentGeomType)
            snap.parentGeomType = result.parentGeomType;
        if (undefined !== result.hitPoint)
            snap.hitPoint.setFromJSON(result.hitPoint); // Update hitPoint from readPixels with exact point location corrected to surface/edge geometry...
        if (undefined !== result.normal)
            snap.normal = geometry_core_1.Vector3d.fromJSON(result.normal);
        if (64 /* Intersection */ !== snap.snapMode)
            return snap;
        if (undefined === result.intersectId)
            return undefined;
        const otherPrimitive = (undefined !== result.intersectCurve ? geometry_core_1.IModelJson.Reader.parse(result.intersectCurve) : undefined);
        if (undefined === otherPrimitive)
            return undefined;
        const intersect = new HitDetail_1.IntersectDetail(snap, snap.heat, snap.snapPoint, otherPrimitive, result.intersectId);
        return intersect;
    }
    async getAccuSnapDetail(hitList, out) {
        const thisHit = hitList.getNextHit();
        if (undefined === thisHit)
            return undefined;
        const filterStatus = (this.isLocateEnabled ? IModelApp_1.IModelApp.locateManager.filterHit(thisHit, 1 /* AutoLocate */, out) : 0 /* Accept */);
        if (0 /* Accept */ !== filterStatus) {
            out.snapStatus = 600 /* FilteredByApp */;
            return undefined;
        }
        let snapModes;
        if (IModelApp_1.IModelApp.tentativePoint.isActive) {
            snapModes = [];
            snapModes.push(1 /* Nearest */); // Special case: isActive only allows snapping with tentative to find extended intersections...
        }
        else {
            snapModes = this.getActiveSnapModes(); // Get the list of point snap modes to consider
        }
        const thisSnap = await AccuSnap.requestSnap(thisHit, snapModes, this._hotDistanceInches, this.keypointDivisor, hitList, out);
        if (undefined === thisSnap)
            return undefined;
        if (IModelApp_1.IModelApp.tentativePoint.isActive) {
            const tpSnap = IModelApp_1.IModelApp.tentativePoint.getCurrSnap();
            if (undefined === tpSnap)
                return undefined;
            const intersectSnap = this.intersectXY(tpSnap, thisSnap);
            if (undefined === intersectSnap)
                return undefined;
            hitList.setCurrentHit(thisHit);
            return intersectSnap;
        }
        IModelApp_1.IModelApp.accuDraw.onSnap(thisSnap); // AccuDraw can adjust nearest snap to intersection of circle (polar distance lock) or line (axis lock) with snapped to curve...
        hitList.setCurrentHit(thisHit);
        return thisSnap;
    }
    findHits(ev, force = false) {
        // When using AccuSnap to locate elements, we have to start with the datapoint adjusted
        // for locks and not the raw point. Otherwise, when grid/unit lock are on, we locate elements by
        // points not on the grid. This causes them to be "pulled" off the grid when they are accepted. On
        // the other hand, when NOT locating, we need to use the raw point so we can snap to elements
        // away from the grid.
        const testPoint = this.isLocateEnabled ? ev.point : ev.rawPoint;
        const vp = ev.viewport;
        const picker = IModelApp_1.IModelApp.locateManager.picker;
        const options = IModelApp_1.IModelApp.locateManager.options.clone(); // Copy to avoid changing out from under active Tool...
        // NOTE: Since TestHit will use the same HitSource as the input hit we only need to sets this for DoPick...
        options.hitSource = this.isSnapEnabled ? 3 /* AccuSnap */ : 2 /* MotionLocate */;
        let aperture = (vp.pixelsFromInches(IModelApp_1.IModelApp.locateManager.apertureInches) / 2.0) + 1.5;
        this.initializeForCheckMotion();
        aperture *= this._searchDistance;
        if (0 === picker.doPick(vp, testPoint, aperture, options)) {
            this.aSnapHits = undefined; // Clear any previous hit list so reset won't cycle through hits cursor is no longer over, etc.
            return 2 /* NoElements */;
        }
        this.aSnapHits = picker.getHitList(true); // take ownership of the pickElem hit list.
        // see if we should keep the current hit
        const canBeSticky = !force && this.aSnapHits.length > 1 && this.currHit && (3 /* Intersection */ !== this.currHit.getHitType() && this.currHit.priority < 4 /* PlanarSurface */);
        if (canBeSticky) {
            for (let iHit = 1; iHit < this.aSnapHits.length; ++iHit) {
                const thisHit = this.aSnapHits.hits[iHit];
                if (!thisHit.isSameHit(this.currHit))
                    continue;
                this.aSnapHits.removeHit(iHit);
                this.aSnapHits.insertHit(0, thisHit);
                break;
            }
        }
        return 0 /* Success */;
    }
    async findLocatableHit(ev, newSearch, out) {
        out.snapStatus = 2 /* NoElements */;
        if (newSearch) {
            this.aSnapHits = undefined;
            // search for new hits, but if the cursor is still close to the current hit, don't throw away list.
            if (0 /* Success */ !== (out.snapStatus = this.findHits(ev)))
                return undefined;
        }
        else {
            if (!this.aSnapHits) {
                out.snapStatus = 2 /* NoElements */;
                return undefined;
            }
        }
        const thisList = this.aSnapHits;
        let thisHit;
        const ignore = new ElementLocateManager_1.LocateResponse();
        // keep looking through hits until we find one that is accu-snappable.
        while (undefined !== (thisHit = thisList.getNextHit())) {
            if (0 /* Accept */ === await IModelApp_1.IModelApp.locateManager.filterHit(thisHit, 1 /* AutoLocate */, out))
                return thisHit;
            // we only care about the status of the first hit.
            out.snapStatus = 600 /* FilteredByApp */;
            out = ignore;
        }
        // Reset current hit index to go back to first hit on next AccuSnap reset event...
        thisList.resetCurrentHit();
        return undefined;
    }
    /** When in auto-locate mode, advance to the next hit without searching again. */
    async resetButton() {
        let hit;
        const out = new ElementLocateManager_1.LocateResponse();
        out.snapStatus = 100 /* Disabled */;
        this.clearToolTip(undefined);
        const ev = new Tool_1.BeButtonEvent();
        IModelApp_1.IModelApp.toolAdmin.fillEventFromCursorLocation(ev);
        if (this._doSnapping) {
            // if we don't have any more candidate hits, get a new list at the current location
            if (!this.aSnapHits || (0 === this.aSnapHits.length)) {
                out.snapStatus = this.findHits(ev);
                hit = (0 /* Success */ !== out.snapStatus) ? undefined : await this.getAccuSnapDetail(this.aSnapHits, out);
            }
            else {
                // drop the current hit from the list and then retest the list (without the dropped hit) to find the new snap
                this.aSnapHits.removeCurrentHit();
                hit = await this.getAccuSnapDetail(this.aSnapHits, out);
            }
        }
        else if (this.isLocateEnabled) {
            hit = await this.findLocatableHit(ev, false, out); // get next AccuSnap path (or undefined)
        }
        // set the current hit
        if (hit || this.currHit)
            this.setCurrHit(hit);
        // indicate errors
        this.showSnapError(out, ev);
        return out.snapStatus;
    }
    /** Find the best snap point according to the current cursor location */
    async onMotion(ev) {
        this.clearToolTip(ev);
        const out = new ElementLocateManager_1.LocateResponse();
        out.snapStatus = 100 /* Disabled */;
        let hit;
        if (this.isActive) {
            if (this._doSnapping) {
                out.snapStatus = this.findHits(ev);
                hit = (0 /* Success */ !== out.snapStatus) ? undefined : await this.getAccuSnapDetail(this.aSnapHits, out);
            }
            else if (this.isLocateEnabled) {
                hit = await this.findLocatableHit(ev, true, out);
            }
        }
        // set the current hit and display the sprite (based on snap's KeypointType)
        if (hit || this.currHit)
            this.setCurrHit(hit);
        // indicate errors
        this.showSnapError(out, ev);
        if (undefined !== this.touchCursor && 1 /* Mouse */ === ev.inputSource) {
            this.touchCursor = undefined;
            IModelApp_1.IModelApp.viewManager.invalidateDecorationsAllViews();
        }
    }
    onMotionStopped(_ev) { this._motionStopTime = Date.now(); }
    async onNoMotion(ev) { return this.displayToolTip(ev.viewPoint, ev.viewport, ev.rawPoint); }
    onPreButtonEvent(ev) { return (undefined !== this.touchCursor) ? this.touchCursor.isButtonHandled(ev) : false; }
    onTouchStart(ev) { if (undefined !== this.touchCursor)
        this.touchCursor.doTouchStart(ev); }
    onTouchEnd(ev) { if (undefined !== this.touchCursor && 0 === ev.touchCount)
        this.touchCursor.doTouchEnd(ev); }
    onTouchCancel(ev) { if (undefined !== this.touchCursor)
        this.touchCursor.doTouchEnd(ev); }
    onTouchMove(ev) { return (undefined !== this.touchCursor) ? this.touchCursor.doTouchMove(ev) : false; }
    onTouchMoveStart(ev, startEv) { return (undefined !== this.touchCursor) ? this.touchCursor.doTouchMoveStart(ev, startEv) : false; }
    async onTouchTap(ev) {
        if (undefined !== this.touchCursor)
            return this.touchCursor.doTouchTap(ev);
        if (!this._doSnapping)
            return false;
        return (undefined !== (this.touchCursor = TouchCursor.createFromTouchTap(ev)));
    }
    flashElements(context) {
        const viewport = context.viewport;
        if (this.currHit) {
            if (this.needsFlash(viewport))
                this.flashHitInView(this.currHit, context);
            return;
        }
        const hit = IModelApp_1.IModelApp.tentativePoint.getCurrSnap();
        if (hit)
            hit.draw(context);
    }
    decorate(context) {
        if (undefined !== this.touchCursor)
            context.addCanvasDecoration(this.touchCursor, true);
        this.flashElements(context);
        if (this.cross.isActive) {
            this.cross.decorate(context);
            this.icon.decorate(context);
        }
        this.errorIcon.decorate(context);
    }
    clearElemFromHitList(element) {
        if (this.aSnapHits)
            this.aSnapHits.removeHitsFrom(element);
    }
    clearIfElement(sourceId) {
        this.clearElemFromHitList(sourceId);
        const hit = this.currHit;
        if (hit && hit.sourceId === sourceId) {
            this.destroy();
        }
    }
    /** Enable locating elements. */
    enableLocate(yesNo) { this.toolState.locate = yesNo; }
    /** Called whenever a new [[Tool]] is started. */
    onStartTool() {
        this.initCmdState();
        this.enableSnap(false);
        this.enableLocate(false);
        IModelApp_1.IModelApp.tentativePoint.clear(true);
    }
    /**
     * Force AccuSnap to reevaluate the snap at the current cursor location.
     * This is useful of an application changes the snap mode and wants AccuSnap to choose it immediately, without
     * requiring the user to move the mouse.
     */
    async reEvaluate() {
        if (this.getCurrSnapDetail()) {
            const ev = new Tool_1.BeButtonEvent();
            IModelApp_1.IModelApp.toolAdmin.fillEventFromCursorLocation(ev);
            return this.onMotion(ev);
        }
    }
}
// exports.AccuSnap = AccuSnap;
class TentativeOrAccuSnap {
    static get isHot() { return IModelApp_1.IModelApp.accuSnap.isHot || IModelApp_1.IModelApp.tentativePoint.isSnapped; }
    static getCurrentSnap(checkIsHot = true) {
        // Checking for a hot AccuSnap hit before checking tentative is probably necessary for extended intersections?
        if (IModelApp_1.IModelApp.accuSnap.isHot)
            return IModelApp_1.IModelApp.accuSnap.getCurrSnapDetail();
        if (IModelApp_1.IModelApp.tentativePoint.isSnapped)
            return IModelApp_1.IModelApp.tentativePoint.currSnap;
        return (checkIsHot ? undefined : IModelApp_1.IModelApp.accuSnap.getCurrSnapDetail());
    }
    static getCurrentPoint() {
        if (IModelApp_1.IModelApp.accuSnap.isHot) {
            const snap = IModelApp_1.IModelApp.accuSnap.getCurrSnapDetail();
            if (snap)
                return snap.adjustedPoint;
        }
        return IModelApp_1.IModelApp.tentativePoint.getPoint();
    }
    static getCurrentView() {
        const snap = IModelApp_1.IModelApp.accuSnap.getCurrSnapDetail();
        return snap ? snap.viewport : IModelApp_1.IModelApp.tentativePoint.viewport;
    }
}
// exports.TentativeOrAccuSnap = TentativeOrAccuSnap;
(function (AccuSnap) {
    class ToolState {
        constructor() {
            this.enabled = false;
            this.locate = false;
            this.suspended = 0;
        }
        setFrom(other) {
            this.enabled = other.enabled;
            this.locate = other.locate;
            this.suspended = other.suspended;
        }
        clone() { const val = new ToolState(); val.setFrom(this); return val; }
    }
    AccuSnap.ToolState = ToolState;
    class Settings {
        constructor() {
            this.hotDistanceFactor = 1.2;
            this.stickyFactor = 1.0;
            this.searchDistance = 2.0;
            this.hiliteColdHits = true;
            this.enableFlag = true;
            this.toolTip = true;
            this.toolTipDelay = bentleyjs_core_1.BeDuration.fromSeconds(.5); // delay before tooltip pops up
        }
    }
    AccuSnap.Settings = Settings;
})(AccuSnap || {});
//# sourceMappingURL=AccuSnap.js.map

export {TouchCursor, AccuSnap,TentativeOrAccuSnap} ;