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
            
        };
    },
    components: {
        
    },
    created () {
        
    },
    methods: {
        mark() {
            IModelApp.tools.run("iModelWeb.Mark")
        },
        
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>