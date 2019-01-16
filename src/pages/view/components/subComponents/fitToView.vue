<template>
    <div @click="startfit">
        <i class="iconfont icon-iostoggleoutline1"></i>
    </div>
</template>

<script>
export default {
    name: 'fitToView',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        startfit(){
            window.eventHub.$emit('fitToView');
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>