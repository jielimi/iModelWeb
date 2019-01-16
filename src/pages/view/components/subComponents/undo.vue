<template>
    <div>
        <i class="iconfont icon-iosundooutline" @click="undo"></i>
    </div>
</template>

<script>
export default {
    name: 'undo',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        undo(){
            window.eventHub.$emit('undo');
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>