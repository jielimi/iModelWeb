<template>
    <div >
        <i v-if="drawGraffiti" class="iconfont icon-qianbi" @click="draw">
        </i>
         <i v-else class="iconfont icon-qianbi" @click="stop">
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
import { MarkupApp } from "@bentley/imodeljs-markup";


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
        async draw(){
            this.drawGraffiti = !this.drawGraffiti;
            IModelApp.tools.run("iModelWeb.graffiti")

            MarkupApp.props.active.element.stroke = "white"; // as an example, set default color for elements
            MarkupApp.markupSelectToolId = "iModelWeb.graffiti"; // as an example override the default markup select tool to launch redline tools using key events
            
            await MarkupApp.start(IModelApp.viewManager.selectedView);
        },
        async stop() {
            this.drawGraffiti = !this.drawGraffiti;
            const startMarkupSelect = IModelApp.toolAdmin.defaultToolId === MarkupApp.markupSelectToolId && (undefined === IModelApp.toolAdmin.activeTool || MarkupApp.markupSelectToolId !== IModelApp.toolAdmin.activeTool.toolId);
            if (startMarkupSelect) {
                IModelApp.toolAdmin.startDefaultTool();
                return;
            }
            MarkupApp.props.result.maxWidth = 1500;
            const markupData = await MarkupApp.stop();

            let parent = document.getElementById("imodelview");
            let htmlCanvas = parent.children[0].children[0];
            let dataURL = htmlCanvas.toDataURL(); 
            // console.log(dataURL);
            window.open(dataURL)   
            
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>