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
import { ViewState } from "@bentley/imodeljs-frontend";
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
        async selectChange(view){
            if (!(view instanceof ViewState)) {
                view = await  this.GLOBAL_DATA.activeViewState.iModelConnection.views.load(view.id);
            }
            await this.GLOBAL_DATA.theViewPort.changeView(view);
            await this.notify(view.clone());
            this.value = view.name;
        },
        async notify(view) {
            this.GLOBAL_DATA.activeViewState.viewState = view;
            window.eventHub.$emit('categories_init');
            window.eventHub.$emit('render_mode_init');
            window.eventHub.$emit('categories_viewList_change');
            
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