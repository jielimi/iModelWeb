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
        <el-steps :active="step" align-center finish-status="success">
            <el-step :title=stepNum  v-for="stepNum in steps" :key="stepNum"></el-step>
        </el-steps>
        <div class="description">{{description}}</div>
        <el-progress :text-inside="true" :stroke-width="18" :percentage=progress status="success"></el-progress>
    </div>
    </el-dialog>
    
</div>
</template>

<script>

export default {
    name: 'uploadProgress',
    props:['openDialog','projectId','versionName','steps'],
    data () {
        return {
            step:0,
            timeout:'',
            description:'',
            progress:0
        };
    },
    components: {
        
    },
    created () {
       
    },
    methods: {
        startQuery() {
            this.timeout = setInterval(()=>{
                var param = {
                    projectId:this.projectId,
                    versionName:this.versionName
                }

                this.$get('api/progress',{}, param).then(res => {
                    if (res.state == 0) {
                        this.step = res.data.step -1 ;
                        this.description = res.data.description;
                        this.progress = Number(Number(res.data.progress).toFixed(0));
                        if( res.data.done == true ){
                            this.$message({
                            message:'Version successfully generated',
                            type:'success'
                            })
                            this.endQuery();
                            this.$emit('endQueryVersionGenerate')
                            this.steps = 0;
                            this.progress = 0;

                        }
                    }else{
                        this.$message({
                            message:res.message,
                            type:'warning'
                        })
                        this.endQuery()
                        this.steps = 0;
                        this.progress = 0;
                    }
            });
            },1000)
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
.description{
    margin: 50px;
}

</style>