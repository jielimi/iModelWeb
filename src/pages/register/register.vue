<template>
    <div style="height: 100%;overflow: hidden;">
        <!-- <img class="img" src="../../assets/images/2.jpg"/> -->
        <img class="img" id="img" src="../../assets/images/fa.png"/>
        <ul class="bg-bubbles">
          <li v-for="(item, index) in bubbles" :key="index"></li>
        </ul>
        
        <div class="login">
          <el-form :model="registerForm" :rules="registerRules">         
            <h2>Create Your Account</h2>
            <el-form-item prop="username">
                <el-input v-model="registerForm.username" name="username" placeholder="UserName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input  v-model="registerForm.password" name="password" placeholder="Password" type="password" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input  v-model="registerForm.chkPassword" name="chkPassword" placeholder="Confirm Password" type="password" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item prop="mail">
                <el-input v-model="registerForm.mail" name="mail" type="email" placeholder="Mail" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="company">
                <el-input v-model="registerForm.company" name="company" placeholder="Company" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="position">
                <el-input v-model="registerForm.position" name="position" placeholder="Position" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="telephone">
                <el-input v-model="registerForm.telephone" name="telephone" type="telephone" placeholder="Telephone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="register">Submit</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>
<script>

export default {
  name: "register",
  data() {
    const checkname = (rule, value, callback) => {
      if (!value) {
        callback(new Error('please input user name'));
        return;
      }
      let param = {
        username: this.registerForm.username
      };
      this.$post('api/user/name', param).then(res => {
        if (res.state !== 0) {
          callback(new Error('the name is exist'));
        } else {
          callback();
        }
      });
    };
    return {
      bubbles:[1,2,3,4,5,6,7,7,7,9,10,9],
      registerForm: {
          username: '',
          password: '',
          chkPassword: '',
          mail: '',
          company: '',
          position: '',
          telephone: ''
      },
      registerRules: {
        username: [
            {
              required: true,
              message: "please input user name",
              trigger: "blur"
            },
            {
              validator: checkname,
              trigger: 'blur'
            }
        ],
        password: [
          {
            required: true,
            message: 'please input password',
            trigger: 'blur'
          }
        ],
        chkPassword: [
          {
            required: true,
            message: 'please input password',
            trigger: 'blur'
          }
        ],
        mail: [
          {
            required: true,
            message: 'please input mail',
            trigger: 'blur'
          }
        ],
        company: [
          {
            required: true,
            message: 'please input company',
            trigger: 'blur'
          }
        ],
        position: [
          {
            required: true,
            message: 'please input position',
            trigger: 'blur'
          }
        ],
        telephone: [
          {
            required: true,
            message: 'please input telephone',
            trigger: 'blur'
          }
        ]
      
      }
    }
  },
  components: {
  },
  mounted () {
  },
  created() {
    
  },
  methods: {
      register(){
        let param = {
          username:this.registerForm.username,
          password:this.registerForm.password,
          mail:this.registerForm.mail,
          company:this.registerForm.company,
          position:this.registerForm.position,
          telephone:this.registerForm.telephone
        }
        this.$post('api/user/register',param).then(res=>{
           if(res.state !== 0) {
              this.$message({
                message:res.message,
                type:'warning'
              })
           }
           else{
            this.$router.push({'path':'/login'});
           }
        })
      }
  }
};
</script>
<style lang="less">
.el-input {
        width:300px;
}    
.img{
    height: auto;
    width: 50%;
    opacity: 0.6;
}
.login{
    background: none no-repeat scroll 0 0 rgba(0,0,0,0.6);
    padding: 22px 41px 33px;
    position: absolute;
    top: 30px;
    right: 10%;
    width: 500px;
    h2 {
        color:white
    }
    a{
        color: white;
    }
}

.bg-bubbles {
    position: absolute;
    margin: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    li {
      position: absolute;
      bottom: -160px;
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.5);
      list-style: none;
      animation: square 15s infinite;
      transition-timing-function: linear;
      &:nth-child(1) {
        left: 10%;
      }
      &:nth-child(2) {
        left: 20%;
        width: 90px;
        height: 90px;
        animation-delay: 2s;
        animation-duration: 7s;
      }
      &:nth-child(3) {
        left: 25%;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-duration: 8s;
        background-color: rgba(255, 255, 255, 0.3);
      }
      &:nth-child(5) {
        left: 70%;
      }
      &:nth-child(6) {
        left: 80%;
        width: 120px;
        height: 120px;
        animation-delay: 3s;
        background-color: rgba(255, 255, 255, 0.2);
      }
      &:nth-child(7) {
        left: 32%;
        width: 160px;
        height: 160px;
        animation-delay: 2s;
      }
      &:nth-child(8) {
        left: 55%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
        animation-duration: 15s;
      }
      &:nth-child(9) {
        left: 25%;
        width: 10px;
        height: 10px;
        animation-delay: 2s;
        animation-duration: 12s;
        background-color: rgba(255, 255, 255, 0.3);
      }
      &:nth-child(10) {
        left: 85%;
        width: 160px;
        height: 160px;
        animation-delay: 5s;
      }
    }
    // 自定义 square 动画；
    @keyframes square {
      0% {
        opacity: 0.5;
        transform: translateY(0px) rotate(45deg);
      }
      25% {
        opacity: 0.75;
        transform: translateY(-400px) rotate(90deg)
      }
      50% {
        opacity: 1;
        transform: translateY(-600px) rotate(135deg);
      }
      100% {
        opacity: 0;
        transform: translateY(-1000px) rotate(180deg);
      }
    }
  }

</style>