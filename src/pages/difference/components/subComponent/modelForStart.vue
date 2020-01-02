<template>
    <div>
        <i class="iconfont icon-erji-Djifang model" v-show="hasModel" @click.self="detail">
            <div v-show="isShowDetail" class="detail">
                <el-checkbox v-model="hasCheckAll" label="Toggle All" @change="handleCheckAllChange"></el-checkbox>
                <el-checkbox-group v-model="checkNameList">
                    <el-checkbox v-for="model in modelList" :label="model.name" :key="model.id" @change="applyModelChange(model.id,model.name)"></el-checkbox>
                </el-checkbox-group>
            </div>
        </i>
    </div>
</template>

<script>
import { IModelApp,Viewport, SpatialViewState, SpatialModelState } from "@bentley/imodeljs-frontend";
import { compareStringsOrUndefined } from "@bentley/bentleyjs-core";
export default {
    name: 'model',
    data () {
        return {
            isShowDetail: false,
            hasModel: false,
            modelList: [],
            checkList: [],
            checkNameList: [],
            hasCheckAll: false
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('render_model_init_start',this.updateRenderModelOptionsMap);
    },
    methods: {
        detail() {
            this.isShowDetail = !this.isShowDetail;
        },
        async updateRenderModelOptionsMap(){
            this.checkNameList = [];
            this.checkList = [];
            const vp = GLOBAL_DATA.diffViewPort[0];
            const view = GLOBAL_DATA.diffViewPort[0].view;
            if(view.modelSelector){
                this.hasModel = true;
                const selector = view.modelSelector;
                const query = { from: SpatialModelState.classFullName, wantPrivate: false };
                this.modelList = await view.iModel.models.queryProps(query);
                this.modelList.sort((lhs, rhs) => compareStringsOrUndefined(lhs.name, rhs.name));

                let that = this;
                this.modelList.forEach(function(val,index){
                    if(selector.has(val.id)){
                        that.checkList.push(val.id);
                        that.checkNameList.push(val.name);
                    }
                });
                
                this.isCheckAll();
                vp.invalidateScene();
             }else {
                this.hasModel = false;
                return;
             }
        },
        async applyModelChange(id,name){
            const vp = GLOBAL_DATA.diffViewPort[0];
            const view = GLOBAL_DATA.diffViewPort[0].view;
            const selector = view.modelSelector;
           
            let checked = this.checkNameList.indexOf(name) >= 0 ? true : false;
            let model = view.iModel.models.getLoaded(id);
            if(undefined === model){
                await view.iModel.models.load(id);
                model = view.iModel.models.getLoaded(id);
            }
            if(checked){
                GLOBAL_DATA.diffViewPort[0].addViewedModels(id);
            }else{
                GLOBAL_DATA.diffViewPort[0].changeModelDisplay(id, false);
            }
            this.isCheckAll();
            vp.invalidateScene();
        },
        async handleCheckAllChange(value){
            const vp = GLOBAL_DATA.diffViewPort[0];
            const view = GLOBAL_DATA.diffViewPort[0];
            const selector = view.modelSelector;
            this.checkNameList = [];
            this.checkList = [];
            let that = this;
            if(value){
                for (const val of this.modelList) {
                    that.checkNameList.push(val.name);
                    that.checkList.push(val.id);
                    let model = view.iModel.models.getLoaded(val.id);
                    if(undefined === model){
                        await view.iModel.models.load(val.id);
                        model = view.iModel.models.getLoaded(val.id);
                    }
                    GLOBAL_DATA.diffViewPort[0].addViewedModels(val.id);
                }
            }else{
                this.modelList.forEach(function(val,index){
                    GLOBAL_DATA.diffViewPort[0].changeModelDisplay(val.id, false);
                });
            }
            vp.invalidateScene();
        },
        isCheckAll(){
            this.hasCheckAll = this.modelList.length === this.checkNameList.length;
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-checkbox+.el-checkbox {
        margin-left: 0;
    }
    .model {
        position: relative;
        .detail {
            position: absolute;
            left: 0;
            top: 38px;
            z-index: 999;
            width: 200px;
            max-height: 350px;
            overflow-y: auto;
            padding-bottom: 10px;
            text-align: left;
            border: 1px solid #666;
            background-color: #E9F2F9;
            .el-checkbox {
                display: block;
                margin-left: 15px;
                margin-top: 5px;
            }
        }
    }
</style>