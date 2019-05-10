/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { AngleSweep, Arc3d, Point2d, Point3d, XAndY, XYAndZ } from "@bentley/geometry-core";
import { AxisAlignedBox3d, ColorByName, ColorDef } from "@bentley/imodeljs-common";
import {
  BeButton, BeButtonEvent, Cluster, DecorateContext, GraphicType, imageElementFromUrl,
  IModelApp, Marker, MarkerImage, MarkerSet, MessageBoxIconType, MessageBoxType,
} from "@bentley/imodeljs-frontend";

class IncidentMarker extends Marker {

  constructor(location, severity, id, icon) {
    super(location, Point2d.create(30, 30));
    this._imageSize = Point2d.create(40, 40);
    this._imageOffset = Point2d.create(0, 30);
    this._sweep360 = AngleSweep.create360();
    this.setImage(icon); // save icon
    this.imageOffset = IncidentMarker._imageOffset; // move icon up by 30 pixels
    this.imageSize = IncidentMarker._imageSize; // 40x40
    this.labelFont = "italic 14px san-serif"; // use italic so incidents look different than Clusters
    this.title = ""; // tooltip
    this.setScaleFactor({ low: .2, high: 1.4 }); // make size 20% at back of frustum and 140% at front of frustum (if camera is on)
  }

  addMarker(context) {
    super.addMarker(context);
    const builder = context.createGraphicBuilder(GraphicType.WorldDecoration);
    const ellipse = Arc3d.createScaledXYColumns(this.worldLocation, context.viewport.rotation.transpose(), .2, .2, IncidentMarker._sweep360);
    context.addDecorationFromBuilder(builder);
  }
}
/** This demo shows how to use MarkerSets to cluster markers that overlap on the screen. It creates a set of 500
 * "incidents" at random locations within the ProjectExtents. For each incident, it creates an IncidentMarker with an Id and
 * with a random value between 1-30 for "severity", and one of 5 possible icons.
 */
class IncidentClusterMarker extends Marker {
   drawFunc(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this._clusterColor;
    ctx.fillStyle = "white";
    ctx.lineWidth = 5;
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  /** Create a new cluster marker with label and color based on the content of the cluster */
  constructor(location, size, cluster, image) {
    super(location, size);
    this._clusterColor=''
    // get the top 10 incidents by severity
    const sorted = [];
    const maxLen = 10;
    cluster.markers.forEach((marker) => {
      if (maxLen > sorted.length || marker.severity > sorted[sorted.length - 1].severity) {
        const index = sorted.findIndex((val) => val.severity < marker.severity);
        if (index === -1)
          sorted.push(marker);
        else
          sorted.splice(index, 0, marker);
        if (sorted.length > maxLen)
          sorted.length = maxLen;
      }
    });

    this.imageOffset = new Point3d(0, 28);
    this.imageSize = new Point2d(30, 30);
    this.label = cluster.markers.length.toLocaleString();
    this.labelColor = "black";
    this.labelFont = "bold 14px san-serif";

    let title = "";
    sorted.forEach((marker) => {
      if (title !== "")
        title += "<br>";
      title += "Severity: " + marker.severity + " Id: " + marker.id;
    });
    if (cluster.markers.length > maxLen)
      title += "<br>...";

    this.title = title;
    this._clusterColor = IncidentMarker.makeColor(sorted[0].severity).toHexString();
    this.setImage(image);
  }
}

class IncidentMarkerSet extends MarkerSet {
   getClusterMarker(cluster){
    return IncidentClusterMarker.makeFrom(cluster.markers[0], cluster, IncidentMarkerDemo.warningSign);
  }
}

var IncidentMarkerDemo = /** @class */ (function () {
  function IncidentMarkerDemo(extents) {
    var svg = document.getElementById("testSvg");
    this._incidents = new IncidentMarkerSet();
      
      var pos = new  Point3d();
      for (var i = 0; i < 1; ++i) {
          pos.x = extents.x;
          pos.y = extents.y;
          pos.z = extents.z;
          this._incidents.markers.add(new IncidentMarker(pos, 1 + Math.round(Math.random() * 29), i, svg));
      }
  }
  /** We added this class as a ViewManager.decorator below. This method is called to ask for our decorations. We add the MarkerSet. */
  IncidentMarkerDemo.prototype.decorate = function (context) {
      if (context.viewport.view.isSpatialView()){
        this._incidents.addDecoration(context);
      }
  };
  IncidentMarkerDemo.decoratorArr = [];
  /** Turn the markers on and off. Each time it runs it creates a new random set of incidents. */
  IncidentMarkerDemo.toggle = function (extents) {
    IncidentMarkerDemo._decorator = new IncidentMarkerDemo(extents);
    IModelApp.viewManager.addDecorator(IncidentMarkerDemo._decorator);
    IncidentMarkerDemo.decoratorArr.push(IncidentMarkerDemo._decorator);
  };
  IncidentMarkerDemo.cancle = function(){
    for(var i=0;i<IncidentMarkerDemo.decoratorArr.length;i++){
      IModelApp.viewManager.dropDecorator(IncidentMarkerDemo.decoratorArr[i]);
    }
    IncidentMarkerDemo.decoratorArr[i] = undefined;
    IModelApp.toolAdmin.startDefaultTool();
  }
  return IncidentMarkerDemo;
}());

export {IncidentMarkerDemo};
