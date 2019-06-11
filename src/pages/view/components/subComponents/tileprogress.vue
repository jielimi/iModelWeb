<template>
    <div class='progress'>
        <progress :value=percentage max="100" ></progress>
    </div>
</template>

<script>
// import { BeEvent } from "@bentley/bentleyjs-core";
export default {
    name: 'tileprogress',
    data () {
        return {
            percentage:0,
            vp:'',
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('tile_progress_init',this.addListener)
    },
    methods: {
        addListener(){
           this.vp = this.GLOBAL_DATA.theViewPort
           this.vp.onRender.addListener((vp)=>this.update());
           
        },
         update() {
            const requested = this.vp.numRequestedTiles;
            const ready = this.vp.numReadyTiles;
            const total = ready + requested;
            const pctComplete = (total > 0) ? (ready / total) : 1.0;
            this.percentage= pctComplete.toFixed(2)*100;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .progress{
        width: 200px;
        position: absolute;
        right: 5px;
        .el-progress-bar__inner{
            background-image:none!important
        }
    }

</style>