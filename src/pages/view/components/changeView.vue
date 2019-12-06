<template>
    <div class="change-view">
        <el-select v-model="value" placeholder="Select" @change="selectChange">
            <el-option
            v-for="item in viewList"
            :key="item.id"
            :label="item.name"
            :value="item">
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { ViewState } from "@bentley/imodeljs-frontend";
import { SimpleViewApp } from "../../lib/SimpleViewApp";
export default {
    name: 'changeView',
    data () {
        return {
            viewList: [],
            value: ''
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('viewList_init',this.getViewList);
    },
    methods: {
        getViewList(viewList){
            this.viewList = viewList;
            this.value = this.viewList[0].name
        },
        async selectChange(item){
            const viewSpec = this.viewList.find(i => i.id === item.id);

            if (!viewSpec) return;
            const view = await SimpleViewApp.connection.views.load(viewSpec.id);
            const viewState = view.clone();
            SimpleViewApp.viewport.changeView(viewState);
            SimpleViewApp.viewState = viewState;
            this.value = item.name;

        },
        async notify(view) {
            SimpleViewApp.activeViewState.viewState = view;
            window.eventHub.$emit('categories_init');
            window.eventHub.$emit('render_mode_init');
            window.eventHub.$emit('render_model_init');
        }
    }
    
}
</script>

<style lang="less" scoped>
.change-view {
    margin-left: 5px;
};
</style>