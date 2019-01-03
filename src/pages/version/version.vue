<template>
  <div class="main">
    <h1>Project</h1>
    <div class="search-area">
      <el-input v-model.trim="queryWord" placeholder="version name" @keyup.enter.native="getVersionList(1)">
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getVersionList(1)">
        </i>
      </el-input>
			<el-date-picker :editable="true" v-model="date" type="datetimerange" range-separator="~" start-placeholder="create time start" end-placeholder="create time end" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :unlink-panels="true">
			</el-date-picker>
      <el-button type="primary" class="btn-search" @click="getVersionList(1)">Search</el-button>
      <el-button @click="reset">Reset</el-button>

    </div>

    <el-dialog title="Create Version" :visible.sync="dialogFormVisible" center>
      <el-form :model="versionForm" :rules="rules" ref="versionForm" @submit.native.prevent>
        <div v-if="isNewVersion">
          <el-form-item label="Name:" :label-width="formLabelWidth" required prop="versionName">
            <el-input v-model.trim="versionForm.versionName" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="Name:" :label-width="formLabelWidth" required prop="versionName">
            <span>{{versionForm.versionName}}</span>
          </el-form-item>
        </div>


        <el-form-item label="Description:" :label-width="formLabelWidth" required prop="versionDescription">
          <el-input
            type="textarea"
            :rows="3"
            maxlength="200"
            placeholder=""
            v-model.trim="versionForm.versionDescription">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">Cancle</el-button>

        <el-button v-if="isNewVersion" type="primary" @click="createVersionConfirm()">Confirm</el-button>
        <el-button v-else type="primary" @click="modifyVersionConfirm()">Confirm</el-button>
      </div>
    </el-dialog>

    <div class="table-area">
      <div class="operate-area">
        <el-button type="primary" @click="createProject">Add Version</el-button>
        <el-button type="success" @click="createProject">Generate</el-button>
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
          label="Version Name"
        >
          <template slot-scope="scope">
            <a class="link">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Version Description"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="created"
          label="Create Time"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="Operate"
          width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="modifyVersion(scope.row)">Modify
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="">Files
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="">Upload
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
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="req.pageSize"
                   layout=" prev, pager, next,total,sizes"
                   :total="totalPages">
    </el-pagination>


  </div>

</template>

<script>
	import { formatDate } from '@/utils/date';
  export default {
    name: 'project',
    data() {
      const checkVersionName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('please input the name of version'));
          return;
        }
        let param = {
        	projectId: this.projectId,
          versionName: this.versionForm.versionName
        };
        this.$post('api/versionName', param).then(res => {
          if (res.state !== 0) {
            callback(new Error('the name is exist'));
          } else {
            callback();
          }
        });
      };
      return {
        isLoading: false,
        isNewVersion: true,
        queryWord: '',
        projectId: this.$route.query.projectId,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        date: this.setDate(),
        versionForm: {
          versionName: '',
          versionDescription: ''
        },
        rules: {
          versionName: [
          	{ required: true, message: 'please input the name of version', trigger: 'blur' },
            { max: 30, message: 'within 30 characters please', trigger: 'change' },
            { validator: checkVersionName, trigger: 'blur' },
            { pattern: /^([\w\u4E00-\u9FA5_\-]+)+$/, message: 'only chinese character,letters,numbers and underscore are allowed ', trigger: 'change' }
          ],
          versionDescription: [
            { require: true, message: 'please input the description of project', trigger: 'blur' }
          ]
        },
        req: {
          pageIndex: 1,
          pageSize: 10
        },
        totalPages: 10,
        paginationShow: true,
        tableData: []
        // tableData: [{
        //   versionName: 'version 1.0',
        //   versionDescription: 'version 1.0描述',
        //   createTime: '2016-05-02',
        //   thumbnail: '--'
        // }]
      };
    },
    created () {
      this.getVersionList();
    },
    methods: {
      getVersionList (index) {
        let param = {
        	projectId: this.projectId,
          query:(encodeURIComponent(this.queryWord)),
          pageIndex: index || this.req.pageIndex,
          pageSize: this.req.pageSize
        };
        this.isLoading = true;
        this.$get('api/versionList',{}, param).then(res => {
          this.isLoading = false;
          if (res.state === 0) {
            this.tableData = res.data.versionList;
            this.req.pageSize = res.pagination.pageSize;
            this.req.pageIndex = res.pagination.currentPage;
            this.totalPages = res.pagination.totalPages;
          }
        });
      },
      setDate () {
	      let today = new Date();
	      let tomorrow = new Date();
	      tomorrow.setDate(tomorrow.getDate() + 1);
	      today = this.formatDate(today);
	      tomorrow = this.formatDate(tomorrow);
	      return [today, tomorrow];
	    },
	    formatDate (date) {
	      let year = date.getFullYear();
	      let month =
	        date.getMonth() + 1 < 10
	          ? '0' + (date.getMonth() + 1)
	          : date.getMonth() + 1;
	      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	      return `${year}-${month}-${day} 00:00:00`;
	    },
      reset () {
        this.queryWord = '';
        this.req.pageIndex = 1;
        this.getVersionList();
      },
      // handleDelete () {
      //   console.log('hi');
      // },
      handleSizeChange(val) {
        this.req.pageIndex = 1;
        this.req.pageSize = val;
        this.getVersionList();
      },
      handleCurrentChange(val) {
        this.req.pageIndex = val;
        this.getVersionList();
      },
      tableRowClassName(row) {
        row.row.index = row.rowIndex; // 为了获取行号
      },
      formatter (row, column, cellValue) {
        // 放回索引值
        return this.req.pageSize * (this.req.pageIndex - 1) + 1 + row.index;
      },
      cancle () {
        this.$refs['versionForm'].resetFields();
        this.dialogFormVisible = false;
      },
      createProject () {
        this.isNewVersion = true;
        this.dialogFormVisible = true;
      },
      modifyVersion (row) {
        this.isNewVersion = false;
        this.dialogFormVisible = true;
        this.versionForm.versionName = row.name;
        this.versionForm.versionDescription = row.description;
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
          this.dialogFormVisible = false;
          this.getVersionList(1);
        }
      },
      createVersionConfirm () {
        this.$refs['versionForm'].validate((valid) => {
          if (valid) {
            let param = {
            	projectId: this.projectId,
              versionName: this.versionForm.versionName,
              versionDescription: this.versionForm.versionDescription
            };
            this.$post('api/version', param).then(res => {
              this.handleResult(res);
            });
          }
        });
      },
      modifyVersionConfirm () {
        let param = {
          projectId: this.projectId,
          versionName: this.versionForm.versionName,
          versionDescription: this.versionForm.versionDescription
        };
        this.$put('api/version', param).then(res => {
          this.handleResult(res);
        });
      },
      dateFormat(row, column, cellValue, index){
        const  daterc= row[column.property];
        if(daterc!=null){
          const dateMat= new Date(daterc);
          return formatDate(dateMat,"yyyy-MM-dd hh:mm:ss");
        }
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
      .btn-search {
      	margin-left: 20px;
      }
    }

    .table-area {
      background-color: @whiteBGColor;
      width: 100%;
      height: auto;
      margin-bottom: 30px;
      .operate-area {
        text-align: left;
        padding: 20px 30px;
      }
    }

    .link {
      color: #409EFF;
      text-decoration: underline;
      cursor: pointer;
    }
  }

</style>