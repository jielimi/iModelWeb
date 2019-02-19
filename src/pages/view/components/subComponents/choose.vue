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
            console.log(this.GLOBAL_DATA.activeViewState.iModelConnection.selectionSet);
            console.log(this.GLOBAL_DATA.theViewPort);
            // "0x2000000039b"
            //this.GLOBAL_DATA.theViewPort.view.setNeverDrawn(this.GLOBAL_DATA.activeViewState.iModelConnection.selectionSet.elements)
            IModelApp.tools.run("View.Select", this.GLOBAL_DATA.theViewPort);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>