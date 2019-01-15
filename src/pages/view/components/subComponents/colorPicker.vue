<template>
    <div class="color-picker">
         <el-color-picker v-model="color"></el-color-picker>
    </div>
</template>

<script>
export default {
    name: 'colorPicker',
    data () {
        return {
            color: '#409EFF',
        };
    },
    components: {
        
    },
    created () {},
    methods: {
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.color-picker{
    height: 42px;
    width: 42px;
    margin-left: 5px;
    .el-color-picker--small .el-color-picker__trigger{
        height: 42px;
        width: 42px;
    }
}

</style>