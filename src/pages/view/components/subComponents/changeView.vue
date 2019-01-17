<template>
    <div class="change-view">
        <el-select v-model="value" placeholder="Select" @change="selectChange">
            <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item">
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: 'changeView',
    data () {
        return {
            options: [],
            value: ''
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('categories_viewList_init',this.getViewList);
    },
    methods: {
        getViewList(viewList){
            this.options = viewList;
            this.value = this.options[0].name
        },
        selectChange(item){
           window.eventHub.$emit('categories_viewList_change',item);
           this.value = item.name;
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.change-view {
    margin-left: 5px;
};


</style>