<template>
  <div class="main" v-loading="isLoading">
    <h1>Project</h1>
    <div class="search-area">
      <el-input v-model.trim="queryWord" placeholder="project name" @keyup.enter.native="getProjectList(1)" maxlength="30">
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getProjectList(1)"
          >
        </i>
      </el-input>
      <el-button type="primary" @click="getProjectList(1)">Search</el-button>
      <el-button @click="reset">Reset</el-button>

    </div>

    <el-dialog :title="isNewProject? 'Create Project':'Modify Project'" :visible.sync="dialogFormVisible"  :close-on-click-modal="false" center>
      <el-form :model="projectForm" :rules="rules" ref="projectForm" @submit.native.prevent>
        <div>
          <el-form-item label="Name:" :label-width="formLabelWidth"  prop="projectName">
            <el-input v-model.trim="projectForm.projectName" autocomplete="off"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="Description:" :label-width="formLabelWidth"  prop="projectDescription">
          <el-input
            type="textarea"
            :rows="3"
            maxlength="200"
            placeholder=""
            v-model.trim="projectForm.projectDescription">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">Cancle</el-button>

        <el-button v-if="isNewProject" type="primary" @click="createProjectConfirm()" :disabled="confirmDisable">Confirm</el-button>
        <el-button v-else type="primary" @click="modifyProjectConfirm()" :disabled="confirmDisable">Confirm</el-button>
      </div>
    </el-dialog>

    <div class="table-area">
      <div class="operate-area">
        <el-button type="primary" @click="createProject">Create Project</el-button>

        
        <!-- 打开standalone   -->
        <el-button type="primary" @click="stdialogVisible=true;inputFileUrl='';">Open Standalone</el-button>
        <!-- 打开在线版本 -->
        <el-button type="primary" @click="onlinedialogVisible=true;onlineViewForm.url='';onlineViewForm.versionName=''">Open Online</el-button>

        <el-dialog title="Open Standalone" :visible.sync="stdialogVisible" width="30%" :close-on-click-modal="false" center>
          <el-input v-model.trim="inputFileUrl" placeholder=""></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="stdialogVisible = false">Cancle</el-button>
            <el-button type="primary" @click="openSTFile">Confirm</el-button>
          </span>
        </el-dialog>

        <el-dialog title="Open Online View" :visible.sync="onlinedialogVisible"  :close-on-click-modal="false" center>
        <el-form :model="onlineViewForm" :rules="onlineViewrules" ref="onlineViewForm" @submit.native.prevent>
          <div>
            <el-form-item label="VersionName:" :label-width="formLabelWidth"  prop="versionName">
              <el-input v-model.trim="onlineViewForm.versionName" autocomplete="off"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="Url Addr:" :label-width="formLabelWidth"  prop="url">
              <el-input v-model.trim="onlineViewForm.url" autocomplete="off"></el-input>
            </el-form-item>
          </div>

          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onlinedialogVisible = false">Cancle</el-button>
          <el-button type="primary" @click="openOnlineFile">Confirm</el-button>
        </div>
      </el-dialog>

      </div>
      <div>
       
    </div>

      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          label="Index"
          width="60"
          align="center"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="Project Name"
        >
          <template slot-scope="scope">
            <router-link :to="{path:'version',query:{projectId: scope.row.projectId,projectName: scope.row.name}}">
              <a class="link">{{ scope.row.name }}</a>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Project Description"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="thumbnail"
          label="Thumbnail">
          <template slot-scope="scope">
            <img v-if="scope.row.thumbnail" class="thumbnail" :src="scope.row.thumbnail" @click="expandThumbNail(scope.row.thumbnail)"/>
            <img v-else class="thumbnail" src="../../assets/images/default.png"/>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created"
          label="Created"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="Operations"
          width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="modifyProject(scope.row)">Modify
            </el-button>
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
                   :page-sizes="[5, 10, 20, 50]"
                   :page-size="req.pageSize"
                   layout=" prev, pager, next,total,sizes"
                   :total="totalNum">
    </el-pagination>

    <div class="cover" v-if="dialogVisible">
      <div class="img-wrap">
        <i class="iconfont icon-close" @click="closeCover"></i>
        <img :src='thumbnailSrc' width="500px"/>
      </div>
    </div>

  </div>

