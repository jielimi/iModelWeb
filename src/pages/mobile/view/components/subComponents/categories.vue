<template>
    <div>
        <i class="iconfont icon-layers-1 category" @click.self="detail" style="display: inline-block;">
            <div v-show="isShowDetail" class="detail">
                <el-checkbox id="cbxCatToggleAll" v-model="hasCheckAll" label="Toggle All" @change="handleCheckAllChange"></el-checkbox>
                <el-checkbox-group v-model="checkCodeList">
                    <el-checkbox v-for="category in categoryList" :label="category.code" :key="category.id" @change="applyCategoryToggleChange(category.id,category.code)"></el-checkbox>
                </el-checkbox-group>
            </div>
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'briefCases',
    data () {
        return {
            isShowDetail: false,
            categoryList: [],
            checkList: [],
            checkCodeList: [],
            hasCheckAll: false
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('render_model_init',this.buildCategoryMenu);
    },
    methods: {
        detail() {
            this.isShowDetail = !this.isShowDetail;
        },
        // build list of categories; enable those defined in category selector
        async buildCategoryMenu() {
            this.categoryList = [];
            this.checkList = [];
            this.checkCodeList = [];

            const selectUsedSpatialCategoryIds = "SELECT DISTINCT Category.Id as CategoryId from BisCore.GeometricElement3d WHERE Category.Id IN (SELECT ECInstanceId from BisCore.SpatialCategory)";
            const selectUsedDrawingCategoryIds = "SELECT DISTINCT Category.Id as CategoryId from BisCore.GeometricElement2d WHERE Model.Id=? AND Category.Id IN (SELECT ECInstanceId from BisCore.DrawingCategory)";
            const selectCategoryProps = "SELECT ECInstanceId as id, CodeValue as code, UserLabel as label FROM ";
            const selectSpatialCategoryProps = selectCategoryProps + "BisCore.SpatialCategory WHERE ECInstanceId IN (" + selectUsedSpatialCategoryIds + ")";
            const selectDrawingCategoryProps = selectCategoryProps + "BisCore.DrawingCategory WHERE ECInstanceId IN (" + selectUsedDrawingCategoryIds + ")";

            const view = IModelApp.viewManager.selectedView.view;
            const ecsql = view.is3d() ? selectSpatialCategoryProps : selectDrawingCategoryProps;
            const bindings = view.is2d() ? [view.baseModelId] : undefined;
           

            for await (const row of view.iModel.query(`${ecsql} LIMIT 1000`, bindings)) {
                this.categoryList.push(row);
            }
           
            this.checkList = Array.from(view.categorySelector.categories);
            let that = this;
            this.categoryList.forEach(function(val,index){
                if(that.checkList.indexOf(val.id) >= 0){
                    that.checkCodeList.push(val.code);
                }
            });
            this.isCheckAll();
        },
        // apply a category checkbox state being changed
        applyCategoryToggleChange(id,code) {
            let that = this;
            let vp = IModelApp.viewManager.selectedView;
            
            let invis = this.checkCodeList.indexOf(code) >= 0 ? true : false;
            const alreadyInvis = vp.view.viewsCategory(id);
            if (alreadyInvis !== invis){
                vp.changeCategoryDisplay(id, invis);
            }
            this.isCheckAll();
        },
        handleCheckAllChange(value){
            this.checkCodeList = [];
            this.checkList = [];
            let that = this;
            let vp = IModelApp.viewManager.selectedView;
            if(value){
                this.categoryList.forEach(function(val,index){
                    if(that.checkList.indexOf(val.id) < 0){
                        that.checkCodeList.push(val.code);
                        that.checkList.push(val.id);
                        const alreadyInvis = vp.view.viewsCategory(val.id);
                        if (alreadyInvis !== true){
                            vp.changeCategoryDisplay(val.id, true);
                        }
                    }
                });
            }else{
                this.categoryList.forEach(function(val,index){
                    const alreadyInvis = vp.view.viewsCategory(val.id);
                    if (alreadyInvis !== false){
                        vp.changeCategoryDisplay(val.id, false);
                    }
                });
            }
            this.isCheckAll();
        },
        isCheckAll(){
            this.hasCheckAll = this.categoryList.length === this.checkCodeList.length;
        }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-checkbox+.el-checkbox {
        margin-left: 0;
    }
    .category {
        position: relative;
        .detail {
            position: absolute;
            left: 38px;
            top: 0;
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