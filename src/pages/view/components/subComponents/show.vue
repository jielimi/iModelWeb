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
            this.GLOBAL_DATA.theViewPort.clearNeverDrawn();
            this.GLOBAL_DATA.activeViewState.iModelConnection.selectionSet.emptyAll();
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>