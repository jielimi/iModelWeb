<template>
<div>
     <el-dialog
    title=""
    width="50%"
    :visible.sync="showProgress"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    :before-close="endQuery"
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
            progress:0,
            showProgress:false
        };
    },
    components: {
        
    },
    created () {
       
    },
    methods: {
        startQuery() {
            let that = this;
            this.timeout = setInterval(()=>{
                var param = {
                    projectId:this.projectId,
                    versionName: (encodeURIComponent(this.versionName))
                }
                
                this.$get('api/version/progress',{}, param).then(res => {
                    if (res.state == 0) {
                        this.step = res.data.step -1 ;
                        this.description = res.data.description;
                        this.progress = Number(Number(res.data.progress).toFixed(0));
                        if( res.data.done == true ){
                            that.$message({
                            message:'Version successfully generated',
                            type:'success'
                            })
                            
                            that.endQuery();
                            that.$emit('endQueryVersionGenerate')
                            that.step = 0;
                            that.progress = 0;

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
            // this.showProgress = false;
            this.$emit('endQueryVersionGenerate')
        }
        
    },
     watch: {
      openDialog(val) {
         this.showProgress = val
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