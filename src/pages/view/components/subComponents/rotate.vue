<template>
    <div>
        <i class="iconfont icon-Directions-" @click="rotate">
            
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
            IModelApp.tools.run("View.Rotate", IModelApp.viewManager.selectedView);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>