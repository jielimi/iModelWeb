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
        <el-button v-if="isNewVersion" type="primary" @click="createVersionConfirm()" :disabled="confirmDisable">Confirm</el-button>
        <el-button v-else type="primary" @click="modifyVersionConfirm()" :disabled="confirmDisable">Confirm</el-button>
      </div>
    </el-dialog>

    <div class="table-area">
      <div class="operate-area">
        <el-button type="primary" @click="createVersion">Add Version</el-button>
        <el-button type="success" @click="versionCompare" :disabled="!(multipleSelection && multipleSelection.length==2)">Version Compare</el-button>
      </div>
      <el-table
        ref="table"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName">
        <el-table-column
             :selectable="checkSelectable"
             type="selection">
        </el-table-column>
        <el-table-column
          label="Index"
          width="60"
          align="center"
          :formatter="formatter">
        </el-table-column>
        <el-table-column
          label="Version Name">
          <template slot-scope="scope">
            <a href="javascript:;" class="link" @click="skipToView(scope.row)" :class="{'link-disabled':!scope.row.generated}">
              <span>{{ scope.row.name }}</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Version Description">
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
          :formatter="dateFormat">
        </el-table-column>
        <el-table-column
          label="Operations"
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
              v-if="scope.row.generated===false"
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
					<el-upload class="uploader" accept=".dgn,.rvt"
					  :show-file-list="true"
					  :file-list="uploadPrimaryList"
					  :multiple="true"
					  :action="uploadParams.action"
					  :data="uploadParams.data"
					  :on-change="uploadOnChange"
					  :on-success="uploadMasterOnSuccess"
					  :on-error="uploadOnError"
					  :on-progress="uploadOnProgress"
					  :on-remove="removeMasterFile">
					  	<el-button @click="changeParam('0')" type="primary">Upload master file</el-button>
					</el-upload>
					<br />
					<el-upload class="uploader" accept=".dgn,.rvt"
					  :show-file-list="true"
					  :file-list="uploadReferenceList"
					  :multiple="true"
					  :action="uploadParams.action"
					  :data="uploadParams.data"
					  :on-change="uploadOnChange"
					  :on-success="uploadReferenceOnSuccess"
					  :on-error="uploadOnError"
					  :on-progress="uploadOnProgress"
            :on-remove="removeReferenceFile">
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

    <div class="cover" v-if="dialogVisible">
      <div class="img-wrap">
        <i class="iconfont icon-close" @click="closeCover"></i>
        <img :src='thumbnailSrc' width="500px"/>
      </div>
    </div>
   
    <uploadProgress @endQueryVersionGenerate="closeProgress" ref="progress" 
      :openDialog="showProgress" :projectId="projectId" :versionName="versionNameForGen" 
      :steps="steps">
    </uploadProgress>
    
  </div>

  

</template>

