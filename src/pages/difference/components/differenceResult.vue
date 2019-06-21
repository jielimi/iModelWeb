<template>
    <div>
        <el-input
        placeholder="input keyword to filter"
        v-model="filterText">
        </el-input>

        <el-tree
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
            <el-button v-if="node.label != 'Add'&&node.label != 'Delete'&&node.label != 'Before Modify'&&node.label != 'After Modify'"
                type="text"
                size="mini"
                @click="() => append(data)">
                focus
            </el-button>
            </span>
        </span>
        </el-tree>
    </div>
</template>

<script>

export default {
    name: 'differenceResult',
     data() {
      return {
        filterText: '',
        data: [{
          label: 'Add',
          children: [{
            label: 'element 1',
          }]
        }, {
          label: 'Delete',
          children: [{
            label: 'element 2'
          }]
        }, {
          label: 'Before Modify',
          children: [{
            label: 'element 3'
          }]
        }, {
          label: 'After Modify',
          children: [{
            label: 'element 4'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    props:['projectId','startVersionName','endVersionName'],
    components: {
        
    },
    created () {},
    mounted(){
        this.getResult();
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
        
       
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        
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