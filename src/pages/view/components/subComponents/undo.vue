<template>
    <div>
        <i class="iconfont icon-iosundooutline" @click="undo"></i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'undo',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        undo(){
            IModelApp.tools.run("View.Undo", this.GLOBAL_DATA.theViewPort);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>