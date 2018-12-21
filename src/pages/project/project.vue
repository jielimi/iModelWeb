<template>
    <div class="main">
      <h1>Project</h1>
      <div class="oper-area">
        <el-autocomplete
          v-model="projectName"
          :fetch-suggestions="querySearch"
          placeholder="project name"
          @select="handleSelect"
        >
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="">
          </i>
        </el-autocomplete>
        <el-button type="primary" @click="dialogFormVisible = true">Create Project</el-button>
      </div>

      <el-dialog title="Create Project" :visible.sync="dialogFormVisible" center>
        <el-form :model="form">
          <el-form-item label="Project Name" :label-width="formLabelWidth">
            <el-input v-model="form.projectName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Project Description" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :rows="3"
              placeholder=""
              v-model="form.projectDescription">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancle</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
        </div>
      </el-dialog>

      <div class="table-area">
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
            prop="createTime"
            label="Create Time"
            >
          </el-table-column>
          <el-table-column
            prop="thumbnail"
            label="image">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="operate"
            width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">Modify</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'project',
    data () {
      return {
        projectName: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          projectName: '',
          projectDescription: ''
        },
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
    methods: {
      handleSelect () {
        console.log('hi');
      },
      querySearch () {
        console.log('hi');
      },
      handleEdit () {
        console.log('hi');
      },
      handleDelete () {
        console.log('hi');
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
    .oper-area{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 10px 30px;
      background-color: @whiteBGColor;
      height: 100px;
      width: 100%;
      border:1px solid @defaultBorderColor;
      margin-bottom: 20px;
    }

    .table-area{
      background-color: @whiteBGColor;
      width: 100%;
      height: auto;
    }

    .link{
      color: #409EFF;
      text-decoration: underline;
      cursor: pointer;
    }
  }

</style>
