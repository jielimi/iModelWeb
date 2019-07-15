<template>
    <div>
        <i class="iconfont icon-tree tree " @click.self="showTree = !showTree">
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
                        <i class="el-icon-location" v-if="node.data.isElem"
                        @click="() => focusElement(data)"
                        >
                        </i>
                        <!-- <el-button v-if="node.isLeaf"
                            type="text"
                            size="mini"
                            @click="() => append(data)">
                            Append
                        </el-button> -->
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
export default {
    name: 'tree',
    data () {
        return {
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
            //this.GLOBAL_DATA.activeViewState.iModelConnection.selectionSet.elements.add(data.id)
            await this.GLOBAL_DATA.theViewPort.zoomToElements(data.id);
        },
       async getElemByParentId(id){
            const searchElemSql = `SELECT * FROM BisCore.PhysicalElement WHERE parent.id=${id} `
            const view = this.GLOBAL_DATA.theViewPort.view;
            let elems = [];
            for await (const row of view.iModel.query(`${searchElemSql}`, undefined)) {
                if(row.hasOwnProperty("parent")){
                        let elem = {
                        id:row.id,
                        name:row.id,
                        isElem:true,
                    }
                    elems.push(elem) 
                }
            }
            return elems;
       }, 
       async getElemByCatelogyId(id){
            const searchElemSql = `SELECT * FROM BisCore.PhysicalElement WHERE category.id=${id} `;
            const view = this.GLOBAL_DATA.theViewPort.view;
            let elems = [];
            for await (const row of view.iModel.query(`${searchElemSql}`, undefined)) {
                console.log("row",row);

                if(!row.hasOwnProperty("parent")){
                        let elem = {
                        id:row.id,
                        name:row.id,
                        isElem:true
                    }
                    elems.push(elem) 
                }
            }
            return elems;
        },
        async loadNode(node, resolve) {
           
            if(node.level === 0){
                return resolve(this.treeData)
            }

            if(node.level === 1){
                return resolve(node.data.children)
            }

            if(node.level === 2){
                let elems = await this.getElemByCatelogyId(node.data.id);
                return resolve(elems)
            }

            if(node.level >= 3){
                let elems = await this.getElemByParentId(node.data.id);
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