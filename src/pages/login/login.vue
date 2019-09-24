<template>
    <div style="height: 100%;overflow: hidden;">
        <img class="img" src="../../assets/images/2.jpg"/>
        <div class="login">
            <el-form :model="loginForm" :rules="loginRules">         
            <h2>iModel Web Login</h2>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" name="username" placeholder="UserName" auto-complete="on"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input  v-model="loginForm.password" name="password" placeholder="Password" auto-complete="on" ></el-input>
            </el-form-item>

            
            <el-form-item>
                <el-button type="primary">Login</el-button>
            </el-form-item>
            <el-form-item>
                <router-link :to="{ path: 'register'}">Register</router-link>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>


export default {
  name: "login",
  data() {
    return {
        loginForm: {
            username: '',
            password: '',
        },
        loginRules: {
        username: [
            {
                required: true,

                message: "please input user name",

                trigger: "blur"
            }
        ],
        password: [
           {
               required: true,
               message: 'please input password name',
               trigger: 'blur'
           }
        ]
      }
    }
  },
  components: {
  
  },
  methods: {
      start(){
          
      }
  }
};
</script>
<style lang="less">
.el-input {
        width:300px;
}    
.img{
    width: 100%;
    height: auto;
    opacity: 0.6;
}
.login{
    background: none no-repeat scroll 0 0 rgba(0,0,0,0.6);
    padding: 22px 41px 33px;
    position: absolute;
    top: 22%;
    right: 10%;
    width: 500px;
    h2 {
        color:white
    }
    a{
        color: white;
    }

}

</style>