import { IModelApp,EventHandled } from "@bentley/imodeljs-frontend";

import { SelectTool } from "@bentley/imodeljs-markup";

class GraffitiTool extends SelectTool {
    async onKeyTransition(wentDown, key) {
        if (EventHandled.Yes === await super.onKeyTransition(wentDown, key))
        return EventHandled.Yes;
        if (!wentDown)
        return EventHandled.No;
        const tools = IModelApp.tools;
        switch (key.key.toLowerCase()) {
            case "a":
                tools.run("Markup.Arrow");
                return EventHandled.Yes;
            case "c":
                tools.run("Markup.Circle");
                return EventHandled.Yes;
            case "d":
                tools.run("Markup.Distance");
                return EventHandled.Yes;
            case "e":
                tools.run("Markup.Ellipse");
                return EventHandled.Yes;
            case "l":
                tools.run("Markup.Line");
                return EventHandled.Yes;
            case "o":
                tools.run("Markup.Cloud");
                return EventHandled.Yes;
            case "p":
                tools.run("Markup.Polygon");
                return EventHandled.Yes;
            case "r":
                tools.run("Markup.Rectangle");
                return EventHandled.Yes;
            case "s":
                tools.run("Markup.Sketch");
                return EventHandled.Yes;
            case "t":
                tools.run("Markup.Text.Place");
                return EventHandled.Yes;
            case "1":
                let string = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' +
                            '<circle cx="100" cy="50" r="50" stroke="black" stroke-width="2" fill="red" />'+
                            '</svg>'
                tools.run("Markup.Symbol", string);
                return EventHandled.Yes;
            case "2":
                let string1 = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' +
                            '<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/>'+
                            '</svg>'
                tools.run("Markup.Symbol", string1,true);
                return EventHandled.Yes; 
            }
            return EventHandled.No;
        }
    }
    GraffitiTool.toolId = "iModelWeb.graffiti";

    export {
        GraffitiTool
    }