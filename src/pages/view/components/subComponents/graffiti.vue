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
                        // case "1":
                        //     const symbol1 = getSvgFile("Warning_sign.svg");
                        //     if (undefined === symbol1)
                        //     return EventHandled.No;
                        //     tools.run("Markup.Symbol", symbol1);
                        //     return EventHandled.Yes;
                        // case "2":
                        //     const symbol2 = getSvgFile("window-area.svg");
                        //     if (undefined === symbol2)
                        //     return EventHandled.No;
                        //     tools.run("Markup.Symbol", symbol2, true);
                        //     return EventHandled.Yes;
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