<template>
    <div>
        <i class="iconfont icon-walk" @click="walk"></i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'walk',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        walk(){
            IModelApp.tools.run("View.Walk", GLOBAL_DATA.theViewPort);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>