import { Point2d, Point3d} from "@bentley/geometry-core";
import { IModelApp, Marker} from "@bentley/imodeljs-frontend";

class roadRoamMaker extends Marker {

  constructor(location, icon, tips) {
    super(location, Point2d.create(30, 30));
    this.imageOffset = Point2d.create(0, 20); // move icon up by 30 pixels
    this.imageSize = Point2d.create(30, 30); // 40x40
    this.labelFont = "italic 14px san-serif";

    this.title =  tips;
    this.setImage(icon); // save icon
    this.labelFont = "italic 14px san-serif"; // use italic so incidents look different than Clusters
  }  
}

class roadRoamMakerDecorator {
    constructor(location){
        this._icon = document.createElement("img");
        this._icon.src = require("./marker.svg");
        var pos = new  Point3d();
        pos.x = location.x;
        pos.y = location.y;
        pos.z = location.z;
        this.maker = new roadRoamMaker(location, this._icon, "tip")
        
        if (IModelApp.viewManager.selectedView) {
            this._removal = IModelApp.viewManager.selectedView.onChangeView.addOnce(() => this.clear());
        }
    }

    decorate = function (context) {
        if (context.viewport.view.isSpatialView()){
          this.maker.addDecoration(context);
        }
    };
    static createMaker(location){
        roadRoamMakerDecorator._decorator = new roadRoamMakerDecorator(location);
        IModelApp.viewManager.addDecorator(roadRoamMakerDecorator._decorator);
        roadRoamMakerDecorator._decorators.push(roadRoamMakerDecorator._decorator);
    }
    static clear(){
        for(let item of roadRoamMakerDecorator._decorators){
            IModelApp.viewManager.dropDecorator(item)
        }
        
        roadRoamMakerDecorator._decorators = [];
    }
}

roadRoamMakerDecorator._decorators = [];


export {
    roadRoamMakerDecorator
}