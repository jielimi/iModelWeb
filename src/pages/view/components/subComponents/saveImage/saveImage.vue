<template>
    <div>
        <i class="iconfont icon-yincang" @click="saveImage">
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
import { SaveImageTool } from "./saveImageTool"
export default {
    name: 'saveImage',
    data () {
        return {
            
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        saveImage(){
           IModelApp.tools.run(SaveImageTool.toolId);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>