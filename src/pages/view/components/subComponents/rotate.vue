<template>
    <div>
        <i class="iconfont icon-rotate_left" @click="rotate">
            
        </i>
    </div>
</template>

<script>
export default {
    name: 'rotate',
    data () {
        return {
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        rotate(){
            window.eventHub.$emit('Rotate');
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>