<template>
    <div @click="startfit" style="display:inline-block">
        <i class="iconfont icon-cc-contraction"></i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";

export default {
    name: 'fitToView',
    data () {
        return {
            index:0
        };
    },
    components: {
        
    },
    props:['id'],
    created () {},
    methods: {
        startfit(){
            if(IModelApp.viewManager._viewports.length === 1){
                this.index = 0;
            }else {
                this.index = IModelApp.viewManager._viewports[0].parentDiv.id === this.id ? 0:1;
            }
            
            IModelApp.tools.run("View.Fit", IModelApp.viewManager._viewports[this.index], true);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>