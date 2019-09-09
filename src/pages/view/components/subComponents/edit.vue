<template>
    <div>
        <i class="iconfont icon-iosredooutline" @click="edit"></i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'edit',
    data () {
        return {
            id:'',
            modelId:''
        };
    },
    components: {
        
    },
    created () {
        window.eventHub.$on('component_edit',this.getElementData);
    },
    methods: {
        getElementData(data){
            this.id = data.id,
            this.modelId = data.modelId
        },
        edit(){
            if(this.id === ''){
                return;
            }
            let param = {
                id:this.id,
                imodeltoken:JSON.stringify(this.GLOBAL_DATA.activeViewState.iModelConnection.iModelToken)
            }

            this.$post('api/view/changeColor',param).then(res=>{
                if(res.state == 0){
                    IModelApp.viewManager.refreshForModifiedModels(this.modelId)
                }
            })
            
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>