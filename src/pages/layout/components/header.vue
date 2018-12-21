<template>
  <div>
    <header>
       <img  class="logo" src="../../../assets/images/site_logo.png">

      <div>
        <el-dropdown>
        <span class="el-dropdown-link">
          <img  class="user" src="../../../assets/images/avatarDefault.png"><i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>Change Password</el-dropdown-item>
            <el-dropdown-item>Logout</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>


    </header>
  </div>

</template>

<script>
  export default {
    name: 'imodel-header',
    created () {

    },
    methods: {

    }

  }
</script>

<style lang="less" scoped>
  @import "../../../assets/css/color.less";
  header{
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:center;
    box-sizing: border-box;
    padding: 14px 100px 14px 100px;
    height: 78px;
    width: 100%;
    background-color: @white;
    .logo{
      /*align-self: flex-start;*/
    }
    .title{
      font-size: 16px;
      font-family: 'PingFangSC-Regular', arial, '\5fae\8f6f\96c5\9ed1', '\5b8b\4f53', sans-seri;
    }

    .user{
      width: 30px;
      height: 30px;
    }
  }

</style>
