<template>
    <div @click="startfit">
        <i class="iconfont icon-cc-contraction" style="display: inline-block;"></i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";

export default {
    name: 'fitToView',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        startfit(){
            IModelApp.tools.run("View.Fit", IModelApp.viewManager.selectedView, true);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>