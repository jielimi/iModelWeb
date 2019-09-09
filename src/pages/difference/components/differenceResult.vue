<template>
    <div>
      <el-tabs type="border-card">
        <el-tab-pane label="Add">
            <el-table
              :data="insertData"
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
              :data="updateData"
              border
              style="width: 100%">
              <el-table-column
                prop="id"
                label="id"
                width="180">
              </el-table-column>
              <!-- <el-table-column
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
              </el-table-column> -->
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
            <el-table-column label="difference">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="getUpdateElemDifference(scope.row)">get difference
                  </el-button>
                </template>
            </el-table-column>
            </el-table>
            <el-pagination
                   background
                   @size-change="updatehandleSizeChange"
                   @current-change="updatehandleCurrentChange"
                   :current-page="updateReq.pageIndex"
                   :page-sizes="[5, 10, 20, 50]"
                   :page-size="updateReq.pageSize"
                   layout=" prev, pager, next,total,sizes"
                   :total="updateReq.totalNum">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="Delete">
          <el-table
              :data="deleteData"
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
         insertData:[],
         updateData:[],
         deleteData:[],
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
         updateReq:{
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
      addhandleSizeChange(val) {
        this.addReq.pageIndex = 1;
        this.addReq.pageSize = val;
        this.insertData = this.tableDataInsert.slice(0,this.addReq.pageSize);
      },
      addhandleCurrentChange(val) {
        this.addReq.pageIndex = val;
        let start = (val-1)*this.addReq.pageSize;
        let end = start + this.addReq.pageSize;
        this.insertData = this.tableDataInsert.slice(start,end)
      },
      updatehandleSizeChange(val) {
        this.updateReq.pageIndex = 1;
        this.updateReq.pageSize = val;
        this.updateData = this.tableDataUpdate.slice(0,this.updateReq.pageSize);
      },
      updatehandleCurrentChange(val) {
        this.updateReq.pageIndex = val;
        let start = (val-1)*this.updateReq.pageSize;
        let end = start + this.updateReq.pageSize;
        this.updateData = this.tableDataUpdate.slice(start,end)
      },
      delhandleSizeChange(val) {
        this.addReq.pageIndex = 1;
        this.addReq.pageSize = val;
        this.deleteData = this.tableDataDelete.slice(0,this.delReq.pageSize);
      },
      delhandleCurrentChange(val) {
        this.delReq.pageIndex = val;
        let start = (val-1)*this.delReq.pageSize;
        let end = start + this.delReq.pageSize;
        this.deleteData = this.tableDataUpdate.slice(start,end)
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
      // formatterColumnBefore(row, column) {
      //   return JSON.stringify(row.before.geometryStream[0].appearance);
      // },
      // formatterColumnAfter(row, column) {
      //   return JSON.stringify(row.after.geometryStream[0].appearance);
      // },
      getUpdateElemDifference(row){
            let param = {
            projectId:this.projectId,
            startversion:this.endVersionName,
            endversion: this.startVersionName,
            elemId:row.id
          }

          this.$get('api/version/updateElemDiff',{}, param).then(res => {
          })
      },
      
      buildtableResult(arr,result){
        let index = 0;
        for(index;index < result.length;index++){
            arr.push({"id":result[index]})
        }
      },
      getResult(){
            let param = {
            projectId:this.projectId,
            startversion:this.endVersionName,
            endversion: this.startVersionName
          }
          // api/version/diffElems  differences
          this.$get('api/version/diffElems',{}, param).then(res => {
            this.isLoading = false;
              if (res.state === 0) {
                this.buildtableResult(this.tableDataInsert,res.data.insert);
                this.buildtableResult(this.tableDataUpdate,res.data.update);
                this.buildtableResult(this.tableDataDelete,res.data.delete);
                let result = {
                  insert:this.tableDataInsert,
                  update:this.tableDataUpdate,
                  delete:this.tableDataDelete
                }
                this.addReq.totalNum = this.tableDataInsert.length;
                this.updateReq.totalNum = this.tableDataUpdate.length;
                this.delReq.totalNum = this.tableDataDelete.length;

                this.insertData = this.tableDataInsert.slice(0,this.addReq.pageSize); //pagination
                this.updateData = this.tableDataUpdate.slice(0,this.updateReq.pageSize); //pagination
                this.deleteData = this.tableDataDelete.slice(0,this.delReq.pageSize); //pagination

                this.result = result; // color
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