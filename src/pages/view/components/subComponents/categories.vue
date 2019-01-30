<template>
    <div>
        <i class="iconfont icon-layers-1 category" @click.self="detail">
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
        window.eventHub.$on('categories_viewList_init',this.buildCategoryMenu);
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
            let view = this.GLOBAL_DATA.activeViewState.viewState;
            let ecsql = "SELECT ECInstanceId as id, CodeValue as code, UserLabel as label FROM " + (view.is3d() ? "BisCore.SpatialCategory" : "BisCore.DrawingCategory");
            this.categoryList = await view.iModel.executeQuery(ecsql);
            this.checkList = Array.from(view.categorySelector.categories);
            let that = this;
            this.categoryList.forEach(function(val,index){
                if(that.checkList.indexOf(val.id) >= 0){
                    that.checkCodeList.push(val.code);
                }
            });
            this.isCheckAll();
        },
        // toggleCategoryState(invis, catId, view) {
        //     //set to true to emulate semi-wacky Navigator behavior...
        //     const enableAllSubCategories = false;
        //     const alreadyInvis = view.viewsCategory(catId);
        //     if (alreadyInvis !== invis)
        //     view.changeCategoryDisplay(catId, invis, enableAllSubCategories);
        // },
        // apply a category checkbox state being changed
        applyCategoryToggleChange(id,code) {
            let that = this;
            let view = this.GLOBAL_DATA.theViewPort.view;
            // for (const cat of this.categoryList) {
            //     console.log(cat);
            //     const cbxName = "cbxCat" + cat;
            //     const isChecked = that.checkList.indexOf(cat.id) >= 0;
            //     const invis = isChecked ? false : true;
            //     this.toggleCategoryState(invis, cat.id, view);
            // }
            let invis = this.checkCodeList.indexOf(code) >= 0 ? true : false;
            const alreadyInvis = view.viewsCategory(id);
            if (alreadyInvis !== invis){
                view.changeCategoryDisplay(id, invis);
            }
            this.isCheckAll();
            //view.changeCategoryDisplay(id, invis);
        },
        handleCheckAllChange(value){
            this.checkCodeList = [];
            this.checkList = [];
            let that = this;
            let view = this.GLOBAL_DATA.theViewPort.view;
            if(value){
                this.categoryList.forEach(function(val,index){
                    if(that.checkList.indexOf(val.id) < 0){
                        that.checkCodeList.push(val.code);
                        that.checkList.push(val.id);
                        const alreadyInvis = view.viewsCategory(val.id);
                        if (alreadyInvis !== true){
                            view.changeCategoryDisplay(val.id, true);
                        }
                    }
                });
            }else{
                this.categoryList.forEach(function(val,index){
                    const alreadyInvis = view.viewsCategory(val.id);
                    if (alreadyInvis !== false){
                        view.changeCategoryDisplay(val.id, false);
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
            left: 0;
            top: 45px;
            z-index: 999;
            width: 200px;
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