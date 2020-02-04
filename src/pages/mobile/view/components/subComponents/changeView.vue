<template>
    <div class="change-view">
        <i class="iconfont icon-xianshi" id="change_view" style="display: inline-block;"></i>
    </div>
</template>

<script>
import { ViewState,IModelApp } from "@bentley/imodeljs-frontend";
import MobileSelect from "mobile-select";
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
            let that = this;
            let mobileSelect4 = new MobileSelect({
                trigger: "#change_view",
                triggerDisplayData: false,
                ensureBtnText: "ensure",
                cancelBtnText: "cancel",
                title: "Change View",
                wheels: [
                    {data: viewList}
                ],
                keyMap: {
                    id: 'id',
                    value: 'name'
                },
                callback:function(indexArr, data){
                    that.selectChange(data[0]);
                }
            });
        },
        async selectChange(view){
            this.value = view.name;
            if (!(view instanceof ViewState)) {
                view = await IModelApp.viewManager.selectedView.iModel.views.load(view.id);
            }
            await IModelApp.viewManager.selectedView.changeView(view);
            await this.notify(view.clone());
        },
        async notify(view) {
            IModelApp.viewManager.selectedView.iModel.viewState = view;
            window.eventHub.$emit('categories_init');
            window.eventHub.$emit('render_mode_init');
            window.eventHub.$emit('render_model_init');
        }
    }
    
}
</script>

<style lang="less" scoped>
.change-view {}
</style>