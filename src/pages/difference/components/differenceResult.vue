<template>
    <div>
      <!-- <div class="sync">
        <el-button v-show="isColor"
              type="primary"
              size="mini"
              @click="color()">color
        </el-button>
        <el-button v-show="!isColor"
              type="primary"
              size="mini"
              @click="removecolor()">remove color
        </el-button>
    </div> -->
      <el-tabs type="border-card">
        <el-tab-pane label="Add">
            <!-- <el-table
              :data="tableDataAdd.filter(data => !search || data.id.toLowerCase().includes(search.toLowerCase()))" -->
            <el-table
              :data="tableDataInsert.filter(data => !search || data.id.toLowerCase().includes(search.toLowerCase()))"
              border
              style="width: 50%">
              <el-table-column
                prop="id"
                label="id"
                width="180">
              </el-table-column>
              <el-table-column label="Location">
                <!-- <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="search"
                    size="mini"
                    placeholder="search"/>
                </template> -->
                
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="AddFocusElement(scope.row)">focus
                  </el-button>
                </template>
            </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="Update">
          <el-table
              :data="tableDataUpdate"
              border
              style="width: 80%">
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
         result:{}
         
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