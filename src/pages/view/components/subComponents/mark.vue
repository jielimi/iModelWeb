<template>
    <div>
        <i class="iconfont icon-mark" @click="mark">
        </i>
    </div>
</template>

<script>
import { IModelApp ,SnapMode,TileAdmin,AccuSnap, NotificationManager} from "@bentley/imodeljs-frontend";

import { MarkTool } from "./mark/iModelWebMarkTool";

import {PrimitiveTool} from "@bentley/imodeljs-frontend"



export default {
    name: 'imodelmark',
    data () {
        return {
            active: false
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
                MarkTool.cancelMark();
            }
            
        },
        
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>