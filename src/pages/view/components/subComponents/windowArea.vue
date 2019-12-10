<template>
    <div>
        <i class="iconfont icon-search2" @click="windowArea"></i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'window-area',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        windowArea() {
            IModelApp.tools.run("View.WindowArea", IModelApp.viewManager.selectedView);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>