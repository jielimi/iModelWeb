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
        window.eventHub.$on('viewList_init',this.getViewList);
    },
    methods: {
        getViewList(viewList){
            this.options = viewList;
            this.value = this.options[0].name
        },
        async selectChange(view){
            this.value = view.name;
            if (!(view instanceof ViewState)) {
                view = await  GLOBAL_DATA.activeViewState.iModelConnection.views.load(view.id);
            }
            await GLOBAL_DATA.theViewPort.changeView(view);
            await this.notify(view.clone());
        },
        async notify(view) {
            GLOBAL_DATA.activeViewState.viewState = view;
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