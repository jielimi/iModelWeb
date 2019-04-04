<template>
    <div>
        <i class="iconfont icon-yincang" @click="hide">
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'hide',
    data () {
        return {
            hiddenSet:new Set()
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        hide(){
           let selectSet = this.GLOBAL_DATA.activeViewState.iModelConnection.selectionSet.elements;
           let allHiddenSet = new Set([...this.hiddenSet,...selectSet]);
           this.hiddenSet = allHiddenSet;
           this.GLOBAL_DATA.theViewPort.view.setNeverDrawn(allHiddenSet);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>