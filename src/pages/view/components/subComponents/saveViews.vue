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
                        <el-radio-group v-model="selectedLabel">
                            <el-radio v-for="(item,index) in viewsList" :label="item._name" :key="index" @change="handelViewChange(item)"></el-radio>                        
                        </el-radio-group>
                    </div>
                    
                    <div class="btn-group">
                        <el-button size="mini" type="primary" @click="createItem" slot="reference">Create</el-button>
                        <el-button size="mini" type="primary" @click="recallItem">Recall</el-button>
                        <el-button size="mini" type="primary" @click="delItem">Delete</el-button>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>
        </i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
import { deserializeViewState,serializeViewState} from "@bentley/frontend-devtools";
// import { Provider } from '../subComponents/utils/providernew' 
import { provider } from '../subComponents/utils/provider' 
import SVTRpcInterface from './saveViews/SVTRpcInterface'
import { NamedViewStatePropsString, NamedVSPSList } from "./saveViews/NamedVSPSList";

export default {
    name: 'save',
    data () {
        return {
            isShowDetail:false,
            newViewName:'',
            viewsList:[],
            selectedView: undefined,
            selectedLabel:undefined,
            _views: undefined
        };
    },
    components: {
        
    },
    created () {
        this._views = NamedVSPSList.create();
    },
    methods: {
        handelViewChange(item){
            this.selectedView = item;
        },
        open(){
            this.isShowDetail = !this.isShowDetail;
            if(this.isShowDetail) {
               this.getViews()
            }
        },
        findArrayItemByName(array,name){
            const index = array.findIndex(item => item._name === name);
            return index;
        },
        async getViews(){
            const filename = IModelApp.viewManager.selectedView.iModel.iModelToken.key;
            const esvString = await SVTRpcInterface.getClient().readExternalSavedViews(filename);
            this._views.loadFromString(esvString);
            this.viewsList = this._views._array;
        },
        async addNewItem(){
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
            
            if (undefined !== provider) {
                const overrideElements = provider.toJSON();
                overrideElementsString = JSON.stringify(overrideElements);
            }

            const nvsp = new NamedViewStatePropsString(this.newViewName, viewStatejson, selectedElementsString, overrideElementsString);
            this._views.insert(nvsp);
            await this.saveNamedViews();
            
            this.newViewName = '';
            this.selectedLabel = '';
        },
        async createItem(){
            if(this.newViewName.length === 0) {
                return Promise.resolve();
            }

            let index = this.findArrayItemByName(this.viewsList,this.newViewName)
            let result = 0;
            
            if(-1 !== index) {
                result = this.$confirm('This view name is already exists. Replace it?', 'Tips', {
                confirmButtonText: 'confirm',
                cancelButtonText: 'cancel',
                type: 'warning'
                }).then(async() => {
                   this._views.removeName(this.newViewName)
                   await this.addNewItem()
                }).catch(() => {
                   return;         
                });
            }else{
                this.addNewItem()
            }
            
        },
        async saveNamedViews() {
            const filename = IModelApp.viewManager.selectedView.iModel.iModelToken.key;
            if (undefined === filename)
                return;
            const namedViews = this._views.getPrintString();
            await SVTRpcInterface.getClient().writeExternalSavedViews(filename, namedViews);
        },
        async recallItem(){
            if( this.selectedView === undefined ) {
                return; 
            }

            let vp = IModelApp.viewManager.selectedView.view;
            const vsp = JSON.parse(this.selectedView._viewStatePropsString);
            const viewState = await deserializeViewState(vsp, vp.iModel);
            viewState.code.value = this.selectedView._name;
            await IModelApp.viewManager.selectedView.changeView(viewState);

            const overrideElementsString = this.selectedView._overrideElements;
            
            provider.clear(IModelApp.viewManager.selectedView) // bug clear anyway
            if (undefined !== overrideElementsString) {
                const overrideElements = JSON.parse(overrideElementsString);
                if (undefined !== provider && undefined !== overrideElements) {
                    provider.clear(IModelApp.viewManager.selectedView)
                    provider.overrideElementsByArray(IModelApp.viewManager.selectedView,overrideElements);
                    IModelApp.viewManager.selectedView.featureOverrideProvider = provider;
                    provider.sync(IModelApp.viewManager.selectedView);
                }
            }

            const selectedElementsString = this.selectedView._selectedElements;
            if (undefined !== selectedElementsString) {
                const selectedElements = JSON.parse(selectedElementsString);
                IModelApp.viewManager.selectedView.iModel.selectionSet.emptyAll();
                IModelApp.viewManager.selectedView.iModel.selectionSet.add(selectedElements);
                IModelApp.viewManager.selectedView.renderFrame();
            }
        },
        async delItem(){
            if( this.selectedView === undefined ) {
                return; 
            }

            this.$confirm('Do you really want to delete saved view?', 'Tips', {
                confirmButtonText: 'confirm',
                cancelButtonText: 'cancel',
                type: 'warning'
                }).then(async () => {
                   this._views.removeName(this.selectedView.name);
                   await this.saveNamedViews();
                }).catch(() => {
                   return;         
            });
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