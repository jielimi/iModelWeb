<template>
    <div>
        <i class="iconfont icon-tree tree"  @click.self="showTree = !showTree">
            <div v-show="showTree" class="detail">
               <el-tree 
                    :load="loadNode"
                    lazy
                    class="filter-tree"
                    :data="treeData"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    accordion
                    ref="tree">
                </el-tree>
            </div>
        </i>
    </div>
</template>

<script>
import { IModelApp,Viewport,EmphasizeElements,MarginPercent } from "@bentley/imodeljs-frontend";
import ItemTreeRpcInterface  from './ItemTreeRpcInterface';

export default {
    name: 'tree',
    data () {
        return {
            treeData:[],
            showTree:false,
            defaultProps: {
                children: 'children',
                label: 'displayLabel'
            },
            test:true
        };
    },
    components: {
        
    },
    created () {
       window.eventHub.$on('render_model_init',this.buildTree);
    },
    methods: {
       async focusElement(data){
            const view = IModelApp.viewManager.selectedView.view;
            await IModelApp.viewManager.selectedView.zoomToElements(data.id);
            view.iModel.hilited.clear();
            view.iModel.hilited.setHilite(data.id,true)
        },
        async loadNode(node, resolve) {
           
            if(node.level === 0){
                return resolve(this.treeData)  // model
            }

            if(node.level === 1){
                const token = IModelApp.viewManager.selectedView.view.iModel.iModelToken;
                const clsFulName = node.data.schemaName + ":"+ node.data.className
                let listInstance = await ItemTreeRpcInterface.getClient().listInstances(
                    token,
                    clsFulName
                )
                return resolve(listInstance) //category
            }

            if(node.level > 1){
               return resolve([])
            }
        },
        async buildTree(){
            const token = IModelApp.viewManager.selectedView.view.iModel.iModelToken;
            this.treeData =  await ItemTreeRpcInterface.getClient().listItems(
                token
            );
        },
        handleNodeClick(data){
            if(data.geometricElementId){
                IModelApp.viewManager.selectedView.iModel.selectionSet.emptyAll();
                IModelApp.viewManager.selectedView.iModel.selectionSet.add(data.geometricElementId)
                IModelApp.viewManager.selectedView.zoomToElements(new Set([data.geometricElementId]))
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
            top: 38px;
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