<template>
    <div>
        <i class="iconfont icon-iosredooutline" @click="redo"></i>
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
        redo(){
            window.eventHub.$emit('Redo');
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>