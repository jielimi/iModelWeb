<template>
    <div>
      <el-tabs type="border-card">
        <el-tab-pane label="Add">
            <el-table
              :data="tableDataInsert.filter(data => !search || data.id.toLowerCase().includes(search.toLowerCase()))"
              border
              style="width: 50%"
              max-height="250">
              <el-table-column
                prop="id"
                label="id"
                width="180">
              </el-table-column>
              <el-table-column label="Location">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="AddFocusElement(scope.row)">focus
                  </el-button>
                </template>
            </el-table-column>
            </el-table>
            <el-pagination
                   background
                   @size-change="addhandleSizeChange"
                   @current-change="addhandleCurrentChange"
                   :current-page="addReq.pageIndex"
                   :page-sizes="[5, 10, 20, 50]"
                   :page-size="addReq.pageSize"
                   layout=" prev, pager, next,total,sizes"
                   :total="addReq.totalNum">
        </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="Update">
          <el-table
              :data="tableDataUpdate"
              border
              style="width: 100%">
              <el-table-column
                prop="id"
                label="id"
                width="180">
              </el-table-column>
              <el-table-column
                prop="before"
                label="before"
                width="180"
                :formatter="formatterColumnBefore">
              </el-table-column>
              <el-table-column
                prop="after"
                label="after"
                width="180"
                :formatter="formatterColumnAfter">
              </el-table-column>
              <el-table-column
                prop="class"
                label="class"
                width="180">
              </el-table-column>
              <el-table-column label="Location">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="UpdateFocusElement(scope.row)">focus
                  </el-button>
                </template>
            </el-table-column>
            </el-table>
            <el-pagination
                   background
                   @size-change="modifyhandleSizeChange"
                   @current-change="modifyhandleCurrentChange"
                   :current-page="modifyReq.pageIndex"
                   :page-sizes="[5, 10, 20, 50]"
                   :page-size="modifyReq.pageSize"
                   layout=" prev, pager, next,total,sizes"
                   :total="modifyReq.totalNum">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="Delete">
          <el-table
              :data="tableDataDelete"
              border
              style="width: 50%">
              <el-table-column
                prop="id"
                label="id"
                width="180">
              </el-table-column>
              <el-table-column label="Location">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="DeleteFocusElement(scope.row)">focus
                  </el-button>
                </template>
            </el-table-column>
            </el-table>

            <el-pagination
                   background
                   @size-change="delhandleSizeChange"
                   @current-change="delhandleCurrentChange"
                   :current-page="delReq.pageIndex"
                   :page-sizes="[5, 10, 20, 50]"
                   :page-size="delReq.pageSize"
                   layout=" prev, pager, next,total,sizes"
                   :total="delReq.totalNum">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>

export default {
    name: 'differenceResult',
     data() {
      return {
        isColor:true,
         search: '',
         tableDataInsert: [],
         tableDataUpdate:[],
         tableDataDelete:[],
         result:{},
         addReq:{
           pageIndex:1,
           pageSize:10,
           totalNum:0
         },
         delReq:{
           pageIndex:1,
           pageSize:10,
           totalNum:0
         },
         modifyReq:{
           pageIndex:1,
           pageSize:10,
           totalNum:0
         }
      }
    },
    props:['projectId','startVersionName','endVersionName'],
    components: {
        
    },
    created () {},
    mounted(){
        this.getResult();
        
    },
    methods: {
      addhandleSizeChange(val,type) {
        this.addReq.pageIndex = 1;
        this.addReq.pageSize = val;
        this.getTableResult(0, this.addReq, this.tableDataInsert);
      },
      addhandleCurrentChange(val) {
        this.addReq.pageIndex = val;
        this.getTableResult(0, this.addReq, this.tableDataInsert);
      },
      modifyhandleSizeChange(val,type) {
        this.modifyReq.pageIndex = 1;
        this.modifyReq.pageSize = val;
        this.getTableResult(1, this.modifyReq, this.tableDataModify);
      },
      modifyhandleCurrentChange(val) {
        this.modifyReq.pageIndex = val;
        this.getTableResult(1, this.addReq, this.tableDataModify);
      },
      delhandleSizeChange(val,type) {
        this.addReq.pageIndex = 1;
        this.addReq.pageSize = val;
        this.getTableResult(2, this.delReq, this.tableDataDelete);
      },
      delhandleCurrentChange(val) {
        this.addReq.pageIndex = val;
        this.getTableResult(2, this.delReq, this.tableDataDelete);
      },
      getTableResult(type,req,table){
        let param = {
                    projectId:this.projectId,
                    startversion:this.endVersionName,
                    endversion: this.startVersionName,
                    changeType:type,
                    pageIndex:req.pageIndex,
                    pageSize:req.pageSize
                  }

        this.$get('api/version/differences',{}, param).then(res => {
            this.isLoading = false;
              if (res.state === 0) {
                table = res.data;
                req.pageSize = res.pagination.pageSize? res.pagination.pageSize:10;
                req.pageIndex = res.pagination.pageIndex? res.pagination.pageIndex:1;
                req.totalNum = res.pagination.totalNum;
              }
          });
      },
      color(){
          window.eventHub.$emit('diff_show_color',this.result);
      },
      removecolor(){
          window.eventHub.$emit('diff_remove_color');
      },
      AddFocusElement(row){
        window.eventHub.$emit('diff_viewport_insert',row.id);
      },
      UpdateFocusElement(row){
        window.eventHub.$emit('diff_viewport_update',row.id);
      },
      DeleteFocusElement(row){
        window.eventHub.$emit('diff_viewport_delete',row.id);
      },
      formatterColumnBefore(row, column) {
        return JSON.stringify(row.before.geometryStream[0].appearance);
      },
      formatterColumnAfter(row, column) {
        return JSON.stringify(row.after.geometryStream[0].appearance);
      },
      
      
      getResult(){
            let param = {
            projectId:this.projectId,
            startversion:this.endVersionName,
            endversion: this.startVersionName
          }

          this.$get('api/version/differences',{}, param).then(res => {
            this.isLoading = false;
              if (res.state === 0) {
                this.tableDataInsert = res.data.insert;
                this.tableDataUpdate = res.data.update;
                this.tableDataDelete = res.data.delete;
                this.result = res.data;
              }
          });
          
      }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.sync{
    position: absolute;
    top: 20px;
    left: 120px;
}

.mark{
    position: absolute;
    right: -25px;
    top: 0;

    div{
        width: 10px;
        height: 10px;
    }
    div:first-child{
        background: #3CB371;
    }
    div:nth-child(2){
        background: #DC143C;
    }
    div:nth-child(3){
        background: #FFFF00;
    }
}

</style>