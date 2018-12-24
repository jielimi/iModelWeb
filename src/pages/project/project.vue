<template>
    <div class="main">
      <h1>Project</h1>
      <div class="search-area">
        <el-input v-model="queryWord" placeholder="project name">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="">
          </i>
        </el-input>
        <el-button type="primary" @click="search">Search</el-button>

      </div>

      <el-dialog title="Create Project" :visible.sync="dialogFormVisible" center>
        <el-form :model="projectForm" :rules="rules" ref="projectForm">
          <el-form-item label="Name" :label-width="formLabelWidth" required prop="projectName">
            <el-input v-model.trim="projectForm.projectName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Description" :label-width="formLabelWidth" required prop="projectDescription">
            <el-input
              type="textarea"
              :rows="3"
              placeholder=""
              v-model.trim="projectForm.projectDescription">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancle">Cancle</el-button>
          <el-button type="primary" @click="confirm">Confirm</el-button>
        </div>
      </el-dialog>

      <div class="table-area">
        <div class="operate-area">
          <el-button type="primary" @click="dialogFormVisible = true">Create Project</el-button>
        </div>

        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%">
          <el-table-column
            label="Project Name"
            >
            <template slot-scope="scope">
              <a class="link">{{ scope.row.projectName }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="projectDescription"
            label="Project Description"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="thumbnail"
            label="image">
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            label="Create Time"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="operate"
            width="200">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">Modify</el-button>
              <!--<el-button-->
                <!--size="mini"-->
                <!--type="danger"-->
                <!--@click="handleDelete(scope.$index, scope.row)">Delete</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        </div>

        <!--<div>-->
          <!--<img src="../../assets/images/undefined.svg" style="margin: 90px;">-->
        <!--</div>-->


        <el-pagination v-if="paginationShow"
                       background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="req.pageIndex"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="req.pageSize"
                       layout=" prev, pager, next,total,sizes"
                       :total="totalPages">
        </el-pagination>


      </div>

</template>

<script>
  export default {
    name: 'project',
    data () {
      const checkProjectName = (rule, value, callback) => {
        let param = {
          projectName: this.projectForm.projectName
        };
        this.$post('api/projectName', param).then(res => {
          if (res.state !== 0) {
            callback(new Error('the name is exist'));
          } else {
            callback();
          }
        });
      };
      return {
        isLoading: false,
        queryWord: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        projectForm: {
          projectName: '',
          projectDescription: ''
        },
        rules: {
          projectName: [
            { require: true, message: 'please input the name of project', trigger: 'blur' },
            { max: 30, message: 'within 30 characters please', trigger: 'blur'},
            { validator: checkProjectName, trigger: 'blur'}
            // { pattern: /^[0-9a-zA-Z_]{1,}$/, message: 'only letters,numbers and underscore are allowed ', trigger: 'change'}
          ],
          projectDescription: [
            { require: true, message: 'please input the description of project', trigger: 'blur'}
          ]
        },
        req: {
          pageIndex: 1,
          pageSize: 10
        },
        totalPages: 0,
        paginationShow: true,
        tableData: [{
          projectName: '项目一二三四五六七八九十项目一二三四五六七八九十',
          projectDescription: '项目1描述',
          createTime: '2016-05-02',
          thumbnail: '***'
        }, {
          projectName: '项目2',
          projectDescription: '项目1描述',
          createTime: '2016-05-02'
        }, {
          projectName: '项目3',
          projectDescription: '项目1描述',
          createTime: '2016-05-02'
        }, {
          projectName: '项目4',
          projectDescription: '项目1描述',
          createTime: '2016-05-02'
        }, {
          projectName: '项目5',
          projectDescription: '项目1描述',
          createTime: '2016-05-02'
        }, {
          projectName: '项目6',
          projectDescription: '项目1描述',
          createTime: '2016-05-02'
        }]
      };
    },
    created () {
      this.getProjectList();
    },
    methods: {
      getProjectList (index, query) {
        let param = {
          query: query || '',
          pageIndex: index || this.req.pageIndex,
          pageSize: this.req.pageSize
        };
        this.isLoading = true;
        this.$get('api/projectList', param).then(res => {
          this.isLoading = false;
          if (res.state !== 0) {
            this.tableData = res.data;
            this.req.pageSize = res.pagination.pageSize;
            this.req.pageIndex = res.pagination.currentPage;
            this.totalPages = res.pagination.totalPages;
          }
        });
      },
      querySearch () {
        console.log('hi');
      },
      handleEdit () {
        console.log('hi');
      },
      handleDelete () {
        console.log('hi');
      },
      handleSizeChange (val) {
        this.req.pageIndex = 1;
        this.req.pageSize = val;
        this.getProjectList();
      },
      handleCurrentChange (val) {
        this.req.pageIndex = val;
        this.getProjectList();
      },
      cancle () {
        this.$refs['projectForm'].resetFields();
        this.dialogFormVisible = false;
      },
      confirm () {
        this.$refs['projectForm'].validate((valid) => {
          if (valid) {
            let param = {
              projectName: this.projectForm.projectName,
              projectDescription: this.projectForm.projectDescription
            };
            this.$post('api/project', param).then(res => {
              if (res.state !== 0) {
                this.$message({
                  message: res.message,
                  type: 'warning'
                });
              } else {
                this.$message({
                  message: 'The Project has been created sucessfully!',
                  type: 'success'
                });
                this.dialogFormVisible = false;
              }
            });
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/color.less";
  h1{
    text-align: left;
    font-size: 20px;
  }
  .main{
    padding: 10px 30px 0px 30px;
    .search-area{
      text-align: left;
      box-sizing: border-box;
      padding: 20px 30px;
      background-color: @whiteBGColor;
      border:1px solid @defaultBorderColor;
      margin-bottom: 20px;
      .el-input{
        margin-right: 20px;
      }
    }

    .table-area{
      background-color: @whiteBGColor;
      width: 100%;
      height: auto;
      margin-bottom: 30px;
      .operate-area{
        text-align: left;
        padding: 20px 30px;
      }
    }

    .link{
      color: #409EFF;
      text-decoration: underline;
      cursor: pointer;
    }
  }

</style>
