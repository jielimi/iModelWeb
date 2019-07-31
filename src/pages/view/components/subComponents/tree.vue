<template>
    <div>
        <i class="iconfont icon-tree tree" v-show="is3d" @click.self="showTree = !showTree">
            <div v-show="showTree" class="detail">
                <el-input
                    placeholder="filter"
                    v-model="filterText">
                </el-input>
               <el-tree 
                    lazy
                    :load="loadNode"
                    class="filter-tree"
                    :filter-node-method="filterNode"
                    :data="treeData"
                    :props="defaultProps"
                    accordion
                    ref="tree">

                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                        <i class="el-icon-location" v-if="node.data.isElem "
                        @click="() => focusElement(data)"
                        >
                        </i>
                        <!-- <i class="el-icon-location" 
                        @click="() => test(data)"
                        >
                        </i> -->
                        </span>
                    </span>
                </el-tree>
            </div>
        </i>
    </div>
</template>

<script>
import { IModelApp,Viewport, SpatialViewState, SpatialModelState } from "@bentley/imodeljs-frontend";
import { compareStringsOrUndefined } from "@bentley/bentleyjs-core";
import { arch } from 'os';
export default {
    name: 'tree',
    data () {
        return {
            is3d: false,
            modelList:[],
            treeData:[],
            showTree:false,
            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf: 'leaf',
            },
            filterText:''
        };
    },
    components: {
        
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created () {
        window.eventHub.$on('render_model_init',this.buildTree);
    },
    methods: {
       async focusElement(data){
            const view = this.GLOBAL_DATA.theViewPort.view;
            await this.GLOBAL_DATA.theViewPort.zoomToElements(data.id);
            view.iModel.hilited.clear();
            view.iModel.hilited.setHilite(data.id,true)
        },
       async getElemByParentId(data){
            let searchElemSql;
            if (data.categoryId){
                searchElemSql = `SELECT * FROM BisCore.GeometricElement3d WHERE parent.id=${data.id} AND category.id=${data.categoryId} ` //cell
            }else {
                searchElemSql = `SELECT * FROM BisCore.GeometricElement3d WHERE parent.id=${data.id}`
            }
            const view = this.GLOBAL_DATA.theViewPort.view;
            let elems = [];
            for await (const row of view.iModel.query(`${searchElemSql}`, undefined)) {
                if(row.hasOwnProperty("parent")){
                        let elem = {
                        id:row.id,
                        name:row.id,
                        isElem:row.geometryStream ? true:false,
                        hasParent:true
                    }
                    elems.push(elem) 
                }
            }
            return elems;
       }, 
       async getCellByCatelogyId(id){
            const searchElemSql = `SELECT * FROM BisCore.GeometricElement3d WHERE category.id=${id} `;
            const view = this.GLOBAL_DATA.theViewPort.view;
            let elem = '';
            let elems = [];
            let elemArray = [];
        
            for await (const row of view.iModel.query(`${searchElemSql}`, undefined)) {
                if(!row.hasOwnProperty("parent")){
                        
                    if(elemArray.indexOf(row.id) == -1){
                        elemArray.push(row.id);
                    }
                }else{
                     if(elemArray.indexOf(row.parent.id) == -1){
                        elemArray.push(row.parent.id);
                    }
                }
            }

            for(let i = 0;i < elemArray.length;i++){
                let EcInstanceId = elemArray[i]
                const searchElemSql = `SELECT * FROM BisCore.GeometricElement3d WHERE EcInstanceId=${EcInstanceId} `;
                let row = '';
                for await (const row of view.iModel.query(`${searchElemSql}`, undefined)) {
                  elem = {
                    id:row.id,
                    categoryId:id,
                    name:row.userLabel || row.className,
                    isElem:row.geometryStream ? true:false,
                    hasParent:row.parent ? true:false,
                    }
                }
                elems.push(elem)
            }
            return elems;
        },
        async loadNode(node, resolve) {
           
            if(node.level === 0){
                return resolve(this.treeData)  // model
            }

            if(node.level === 1){
                return resolve(node.data.children) //category
            }

            if(node.level === 2){
                let elems = await this.getCellByCatelogyId(node.data.id); //cell
                return resolve(elems)
            }

            if(node.level >= 3){
                let elems = await this.getElemByParentId(node.data); // element
                return resolve(elems)
            }
            
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleNodeClick(data){
            //console.log(data);

        },
        async findCategoryByModelId(modelId){
             this.categoryList = [];
            const selectUsedSpatialCategoryIds = `SELECT DISTINCT Category.Id as CategoryId `+
            `from BisCore.GeometricElement3d WHERE Model.Id= ${modelId}`+
            ` AND Category.Id IN (SELECT ECInstanceId from BisCore.SpatialCategory)`;

            const selectCategoryProps = "SELECT ECInstanceId as id, CodeValue as code, UserLabel as label FROM ";
            const selectSpatialCategoryProps = selectCategoryProps + "BisCore.SpatialCategory WHERE ECInstanceId IN (" + selectUsedSpatialCategoryIds + ")";
            const view = this.GLOBAL_DATA.theViewPort.view;

            for await (const row of view.iModel.query(`${selectSpatialCategoryProps} LIMIT 1000`, undefined)) {
             
              let categolyElem = {
                    name:row.code,
                    id:row.id
                }
                this.categoryList.push(categolyElem);
            }
            
            return this.categoryList;
        
        },
        async buildTree(){
            this.is3d = this.GLOBAL_DATA.theViewPort.view.is3d();
            if(!this.is3d){
                return;
            }
            const view = this.GLOBAL_DATA.theViewPort.view;
            const selector = view.modelSelector;
            const query = { from: SpatialModelState.classFullName, wantPrivate: false };
            this.modelList = await view.iModel.models.queryProps(query);
            this.modelList.sort((lhs, rhs) => compareStringsOrUndefined(lhs.name, rhs.name));
            
            for(let index = 0; index <this.modelList.length; index++){
                let element = this.modelList[index];
                let children = await this.findCategoryByModelId(element.id)
                let modeElem = {
                    name:element.name,
                    id:element.id,
                    children:children
                }
                this.treeData.push(modeElem);
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.tree {
        position: relative;
        .detail {
            position: absolute;
            left: 0;
            top: 45px;
            z-index: 999;
            width: 280px;
            max-height: 350px;
            overflow-y: auto;
            padding-bottom: 10px;
            text-align: left;
            border: 1px solid #666;
            background-color: #E9F2F9;
        }
    }

</style>