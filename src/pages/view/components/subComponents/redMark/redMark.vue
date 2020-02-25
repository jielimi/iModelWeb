<template>
    <div>
        <i class="iconfont icon-mark" @click="mark">
        </i>
    </div>
    
</template>

<script>
import { IncidentMarkerDemo } from "./incentMaker"

import { IModelApp } from "@bentley/imodeljs-frontend";

export default {
    name: 'imodelmark',
    data () {
        return {
            tips:'hello',
            
        };
    },
    components: {
        
    },
    created () {
        
    },
    methods: {
        mark() {
            this.active = !this.active;
            if(this.active){
                IModelApp.tools.run("iModelWeb.Mark");
            }else{
                IncidentMarkerDemo.cancel()
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>