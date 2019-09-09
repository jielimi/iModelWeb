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
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        edit(){
            let param = {
                id:'0x20000000022',
                imodeltoken:JSON.stringify(this.GLOBAL_DATA.activeViewState.iModelConnection.iModelToken)
            }

            this.$post('api/view/changeColor',param).then(res=>{
                if(res.state == 0){
                    IModelApp.viewManager.refreshForModifiedModels(res.data.modelIds)
                }
            })
            
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>