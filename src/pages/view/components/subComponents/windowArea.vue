<template>
    <div>
        <i class="iconfont icon-search2" @click="windowArea"></i>
    </div>
</template>

<script>
export default {
    name: 'window-area',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        windowArea() {
            window.eventHub.$emit('windowArea');
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>