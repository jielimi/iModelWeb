<template>
    <div>
        <i class="iconfont icon-baocun" @click="save"></i>
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
        save(){
            let parent = document.getElementById("imodelview");
            let htmlCanvas = parent.children[0].children[0];
            
            let dataURL = htmlCanvas.toDataURL();
            let param = {
                projectId: this.projectId,
                versionName: this.versionName,
                thumbnail: dataURL
            };
            
            this.$post('api/common/thumbnail',param).then(res=>{
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