<template>
    <div>
        <i class="iconfont icon-icon--" @click="zoomToSelectedElements"></i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'zoomin',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        async zoomToSelectedElements(){
            const elems =  this.GLOBAL_DATA.activeViewState.iModelConnection.selectionSet.elements;
            if (0 < elems.size)
                await this.GLOBAL_DATA.theViewPort.zoomToElements(elems);
            }
            
        }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>