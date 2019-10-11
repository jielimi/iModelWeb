<template>
  <div class="main user" v-loading="isLoading">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">Project</el-breadcrumb-item>
		</el-breadcrumb>
		<br />
    <div class="search-area">
      <el-input v-model.trim="queryWord" placeholder="user name" @keyup.enter.native="getUserList(1)" maxlength="30">
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getUserList(1)"
          >
        </i>
      </el-input>
      <el-button type="primary" @click="getUserList(1)">Search</el-button>
      <el-button @click="reset">Reset</el-button>
    </div>
    <div class="table-area">
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
          prop="username"
          label="User Name"
        >
        </el-table-column>
        <el-table-column
          prop="mail"
          label="Email"
        >
        </el-table-column>
        <el-table-column
          prop="company"
          label="Company">
        </el-table-column>
        <el-table-column
          prop="position"
          label="Position">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="Telephone">
        </el-table-column>
        <el-table-column
          prop="approve"
          label="Approve"
          :formatter="statusFormat">
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
          label="Approve">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.approve"
              type="primary"
              @click="approve(scope.row.mail, true)">Approve
            </el-button>
            <el-button
              v-if="scope.row.approve && scope.row.username!=='Admin'"
              type="default"
              @click="approve(scope.row.mail, false)">Cancel 
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="Delete">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.username!=='Admin'"
              type="primary"
              @click="delUser(scope.row.mail)">Delete
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="ReadOnly">
          <template slot-scope="scope">
            <el-switch
              v-if="scope.row.username!=='Admin'"
              v-model="scope.row.readonly"
              @change="changeReadOnly($event,scope.row.mail)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  </div>

</template>

<script>
  import { formatDate } from '@/utils/date';
  import { IModelVersion } from '@bentley/imodeljs-common'
  export default {
    name: 'user',
    data() {
      return {
        dialogVisible:false,
        stdialogVisible:false,
        onlinedialogVisible:false,
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
      this.getUserList();
    },
    methods: {
      getUserList (index) {
        var param ={
          query: (encodeURIComponent(this.queryWord)),
          pageIndex: index || this.req.pageIndex,
          pageSize: this.req.pageSize
        }
        this.isLoading = true;
        this.$get('api/user/list',{},param).then(res => {
          this.isLoading = false;
          if (res.state === 0) {
            this.tableData = res.data.userList;
            this.req.pageSize = res.pagination.pageSize? res.pagination.pageSize : 10;
            this.req.pageIndex = res.pagination.currentPage? res.pagination.currentPage : 1;
            this.totalNum = res.pagination.totalNum;
          }
        });;
      },
      reset () {
        this.queryWord = '';
        this.req.pageIndex = 1;
        this.getUserList();
      },
      handleSizeChange(val) {
        this.req.pageIndex = 1;
        this.req.pageSize = val;
        this.getUserList();
      },
      handleCurrentChange(val) {
        this.req.pageIndex = val;
        this.getUserList();
      },
      tableRowClassName(row) {
        row.row.index = row.rowIndex; // 为了获取行号
      },
      formatter (row, column, cellValue) {
        // 放回索引值
        return this.req.pageSize * (this.req.pageIndex - 1) + 1 + row.index;
      },
      dateFormat(row, column, cellValue, index) {
        const  daterc= row[column.property];
        if(daterc!=null){
          const dateMat= new Date(daterc);
          return formatDate(dateMat,"yyyy-MM-dd hh:mm:ss");
        }
      },
      statusFormat(row, column){
      	return row.approve.toString();
      },
      delUser(mail){
          let param = {
            useremail:mail
          }
          this.$del('api/user/instance', param).then(res => {
		        if (res.state !== 0) {
		          this.$message({
	              message:res.message,
	              type:'warning'
	            });
		        } else {
		          this.$message({
	              message: 'success',
	              type:'success'
	            });
	            this.getUserList();
		        }
		      });
      },
      changeReadOnly($event,mail){
        let param = {
          useremail:mail,
          readonly: $event
        };
        this.$post('api/user/auth', param).then(res => {
          if (res.state !== 0) {
            this.$message({
              message:res.message,
              type:'warning'
            });
          } else {
            this.$message({
              message: 'success',
              type:'success'
            });
            this.getUserList();
          }
        });
      },
      approve(mail,action){
      	let operate = action? "approve" : "fail";
      	this.$confirm('Confirm to '+ operate + '?', '', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
        }).then(() => {
          let param = {
	        	useremail: mail,
	        	approve: action
		      };
		      this.$post('api/user/approve', param).then(res => {
		        if (res.state !== 0) {
		          this.$message({
	              message:res.message,
	              type:'warning'
	            });
		        } else {
		          this.$message({
	              message: 'success',
	              type:'success'
	            });
	            this.getUserList();
		        }
		      });
        }).catch(() => {
          return false;
        });
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
  }
</style>
