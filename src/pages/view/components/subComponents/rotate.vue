<template>
    <div>
        <i class="iconfont icon-rotate_left" @click="rotate">
            
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'rotate',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        rotate(){
            IModelApp.tools.run("View.Rotate", this.GLOBAL_DATA.theViewPort);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>