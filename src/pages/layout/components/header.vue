<template>
  <div>
    <header>
       <img  class="logo" src="../../../assets/images/site_logo.png">
       <div class="title">imodel web app</div>
    </header>
  </div>

</template>

<script>
  export default {
    name: "imodel-header",
    created(){

    },
    methods: {

    }

  }
</script>

<style lang="less" scoped>
  @import "../../../assets/css/color.less";
  header{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:flex-start;
    box-sizing: border-box;
    padding: 14px 30px 14px 100px;
    height: 78px;
    width: 100%;
    background-color: @white;
    .logo{
      /*align-self: flex-start;*/
    }
    .title{
      align-self: center;
    }
  }

</style>
