<template>
    <div>
        <i  class="iconfont icon-qianbi" @click="draw">
        </i>
        
    </div>
</template>

<script>
import { IModelApp,EventHandled } from "@bentley/imodeljs-frontend";
import { MarkupApp } from "@bentley/imodeljs-markup";
import { SelectTool } from "@bentley/imodeljs-markup";


export default {
    name: 'graffiti',
    data () {
        return {
            drawGraffiti:true
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        register(toolNamespace){
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
            GraffitiTool.register(toolNamespace);
        },
        async draw(){
           
            if(this.drawGraffiti){
                IModelApp.tools.run("iModelWeb.graffiti")
                MarkupApp.props.active.element.stroke = "white"; // as an example, set default color for elements
                MarkupApp.markupSelectToolId = "iModelWeb.graffiti"; // as an example override the default markup select tool to launch redline tools using key events
                await MarkupApp.start(IModelApp.viewManager.selectedView);
            }else{
                const startMarkupSelect = IModelApp.toolAdmin.defaultToolId === MarkupApp.markupSelectToolId && (undefined === IModelApp.toolAdmin.activeTool || MarkupApp.markupSelectToolId !== IModelApp.toolAdmin.activeTool.toolId);
                if (startMarkupSelect) {
                    IModelApp.toolAdmin.startDefaultTool();
                    return;
                }
                MarkupApp.props.result.maxWidth = 1500;
                
                const markupData = await MarkupApp.stop();
            }
            this.drawGraffiti = !this.drawGraffiti;
        },
        
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>