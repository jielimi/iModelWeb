<template>
    <div>
        <i class="iconfont icon-baocun views-save" @click.self="open">
            <div v-show="isShowDetail" class="detail" >
                <div style="padding: 10px;">
                    <el-input 
                        type="text"
                        placeholder=""
                        v-model="newViewName"
                        maxlength="15"
                        show-word-limit
                        clearable
                    />
                    <div class="viewsNameGroup">
                        <el-radio-group v-model="radio">
                            <el-radio v-for="(item,index) in viewsList" :label="item.viewName" :key="index"></el-radio>                        
                        </el-radio-group>
                    </div>
                    
                    <div class="btn-group">
                        
                        <el-button size="mini" type="primary" @click="create" slot="reference">Create</el-button>
                        <el-button size="mini" type="primary" @click="recall">Recall</el-button>
                        <el-button size="mini" type="primary" click="delete" slot="reference">Delete</el-button>
                        
                    </div>
                </div>
            </div>
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
import { deserializeViewState,serializeViewState} from "@bentley/frontend-devtools";
export default {
    name: 'save',
    data () {
        return {
            isShowDetail:false,
            newViewName:'',
            viewsList:[],
            radio: '',
            
        };
    },
    props:[],
    components: {
        
    },
    created () {},
    methods: {
        open(){
            this.isShowDetail = !this.isShowDetail;
        },
        findArrayItemByName(array,name){
            const index = array.findIndex(item => item.name === name);
            return index;
        },
        deleteArrayItem: function (array,index) {
            array.splice(index, 1);
        },
        create(){
            if(this.newViewName.length === 0) {
                return;
            }

            let index = this.findArrayItemByName(this.viewsList,this.newViewName)
            
            if(-1 !== index){
                this.deleteItem(index)
            }

            let vp = IModelApp.viewManager.selectedView.view;

            const props = serializeViewState(vp);
            const viewStatejson = JSON.stringify(props);

            let selectedElementsString;
            let selectSetElem = IModelApp.viewManager.selectedView.iModel.selectionSet.elements
            if (selectSetElem.size > 0) {
                const seList = [];
                selectSetElem.forEach((id) => { seList.push(id); });
                selectedElementsString = JSON.stringify(seList);
            }

            let overrideElementsString;
            const provider = IModelApp.viewManager.selectedView.featureOverrideProvider;
            if (undefined !== provider) {
                const overrideElements = provider.toJSON();
                overrideElementsString = JSON.stringify(overrideElements);
            }

            const nvsp = {viewStatejson,selectedElementsString,overrideElementsString}
            let item = {
                'viewName':this.newViewName,
                'viewStateJson':viewStatejson,
                'selectedElementsString':selectedElementsString,
                'overrideElementsString':overrideElementsString
            }

            this.viewsList.push(item);
            debugger;
            this.newViewName = '';
        },
        recall(){
            
        },
        delete(){

        }
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.views-save{
    position: relative;
        .detail {
            position: absolute;
            left: 0;
            top: 38px;
            z-index: 999;
            width: 320px;
            max-height: 400px;
            overflow-y: auto;
            padding-bottom: 10px;
            text-align: left;
            border: 1px solid #666;
            background-color: #E9F2F9;
            .el-radio-group {
                display: block;
                margin-left: 15px;
            }
        }
        .viewsNameGroup{
            margin: 20px 0;
            .el-radio{
                display: block;
                color: #606266;
                font-weight: 500;
                line-height: 1;
                cursor: pointer;
                white-space: nowrap;
                outline: 0;
            }
            .el-radio+.el-radio {
                margin-top: 10px;
                margin-left: 0px;
            }
        }
}
</style>