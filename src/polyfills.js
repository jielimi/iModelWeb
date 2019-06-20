import { HitDetail, IModelApp } from "@bentley/imodeljs-frontend";

HitDetail.prototype.getToolTip = async function() {

    if (!this.isElementHit)

        return IModelApp.viewManager.getDecorationToolTip(this);

    const msg = await this.viewport.iModel.getToolTipMessage(this.sourceId); // wait for the locate message(s) from the backend

    // now combine all the lines into one string, replacing any instances of ${tag} with the translated versions.

    // Add "<br>" at the end of each line to cause them to come out on separate lines in the tooltip.

    return msg;

};
