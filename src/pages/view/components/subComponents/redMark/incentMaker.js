/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { Point2d, Point3d} from "@bentley/geometry-core";
import { AngleSweep, Arc3d, XAndY, XYAndZ } from "@bentley/geometry-core";
import { ColorDef } from "@bentley/imodeljs-common";

import { BeButton,GraphicType,  IModelApp, Marker} from "@bentley/imodeljs-frontend";

class IncidentMarker extends Marker {

  constructor(location, icon, tips) {
    super(location, Point2d.create(30, 30));
    //this.imageOffset = Point2d.create(0, 30); // move icon up by 30 pixels
    this.imageSize = Point2d.create(30, 30); // 40x40
    this.labelFont = "italic 14px san-serif";

    this.title =  tips;
    this.setImage(icon); // save icon
    this.labelFont = "italic 14px san-serif"; // use italic so incidents look different than Clusters
    //this.setScaleFactor({ low: .2, high: 1.4 }); // make size 20% at back of frustum and 140% at front of frustum (if camera is on)
  }

  addMarker(context) {
    const _sweep360 = AngleSweep.create360();
    super.addMarker(context);

    const builder = context.createGraphicBuilder(GraphicType.WorldDecoration);
    const ellipse = Arc3d.createScaledXYColumns(this.worldLocation, context.viewport.rotation.transpose(), 0.1, 0.1, _sweep360);
    builder.setSymbology(ColorDef.white, ColorDef.red, 1);
    builder.addArc(ellipse, false, false);
    builder.setBlankingFill(ColorDef.red);
    builder.addArc(ellipse, true, true);
    context.addDecorationFromBuilder(builder);
  }
  onMouseEnter(ev) {
    console.log(this.title);
  };
  
  // drawFunc(ctx) {
  //   ctx.beginPath();
  //   ctx.strokeStyle = "#ff0000";
  //   ctx.fillStyle = "white";
  //   ctx.lineWidth = 5;
  //   ctx.arc(0, 0, 13, 0, Math.PI * 2);
  //   ctx.fill();
  //   ctx.stroke();
  // }

  onMouseButton(ev) {
    if (ev.button === BeButton.Reset) {
      IncidentMarkerDemo.delete(this.worldLocation);
    }
    return true;
  }
}

var IncidentMarkerDemo = (function () {
  function IncidentMarkerDemo(extents,tips) {
    var svg = document.getElementById("testSvg");
    var pos = new  Point3d();
    pos.x = extents.x;
    pos.y = extents.y;
    pos.z = extents.z;
    this._incidents = new IncidentMarker(pos, svg, tips)
      
  }
  /** We added this class as a ViewManager.decorator below. This method is called to ask for our decorations. We add the MarkerSet. */
  IncidentMarkerDemo.prototype.decorate = function (context) {
      if (context.viewport.view.isSpatialView()){
        this._incidents.addDecoration(context);
      }
  };
  IncidentMarkerDemo.decoratorArr = [];
  let points = [];
  let vp = {};
  
  /** Turn the markers on and off. Each time it runs it creates a new random set of incidents. */
  IncidentMarkerDemo.delete = function(extents) {
    var indexOfPoints = -1;
   
    for(var i=0;i<points.length;i++){
      if(JSON.stringify(points[i]) === JSON.stringify(extents)){
        indexOfPoints = i;
        break;
      }
    }
    if( indexOfPoints !== -1  ){
      points.splice(indexOfPoints,1);
      IModelApp.viewManager.dropDecorator(IncidentMarkerDemo.decoratorArr[indexOfPoints]);
      IncidentMarkerDemo.decoratorArr.splice(indexOfPoints,1);
    }
  }

  IncidentMarkerDemo.toggle = function (extents,tips) {
      points.push(extents);
      IncidentMarkerDemo._decorator = new IncidentMarkerDemo(extents,tips);
      IModelApp.viewManager.addDecorator(IncidentMarkerDemo._decorator);
      IncidentMarkerDemo.decoratorArr.push(IncidentMarkerDemo._decorator);
    
  }
  IncidentMarkerDemo.undo = function() {
    const length = IncidentMarkerDemo.decoratorArr.length;
    if(length === 0) return;
    IModelApp.viewManager.dropDecorator(IncidentMarkerDemo.decoratorArr[length-1]);
    IncidentMarkerDemo.decoratorArr.pop()

  }
  IncidentMarkerDemo.cancle = function(){
    for(var i=0;i<IncidentMarkerDemo.decoratorArr.length;i++){
      IModelApp.viewManager.dropDecorator(IncidentMarkerDemo.decoratorArr[i]);
    }
    IModelApp.toolAdmin.startDefaultTool();
  }
  return IncidentMarkerDemo;
}());

export {IncidentMarkerDemo};