<script>
  import { formatDate } from '@/utils/date';
  import uploadProgress from '@/components/uploadProgress'
  // import { IModelBankAccessContext } from "@bentley/imodeljs-clients/lib/imodelbank/IModelBankAccessContext";
  // import { IModelApp } from "@bentley/imodeljs-frontend";

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
        this.$post('api/version/name', param).then(res => {
          if (res.state !== 0) {
            callback(new Error('the name is exist'));
          } else {
            callback();
          }
        });
      };
      return {
        dialogVisible:false,
        thumbnailSrc:'',
        isLoading: false,
        isNewVersion: true,
        queryWord: '',
        projectId: this.$route.query.projectId,
        projectName: this.$route.query.projectName,
        versionNameForGen:'',
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
          //action: 'http://47.251.5.15:3000/api/version/upload',
					action: 'http://127.0.0.1:5566/api/version/upload',
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
        referenceFileList: [],
        confirmDisable:false,
        showProgress:false,
        steps:[],
        multipleSelection : []
      };
    },
    created () {
      this.getVersionList();
    },
    components:{
      uploadProgress
    },
    methods: {
      checkSelectable(row){
        return row.generated;
      },
      clearSelection () {
        this.$refs.table.clearSelection();
      },
      versionCompare(){
        if(this.multipleSelection && this.multipleSelection.length !=2 ){
          return;
        }
        // const imbcontext = new IModelBankAccessContext(this.projectId, this.multipleSelection[0].url, IModelApp.hubDeploymentEnv);

        let param = {
          projectId:this.projectId,
          startversion:this.multipleSelection[0].index < this.multipleSelection[1].index ? this.multipleSelection[0].name:this.multipleSelection[1].name,
          endversion: this.multipleSelection[0].index > this.multipleSelection[1].index ? this.multipleSelection[0].name:this.multipleSelection[1].name,
        }

        this.$get('api/version/difference',{}, param).then(res => {
          this.isLoading = false;
          if (res.state === 0) {
           
          }
        });
        this.clearSelection();
      },
      handleSelectionChange(val){
      
        this.multipleSelection = val;
      },
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
        this.$get('api/version/list',{}, param).then(res => {
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
	      today = formatDate(today, 'yyyy-MM-dd 23:59:59');
	      start = formatDate(start, 'yyyy-MM-dd');
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
        this.confirmDisable = false;
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
            this.confirmDisable = true;
            this.$post('api/version/instance', param).then(res => {
              this.handleResult(res);
            });
          }
        });
      },
      skipToView(row){
        if(row.generated === false){
          return false;
        }
        // this.$router.push({path:'view',query:{projectId: row.projectId,versionName: row.name,url:row.url}});
        let routeData = this.$router.resolve({ path: 'view', query: {projectId: row.projectId,versionName: row.name,versionId: row.versionId,url: row.url}});
        window.open(routeData.href, '_blank'); 
      },
      modifyVersionConfirm () {
        let param = {
          projectId: this.projectId,
          versionName: this.versionForm.versionName,
          versionDescription: this.versionForm.versionDescription
        };
        this.confirmDisable = true;
        this.$put('api/version/instance', param).then(res => {
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
      uploadOnProgress(e,file){
      	//开始上传
				// console.log(e.percent,file)
				this.progress = Math.floor(e.percent)
			},
			uploadOnChange(file){
				// console.log("——————————change——————————")
				// console.log(file)
				if(file.status == 'ready'){
					// console.log("ready")
					// this.pass = null;
					this.progress = 0;
				}else if(file.status == 'fail'){
					this.$message.error("Uploaded error,please try again！")
				}
			},
      uploadMasterOnSuccess(response, file, fileList){
        if(response.state === 0){
          this.$message.success("Successfully uploaded.");
        }else {
          this.uploadPrimaryList = [];
          this.uploadReferenceList = [];
          this.$message.error(response.message);
        }
      },
      uploadReferenceOnSuccess(response, file, fileList){
        if(response.state === 0){
          this.$message.success("Successfully uploaded.");
        }else {
          this.uploadReferenceList = [];
          this.$message.error(response.message);
        }
      },
			uploadOnError(e,file){
				// console.log("——————————error——————————")
				// this.pass = false;
			},
			removeMasterFile (file,fileList){
        let param = {
          type: '0',
          projectId: this.projectId,
          versionName: this.uploadParams.data.versionName,
          fileName: file.name
        };
        this.isLoading = true;
				this.$del('api/version/file', param).then(res => {
          this.isLoading = false;
          if(res.state != 0) {
            fileList.push(file);
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
        });
      },
      removeReferenceFile (file,fileList){
        let param = {
          type: '1',
          projectId: this.projectId,
          versionName: this.uploadParams.data.versionName,
          fileName: file.name
        };
        this.isLoading = true;
        this.$del('api/version/file', param).then(res => {
          this.isLoading = false;
          if(res.state != 0) {
            fileList.push(file);
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
        });
      },
      closeProgress() {
        this.showProgress = false;
        this.getVersionList();
      },
      Generate(row) {
        let param = {
        	projectId: this.projectId,
          versionName: row.name
        }; 

        this.versionNameForGen = row.name;

        let that = this;

        this.$post('api/version/gen',param).then(res=>{
          if(res.state != 0) {
            this.$message({
              message:res.message,
              type:'warning'
            })
          }else{
              this.$get('api/version/steps',{},param).then(res=>{
                if(res.state == 0) {
                  that.steps = res.data.steps;
                  that.showProgress = true;
                  that.$refs.progress.startQuery();
                }
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
				this.uploadReferenceList = [];
			},
      expandThumbNail(base64src){
        this.dialogVisible = true;
        this.thumbnailSrc = base64src;
      },
      closeCover(){
        this.dialogVisible = false;
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
    z-index: 998;
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
    .link-disabled {
      color: #999;
      text-decoration: none;
      cursor: default;
    }
    .el-upload button {
    	width: 142px;
    	text-align: center;
    }
    .thumbnail{
      cursor: pointer;
      vertical-align: middle;
      width: 45px;
      height: 45px;
    }
  }

</style>