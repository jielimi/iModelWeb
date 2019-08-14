<template>
    <div>
        <i class="iconfont icon-baocun" @click="versionUpdate"></i>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
export default {
    name: 'save',
    data () {
        return {

        };
    },
    props:['projectId','versionName'],
    components: {
        
    },
    created () {},
    methods: {
        versionUpdate(){
           
            let param = {
                projectId: this.projectId,
                versionName: this.versionName
            };
            
            this.$get('api/version/newversion',{},param).then(res=>{
                if(res.state != 0) {
                    console.log(res.message);
                }
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>