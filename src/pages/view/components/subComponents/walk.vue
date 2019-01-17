<template>
    <div>
        <i class="iconfont icon-walk" @click="walk"></i>
    </div>
</template>

<script>
export default {
    name: 'walk',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        walk(){
            window.eventHub.$emit('Walk');
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>