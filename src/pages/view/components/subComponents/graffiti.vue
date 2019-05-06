<template>
    <div>
        <i class="iconfont icon-qianbi" @click="draw">
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
            
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        async draw(){
            IModelApp.tools.run("iModelWeb.graffiti")

            MarkupApp.props.active.element.stroke = "white"; // as an example, set default color for elements
            MarkupApp.markupSelectToolId = "iModelWeb.graffiti"; // as an example override the default markup select tool to launch redline tools using key events
            await MarkupApp.start(this.GLOBAL_DATA.theViewPort);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>