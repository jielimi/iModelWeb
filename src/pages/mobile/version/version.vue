<template>
  <div class="main" v-loading="isLoading">
  	<el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
		  <el-breadcrumb-item :to="{ path: '/' }">Project</el-breadcrumb-item>
		  <el-breadcrumb-item>Version</el-breadcrumb-item>
		</el-breadcrumb>
		<br />
    <h1>{{ projectName }}</h1>

    <div class="table-area">
      <el-table
        ref="table"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          label="Version Name">
          <template slot-scope="scope">
            <a href="javascript:;" class="link" @click="skipToView(scope.row,1)" :class="{'link-disabled':!scope.row.generated}">
              <span>{{ scope.row.name }}</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Version Description">
        </el-table-column>
        <el-table-column
          prop="versionType"
          label="Version Type"
          :formatter="typeFormat">
        </el-table-column>
        <el-table-column
          align="center"
          prop="created"
          label="Created"
          :formatter="dateFormat">
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
  import uploadProgress from '@/components/uploadProgress'
  import { getCookie} from '@/utils/cookies';

  export default {
    name: 'project',
    mounted(){
      this.reset();
    },
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
        readOnlyAuth:false,
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
          versionDescription: '',
          versionType:0
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
      this.readOnlyAuth = getCookie('readonly') === 'true'?true:false;
    },
    components:{
      uploadProgress
    },
    methods: {
      getVersionList (index) {
        let param = {
        	projectId: this.projectId,
          versionName:(encodeURIComponent(this.queryWord)),
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
      cancel () {
        this.$refs['versionForm'].resetFields();
        this.versionForm.versionName = '';
        this.versionForm.versionDescription = '';
        this.dialogFormVisible = false;
      },
      skipToView(row,openMode){
        if(row.generated === false){
          return false;
        }
        let routeData = this.$router.resolve({ path: 'view', query: {projectId: row.projectId,versionName: row.name,versionId: row.versionId,url: row.url,openMode:openMode}});
        window.open(routeData.href, '_blank'); 
      },
      dateFormat(row, column, cellValue, index){
        const  daterc= row[column.property];
        // console.log(new Date("2019-01-04T07:58:24.927Z"));
        if(daterc!=null){
          const dateMat= new Date(daterc);
          return formatDate(dateMat,"yyyy-MM-dd hh:mm:ss");
        }
      },
      typeFormat(row, column, cellValue, index){
        const  data= row[column.property];
        if(data == 0){
          return 'Normal'
        }else{
          return 'Realty Model'
        }

      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../../assets/css/color.less";
  .breadcrumb {
    margin: 20px 0 0 5px;
    font-size: 16px;
  }
  h1 {
    text-align: center;
    font-size: 18px;
  }
  .main {
    .table-area {
      background-color: @whiteBGColor;
      width: 100%;
      height: auto;
      margin-bottom: 30px;
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