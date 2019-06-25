<template>
    <div>
      <el-tabs type="border-card">
        <el-tab-pane label="Add">
            <el-table
              :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              height="200"
              border
              style="width: 100%">
              <el-table-column
                prop="date"
                label="日期"
                width="180">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="address"
                label="地址">
              </el-table-column>
              
              <el-table-column label="操作">
                <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"/>
                </template>
                
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="AddFocusElement(scope.row)">focus
                  </el-button>
                </template>
            </el-table-column>
            </el-table>
         
        </el-tab-pane>
        <el-tab-pane label="Modify">2</el-tab-pane>
        <el-tab-pane label="Delete">3</el-tab-pane>
      </el-tabs>
        <!-- <el-input
        placeholder="input keyword to filter"
        v-model="filterText">
        </el-input> -->
        
    </div>
</template>

<script>

export default {
    name: 'differenceResult',
     data() {
      return {
         search: '',
         tableData: [{
          date: '2016-05-03',
          name: 'yezi1',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: 'yezi122',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '444',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '555',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      }
    },
    props:['projectId','startVersionName','endVersionName'],
    components: {
        
    },
    created () {},
    mounted(){
        this.getResult();
        
    },
    watch: {
      
    },
    methods: {
        getResult(){
             let param = {
              projectId:this.projectId,
              startversion:'3',
              endversion: '4'
            }
           

            this.$get('api/version/differences',{}, param).then(res => {
              this.isLoading = false;
                if (res.state === 0) {
                
                }
            });
            
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>