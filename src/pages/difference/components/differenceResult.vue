<template>
    <div>
        
    </div>
</template>

<script>

export default {
    name: 'differenceResult',
    data () {
        return {
        };
    },
    props:['projectId','startVersionName','endVersionName'],
    components: {
        
    },
    created () {},
    mounted(){
        this.getResult();
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