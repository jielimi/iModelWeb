<template>
  <div class="main" v-loading="isLoading">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">Project</el-breadcrumb-item>
		  <el-breadcrumb-item>Version</el-breadcrumb-item>
		</el-breadcrumb>
		<br />
    <h1 style="text-align:center;">{{ projectName }}</h1>
    <div class="search-area">
      <el-input v-model.trim="queryWord" placeholder="version name" @keyup.enter.native="getVersionList(1)">
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getVersionList(1)">
        </i>
      </el-input>
			<el-date-picker :editable="true" v-model="date" type="datetimerange" range-separator="~" start-placeholder="create time start" end-placeholder="create time end" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :unlink-panels="true">
			</el-date-picker>
      <el-button type="primary" class="btn-search" @click="getVersionList(1)">Search</el-button>
      <el-button @click="reset">Reset</el-button>

    </div>

    <el-dialog title="Create Version" :close-on-click-modal="false" :visible.sync="dialogFormVisible" center>
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
        <el-button type="primary" @click="createVersion">Add Version</el-button>
        <!-- <el-button type="success" @click="Generate">Generate</el-button> -->
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
          label="Operate"
          width="380">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="modifyVersion(scope.row)">Modify
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="getFiles(scope.row)">Files
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="uploadFiles(scope.row)">Upload
            </el-button>
            <el-button
            	v-if="scope.row.generated===false"
              type="success"
              size="mini"
              @click="Generate(scope.row)">Generate
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="Upload Files" :close-on-click-modal="false" @close="clearUploadList" :visible.sync="uploadVisible" center>
        <div class="file-upload">
					<el-upload class="uploader" accept=".dgn"
					  :show-file-list="true"
					  :file-list="uploadPrimaryList"
					  :multiple="true"
					  :action="uploadParams.action"
					  :data="uploadParams.data"
					  :on-change="uploadOnChange"
					  :on-success="uploadOnSuccess"
					  :on-error="uploadOnError"
					  :on-progress="uploadOnProgress"
					  :on-remove="removeFile">
					  	<el-button @click="changeParam('0')" type="primary">Upload master file</el-button>
					</el-upload>
					<br />
					<el-upload class="uploader" accept=".dgn"
					  :show-file-list="true"
					  :file-list="uploadReferenceList"
					  :multiple="true"
					  :action="uploadParams.action"
					  :data="uploadParams.data"
					  :on-change="uploadOnChange"
					  :on-success="uploadOnSuccess"
					  :on-error="uploadOnError"
					  :on-progress="uploadOnProgress">
					  	<el-button @click="changeParam('1')" type="primary">Upload reference file</el-button>
					</el-upload>
				</div>
    </el-dialog>
    <el-dialog title="File List" :close-on-click-modal="false" :visible.sync="dialogFileList" center>
    	<el-tabs v-model="activeTab">
		    <el-tab-pane label="Master file" name="master">
		    	<ul>
						<li v-for="file in masterFileList">
						  <p>{{ file.name }}</p>
						</li>
					</ul>
		    </el-tab-pane>
		    <el-tab-pane label="Reference file" name="reference">
		    	<ul>
						<li v-for="file in referenceFileList">
						  <p>{{ file.name }}</p>
						</li>
					</ul>
		    </el-tab-pane>
		  </el-tabs>
    </el-dialog>
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
        projectName: this.$route.query.projectName,
        dialogFormVisible: false,
        uploadVisible: false,
        dialogFileList: false,
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
          pageSize: 5
        },
        totalNum: 0,
        paginationShow: true,
        tableData: [],
        uploadParams: {
					action: 'http://127.0.0.1:3000/api/version/upload',
					data: {
						type: '0',
						projectId: '',
						versionName: ''
					}
				},
				activeTab: 'master',
				uploadPrimaryList:[],
				uploadReferenceList:[],
				masterFileList: [],
				referenceFileList: []
      };
    },
    created () {
      this.getVersionList();
    },
    methods: {
      getVersionList (index) {
        let param = {
        	projectId: this.projectId,
          versionName:(encodeURIComponent(this.queryWord)),
          startTime:this.date?new Date((this.date)[0]).toISOString():'',
          endTime:this.date?new Date((this.date)[1]).toISOString():'',
          pageIndex: index || this.req.pageIndex,
          pageSize: this.req.pageSize
        };

        function removeProperty (object) {
        for (let prop in object) {
          if (
            object[prop] === '' ||
            typeof object[prop] === 'undefined' ||
            object[prop] === 'undefined'
          ) {
            delete object[prop];
          }
        }
      }
      removeProperty(param);
      	this.isLoading = true;
        this.$get('api/versionList',{}, param).then(res => {
          this.isLoading = false;
          if (res.state === 0) {
            this.tableData = res.data.versionList;
            this.req.pageSize = res.pagination.pageSize;
            this.req.pageIndex = res.pagination.currentPage;
            this.totalNum = res.pagination.totalNum;
          }
        });
      },
      setDate () {
	      let today = new Date();
	      let start = new Date();
	      start.setDate(start.getDate() - 30);
	      today = formatDate(today, 'yyyy-MM-dd hh:mm:ss');
	      start = formatDate(start, 'yyyy-MM-dd hh:mm:ss');
	      return [start, today];
	    },
      reset () {
        this.date = this.setDate();
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
        this.versionForm.versionName = '';
        this.versionForm.versionDescription = '';
        this.dialogFormVisible = false;
      },
      createVersion () {
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
          this.reset();
          this.getVersionList(1);
          this.$refs['versionForm'].resetFields();
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
        });""
      },
      dateFormat(row, column, cellValue, index){
        const  daterc= row[column.property];
        // console.log(new Date("2019-01-04T07:58:24.927Z"));
        if(daterc!=null){
          const dateMat= new Date(daterc);
          return formatDate(dateMat,"yyyy-MM-dd hh:mm:ss");
        }
      },
      uploadFiles (row) {
      		this.uploadParams.data.projectId = this.projectId;
      		this.uploadParams.data.versionName = row.name;
      		this.uploadVisible = true;
      },
      changeParam (type) {
      	this.uploadParams.data.type = type;
      },
      uploadOnProgress(e,file){//开始上传
				// console.log(e.percent,file)
				this.progress = Math.floor(e.percent)
			},
			uploadOnChange(file){
				// console.log("——————————change——————————")
				// console.log(file)
				if(file.status == 'ready'){
					// console.log("ready")
					this.pass = null;
					this.progress = 0;
				}else if(file.status == 'fail'){
					this.$message.error("上传出错，请重试！")
				}
			},
			uploadOnSuccess(e,file){//上传附件
				// console.log("——————————success——————————")
				this.pass = true;
				this.$message.success("上传成功")
				// this.imagelist.push({
				// 	url: file.url,
				// 	name: '新增'
				// })
			},
			uploadOnError(e,file){
				// console.log("——————————error——————————")
				this.pass = false;
			},
			removeFile (file){
				// this.$delete('api/version/file', param).then(res => {
          
    //     });
      },
      Generate(row) {
        let param = {
        	projectId: this.projectId,
          versionName: row.name
        };
        this.isLoading = true;
        this.$post('api/version/gen',param).then(res=>{
          this.isLoading = false;
          if(res.state != 0) {
            this.$message({
              message:res.message,
              type:'warning'
            })
          }else{
            this.$message({
              message:res.message,
              type:'success'
            })
          }
        })
      },
			getFiles(row){
				this.masterFileList = [];
        this.referenceFileList = [];
				this.dialogFileList = true;
				let param = {
        	projectId: this.projectId,
          versionName: encodeURIComponent(row.name)
        };
        var that = this;
				this.$get('api/version/fileList',{}, param).then(res => {
          res.data.fileList.forEach(function(value,index){
          	if(value.type === 0){
          		that.masterFileList.push(value);
          	}else {
          		that.referenceFileList.push(value);
          	}
          });
        });
			},
			clearUploadList(){
				this.uploadPrimaryList = [];
				this.uploadReferenceList = []
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
    .el-upload button {
    	width: 142px;
    	text-align: center;
    }
  }

</style>