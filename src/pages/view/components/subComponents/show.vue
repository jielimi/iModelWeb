<template>
    <div>
        <i class="iconfont icon-xianshi" @click="show">
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'show',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        show(){
            let vp = IModelApp.viewManager.selectedView;
            IModelApp.viewManager.selectedView.clearNeverDrawn();
            IModelApp.viewManager.selectedView.iModel.selectionSet.emptyAll();
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>