import { HitDetail, IModelApp } from "@bentley/imodeljs-frontend";
import { RealityModelTileClient } from "@bentley/imodeljs-frontend/lib/tile/RealityModelTileTree";
import { Guid } from "@bentley/bentleyjs-core";
import Dom from "@bentley/imodeljs-markup/node_modules/@svgdotjs/svg.js/src/elements/Dom";
import * as utils from '@bentley/imodeljs-markup/node_modules/@svgdotjs/svg.js/src/utils/utils';

HitDetail.prototype.getToolTip = async function() {
  
    
    if (!this.isElementHit)

        return IModelApp.viewManager.getDecorationToolTip(this);

    const msg = await this.viewport.iModel.getToolTipMessage(this.sourceId); // wait for the locate message(s) from the backend

    // now combine all the lines into one string, replacing any instances of ${tag} with the translated versions.

    // Add "<br>" at the end of each line to cause them to come out on separate lines in the tooltip.

    return msg[0];

};

RealityModelTileClient.prototype.parseUrl = function(url) {
    const urlParts = url.split("/").map((entry) => entry.replace(/%2D/g, "-"));
    const tilesId = urlParts.find(Guid.isGuid);
    let props;
    if (undefined !== tilesId) {
        let projectId = urlParts.find((val) => val.includes("--"));
        if (projectId !== undefined) {
            projectId = projectId.split("--")[1];
            // ###TODO This is a temporary workaround for accessing the reality meshes with a test account
            // The hardcoded project id corresponds to a project setup to yied access to the test account which is linked to the tileId
            if (projectId === "Server")
                projectId = "fb1696c8-c074-4c76-a539-a5546e048cc6";
            props = { projectId, tilesId };
        }            
    }
    return props;
};

Dom.prototype.children = function() {
    return new List(utils.map(this.node.children, function (node) {
        return adopt(node)
    }))
};
