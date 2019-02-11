<template>
<div>
     <el-dialog
    title=""
    width="50%"
    :visible.sync="openDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center>
    
    <div>
        <el-steps :active="step" align-center>
        <el-step title="step 1" description="start converting the file format to dgn"></el-step>
        <el-step title="step 2" description="generating the change sets"></el-step>
        <el-step title="step 3" description="uploading to imodelBank"></el-step>
        <el-step title="step 4" description="completed"></el-step>
    </el-steps>
    </div>
    </el-dialog>
    
</div>
    
</template>

<script>

export default {
    name: 'uploadProgress',
    props:['projectId','versionName'],
    data () {
        return {
            step:1,
            timeout:'',
            description:'',
            openDialog:true
        };
    },
    components: {
        
    },
    created () {
        // window.eventHub.$on('start_query_progress',this.);
    },
    methods: {
        startQuery() {
            this.timeout = setTimeout(()=>{
                var param = {
                    projectId:this.projectId,
                    versionName:this.versionName
                }

                this.$get('api/progress',{}, param).then(res => {
                    if (res.state === 0) {
                        this.step = res.data.state;
                        this.description = res.data.description;

                    }else{
                        this.endQuery()
                    }
            });
            },10000)
        },
        endQuery() {
            if (this.timeout){
                clearTimeout(this.timeout)
            }
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>