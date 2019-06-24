<template>
    <div>
        <el-input
        placeholder="input keyword to filter"
        v-model="filterText">
        </el-input>
        
    </div>
</template>

<script>

export default {
    name: 'differenceResult',
     data() {
      return {
        filterText: ''
      }
    },
    props:['projectId','startVersionName','endVersionName'],
    components: {
        
    },
    created () {},
    mounted(){
        this.getResult();
        // window.eventHub.$on('view_start_init',this.send)
    },
    watch: {
      
    },
    methods: {
        getResult(){
             let param = {
              projectId:this.projectId,
              startversion:this.startversion,
              endversion: this.endversion
            }

            // this.$get('api/version/difference',{}, param).then(res => {
            //   this.isLoading = false;
            //     if (res.state === 0) {
                
            //     }
            // });
            
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>