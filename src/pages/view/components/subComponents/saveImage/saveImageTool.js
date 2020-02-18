import { Tool, IModelApp, imageBufferToPngDataUrl, openImageDataUrlInNewWindow } from "@bentley/imodeljs-frontend";
import { Point2d } from "@bentley/geometry-core";
function saveImage(vp) {
    const buffer = vp.readImage(undefined, new Point2d(768, 768), true);
    if (undefined === buffer) {
        alert("Failed to read image");
        return;
    }
    const url = imageBufferToPngDataUrl(buffer, false);
    if (undefined === url) {
        alert("Failed to produce PNG");
        return;
    }
    openImageDataUrlInNewWindow(url, "Saved View");
}
export class SaveImageTool extends Tool {
    run(_args) {
        const vp = IModelApp.viewManager.selectedView;
        if (undefined !== vp) {
            saveImage(vp);
        }
        return true;
    }
}
SaveImageTool.toolId = "SaveImage";