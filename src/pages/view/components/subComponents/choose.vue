<template>
    <div>
        <i class="iconfont icon-Select" @click="choose">
            
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'choose',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        choose(){
            IModelApp.tools.run("View.Select", GLOBAL_DATA.theViewPort);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>