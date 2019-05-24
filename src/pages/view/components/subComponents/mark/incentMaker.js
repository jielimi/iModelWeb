/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { AngleSweep, Point2d, Point3d} from "@bentley/geometry-core";

import {
 GraphicType,  IModelApp, Marker} from "@bentley/imodeljs-frontend";

class IncidentMarker extends Marker {

  constructor(location, icon) {
    super(location, Point2d.create(30, 30));
    this._imageSize = Point2d.create(80, 80);
    this._imageOffset = Point2d.create(0, 30);
    this._sweep360 = AngleSweep.create360();
    this.setImage(icon); // save icon
    this.imageOffset = IncidentMarker._imageOffset; // move icon up by 30 pixels
    this.imageSize = IncidentMarker._imageSize; // 40x40
    this.labelFont = "italic 14px san-serif"; // use italic so incidents look different than Clusters
    this.setScaleFactor({ low: .2, high: 1.4 }); // make size 20% at back of frustum and 140% at front of frustum (if camera is on)
  }

  addMarker(context) {
    super.addMarker(context);
    const builder = context.createGraphicBuilder(GraphicType.WorldDecoration);
    //const ellipse = Arc3d.createScaledXYColumns(this.worldLocation, context.viewport.rotation.transpose(), .2, .2, IncidentMarker._sweep360);
    context.addDecorationFromBuilder(builder);
  }
}

var IncidentMarkerDemo = (function () {
  function IncidentMarkerDemo(extents) {
    var svg = document.getElementById("testSvg");
    var pos = new  Point3d();
    pos.x = extents.x;
    pos.y = extents.y;
    pos.z = extents.z;
    this._incidents = new IncidentMarker(pos, svg)
      
  }
  /** We added this class as a ViewManager.decorator below. This method is called to ask for our decorations. We add the MarkerSet. */
  IncidentMarkerDemo.prototype.decorate = function (context) {
      if (context.viewport.view.isSpatialView()){
        this._incidents.addDecoration(context);
      }
  };
  IncidentMarkerDemo.decoratorArr = [];
  //let points = [];
  
  /** Turn the markers on and off. Each time it runs it creates a new random set of incidents. */

  IncidentMarkerDemo.toggle = function (extents) {
    IncidentMarkerDemo._decorator = new IncidentMarkerDemo(extents);
    
    //var indexOfPoints = points.indexOf(extents)
    // if( indexOfPoints > -1){
    //   // points.splice(indexOfPoints,1)
    //   IModelApp.viewManager.dropDecorator(IncidentMarkerDemo.decoratorArr[indexOfPoints].decorate);
    // }else{
    //   points.push(extents);
      IModelApp.viewManager.addDecorator(IncidentMarkerDemo._decorator);
      IncidentMarkerDemo.decoratorArr.push(IncidentMarkerDemo._decorator);
    // }
  };
 
  IncidentMarkerDemo.cancle = function(){
    for(var i=0;i<IncidentMarkerDemo.decoratorArr.length;i++){
      IModelApp.viewManager.dropDecorator(IncidentMarkerDemo.decoratorArr[i]);
    }
    IModelApp.toolAdmin.startDefaultTool();
  }
  return IncidentMarkerDemo;
}());

export {IncidentMarkerDemo};
