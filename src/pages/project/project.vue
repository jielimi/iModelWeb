<template>
    <div class="main">
      <h1>Project</h1>
      <div class="oper-area">
        <el-autocomplete
          v-model="projectName"
          :fetch-suggestions="querySearch"
          placeholder=""
          @select="handleSelect"
        >
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="">
          </i>
        </el-autocomplete>
        <el-button type="primary">Create Project</el-button>
      </div>
      <div class="table-area">
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="projectName"
            label="Project Name"
            width="180">
          </el-table-column>
          <el-table-column
            prop="projectDescription"
            label="Project Description"
            width="180">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="Create Time">
          </el-table-column>
          <el-table-column
            prop="thumbnail"
            label="image">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="operate"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">modify</el-button>
              <el-button type="text" size="small">del</el-button>
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
        tableData: [{
          projectName: '项目1',
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
      handleClick () {
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
  }

</style>