</template>

<script>
  import { formatDate } from '@/utils/date';
  export default {
    name: 'project',
    data() {
      const checkProjectName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('please input the name of project'));
          return;
        }

        if(!this.isNewProject && this.oldProjectName == this.projectForm.projectName) {
          callback();
          return;
        }

        let param = {
          projectName: this.projectForm.projectName
        };
        this.$post('api/project/name', param).then(res => {
          if (res.state !== 0) {
            callback(new Error('the name is exist'));
          } else {
            callback();
          }
        });
      };
      return {
        dialogVisible:false,
        stdialogVisible:false,
        onlinedialogVisible:false,
        onlineViewForm:{
          url:'',
          versionName:''
        },
        inputFileUrl:'',
        thumbnailSrc:'',
        isLoading: false,
        isNewProject: true,
        queryWord: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        projectForm: {
          projectId:'',
          projectName: '',
          projectDescription: ''
        },
        oldProjectName:'',
        onlineViewrules: {
          versionName: [
            { required: true, message: 'please input the name of version', trigger: 'blur'},
            { max: 30, message: 'within 30 characters please', trigger: 'change'},
            { pattern: /^([\w\u4E00-\u9FA5_\-]+)+$/, message: 'only chinese character,letters,numbers and underscore are allowed ', trigger: 'change'}
          ],
          url: [
            { required: true, message: 'please input the url', trigger: 'blur'},
            { max: 30, message: 'within 30 characters please', trigger: 'change'},
          ]
        },
        rules: {
          projectName: [
            { required: true, message: 'please input the name of project', trigger: 'blur'},
            { max: 30, message: 'within 30 characters please', trigger: 'change'},
            { validator: checkProjectName, trigger: 'blur'},
            { pattern: /^([\w\u4E00-\u9FA5_\-]+)+$/, message: 'only chinese character,letters,numbers and underscore are allowed ', trigger: 'change'}
          ],
          projectDescription: [
            { required: true, message: 'please input the description of project', trigger: 'blur'}
          ]
        },
        req: {
          pageIndex: 1,
          pageSize: 5
        },
        totalNum: 0,
        paginationShow: true,
        tableData: [],
        confirmDisable:false
      };
    },
    created () {
      this.getProjectList();
    },
    methods: {
      getProjectList (index) {
        
        var param ={
          query:(encodeURIComponent(this.queryWord)),
          pageIndex:index || this.req.pageIndex,
          pageSize:this.req.pageSize
        }
        
        
        this.isLoading = true;
        this.$get('api/project/list',{},param).then(res => {
          this.isLoading = false;
          if (res.state === 0) {
            this.tableData = res.data.projectList;
            this.req.pageSize = res.pagination.pageSize? res.pagination.pageSize:10;
            this.req.pageIndex = res.pagination.currentPage? res.pagination.currentPage:1;
            this.totalNum = res.pagination.totalNum;
          }
        });;
      },
      reset () {
        this.queryWord = '';
        this.req.pageIndex = 1;
        this.getProjectList();
      },
      // handleDelete () {
      //   console.log('hi');
      // },
      handleSizeChange(val) {
        this.req.pageIndex = 1;
        this.req.pageSize = val;
        this.getProjectList();
      },
      handleCurrentChange(val) {
        this.req.pageIndex = val;
        this.getProjectList();
      },
      tableRowClassName(row) {
        row.row.index = row.rowIndex; // 为了获取行号
      },
      formatter (row, column, cellValue) {
        // 放回索引值
        return this.req.pageSize * (this.req.pageIndex - 1) + 1 + row.index;
      },
      cancle () {
        this.projectForm.projectName = '';
        this.projectForm.projectDescription = '';
        this.$refs['projectForm'].resetFields();
        this.dialogFormVisible = false;
      },
      createProject () {
        this.isNewProject = true;
        this.dialogFormVisible = true;
      },
      modifyProject (row) {
        this.isNewProject = false;
        this.dialogFormVisible = true;
        this.oldProjectName = row.name;
        this.projectForm.projectName = row.name;
        this.projectForm.projectDescription = row.description;
        this.projectForm.projectId = row.projectId;
      },
      handleResult (res) {
        if (res.state !== 0) {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        } else {
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.$refs['projectForm'].resetFields();
          this.dialogFormVisible = false;
          this.getProjectList(1);
        }
      },
      createProjectConfirm () {
        this.$refs['projectForm'].validate((valid) => {
          if (valid) {
            let param = {
              projectName: this.projectForm.projectName,
              projectDescription: this.projectForm.projectDescription
            };
            this.confirmDisable = true;
            this.$post('/api/project/instance', param).then(res => {
              this.confirmDisable = false;
              this.handleResult(res);
            });
          }
        });
      },
      modifyProjectConfirm () {
        
        this.$refs['projectForm'].validate((valid) => {
          if (valid) {
            let param = {
              projectId: this.projectForm.projectId,
              projectName: this.projectForm.projectName,
              projectDescription: this.projectForm.projectDescription
            };
            this.confirmDisable = true;
            this.$put('api/project/instance', param).then(res => {
              this.confirmDisable = false;
              this.handleResult(res);
            });
          }
        });
      },
      dateFormat(row, column, cellValue, index) {
        const  daterc= row[column.property];
        if(daterc!=null){
          const dateMat= new Date(daterc);
          return formatDate(dateMat,"yyyy-MM-dd hh:mm:ss");
        }
      },
      expandThumbNail(base64src) {
        this.dialogVisible = true;
        this.thumbnailSrc = base64src;
      },
      closeCover() {
        this.dialogVisible = false;
      },
      openSTFile() {
        if(!this.inputFileUrl){
          return;
        }
        let routeData = this.$router.resolve({ path: 'view', query: { isStandalone:true,openUrl:this.inputFileUrl}});
        window.open(routeData.href, '_blank'); 
      },
      openOnlineFile() {
        let routeData = this.$router.resolve({ path: 'view', query: {projectId: "233e1f55-561d-42a4-8e80-d6f91743863e",
        versionName: this.onlineViewForm.versionName,versionId: "4a7c8708-58fd-4d1c-8b95-b1bc3915ab80",url: this.onlineViewForm.url}});
        window.open(routeData.href, '_blank');

      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/css/color.less";

  h1 {
    text-align: left;
    font-size: 20px;
  }
  .cover {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 1;
    z-index: 10000;
    left: 0;
    top: 0;
    .img-wrap {
      position:absolute;
      top:50%;
      left:50%;
      -webkit-transform: translate(-50%,-50%);
      -moz-transform: translate(-50%,-50%);
      transform:translate(-50%,-50%);
      i {
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        font-size: 30px;
        position: absolute;
        z-index: 999;
        right: -20px;
        top: -20px;
        border: none;
        background-color: rgba(0,0,0,.5);
        cursor: pointer;
        color: #fff;
      }
    }
    
  }

  .main {
    padding: 10px 30px 0px 30px;
    .search-area {
      text-align: left;
      box-sizing: border-box;
      padding: 20px 30px;
      background-color: @whiteBGColor;
      border: 1px solid @defaultBorderColor;
      margin-bottom: 20px;
      .el-input {
        margin-right: 20px;
      }
    }

    .table-area {
      background-color: @whiteBGColor;
      width: 100%;
      height: auto;
      margin-bottom: 30px;
      .operate-area {
        border-top: 1px solid #DDDDDD;
        border-left: 1px solid #DDDDDD;
        border-right: 1px solid #DDDDDD;
        text-align: left;
        padding: 20px 30px;
      }
    }

    .link {
      color: #409EFF;
      text-decoration: underline;
      cursor: pointer;
    }
    .thumbnail{
      cursor: pointer;
      vertical-align: middle;
      width: 45px;
      height: 45px;
    }
  }

</style>
