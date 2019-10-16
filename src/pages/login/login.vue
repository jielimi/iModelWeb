<template>
<div style="width:100%;height:100%">
  <div class="background-login">
        <img class="img" id="img" src="../../assets/images/fa.png"/>
        <ul class="bg-bubbles">
            <li v-for="(item, index) in bubbles" :key="index"></li>
        </ul>
  </div>
  <div class="login" id="login">
            <el-form :model="loginForm" :rules="loginRules">         
            <h2>iModel Web</h2>
            <el-form-item prop="username">
                <el-input v-model="loginForm.useremail" name="useremail" placeholder="UserEmail" auto-complete="on"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input  v-model="loginForm.password" name="password"  v-if="pwdType == 'password'" placeholder="Password" type="password" auto-complete="on" maxlength=15></el-input>
                <el-input  v-model="loginForm.password" name="password"  v-else placeholder="Password" type="text" auto-complete="on" maxlength=15></el-input>

                <img :src="src" @click="changeType()" class="eyes"/>
            </el-form-item>

            <el-form-item label="" prop="identityCode">
              <div class="vertifyCode">
                <el-input  v-model.number="loginForm.identityCode" autocomplete="off"></el-input>
                <img @load="verifyLoadState=true"  @click="toggleVerify()" :src="img_src" alt="">
              </div>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="login">Login</el-button>
            </el-form-item>
            <el-form-item>
                <router-link :to="{ path: 'register'}">Register</router-link>
            </el-form-item>
        </el-form>
        </div>
</div>
    
</template>
<script>
import { setCookie } from '@/utils/cookies';
export default {
  name: "login",
  data() {
    return {
        pwdType: 'password',
        src:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAMAAABPqWaPAAAAwFBMVEUSi/cAAAA4n/kSjfcakPcolvfn8/7R6f7u9/7i8P4fkfg2n/gZkPcTjPkVjfgim/wTi/cSifYSjPcTjfgTjfj///8zjdk6ofgSivcbkvcSi/gSjPgUjPgTjfcUjfgTjPUdkPv0+v/8/v/w+f8Sivf///8Si/cRi/cSjPgTjPgTjfcTjPj///8YkPoWivgajfYgkPD///8bkfc8ofj5/f8Sivcakvj///8Si/grmPsUjPYbkvj4//8Tjvb///8bkfb/mfgJAAAAPnRSTlOAAPKG44b69fHi2vr2eTkN2tmLbGkNBeTYxKF+WFAzKBHr49PIxpSEb2VfSTsxIx0I+PLc19LQuKx8c0tIGw3kU54AAADeSURBVCjPZdHnrsIwDAVg+3LZpEA3dLD33rt9/7ciqR2pEudPIn2SlRMDyqxvDv5EiXFOJo67ieZC2NE2J5ujN0xGD+DY0liandQbJNUi6KxcEknX9K+Sp6XLYhT+icxCjkACAFG51h5PiUIlMQBRSZHPZCDsAmCqZzQmCXZgA6XbIPJn/HiItbSYWAzAkG6mz0SPXyDg3iK6tzOiXqKf/cGc510kUeWgR037T+CJJleOUYkiHqgrjxwtuA/zNJBLUULpWZpqqTc8rEnYIkuIxeojl3J6o5KfNDsvdXwBlrAYHNt6Kh8AAAAASUVORK5CYII=',
        img_src:'',
        verifyLoadState:true,
        bubbles:[1,2,3,4,5,6,7,7,7,9,10,9],
        loginForm: {
            useremail: '',
            password: '',
            identityCode:''
        },
        loginRules: {
        useremail: [
            {
                required: true,
                message: "please input user email",
                trigger: "blur"
            }
        ],
        password: [
           {
               required: true,
               message: 'please input password',
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
    this.toggleVerify();
  },
  methods: {
      toggleVerify(){
        if(!this.verifyLoadState) return;
        this.verifyLoadState =  false;
        const base = '/api/user/identifyCode'
        this.img_src = base + '?' + (new Date()).getTime();
      },
      login(){
          let param = {
              useremail:this.loginForm.useremail,
              password:this.loginForm.password,
              vertifyCode:this.loginForm.identityCode
          }

          if(!param.useremail || !param.useremail){
            this.$message({
                    message:"please input your name or your password",
                    type:'warning'
                })
            return;
          }

          if(!param.vertifyCode){
            this.$message({
                    message:"please input vertify code",
                    type:'warning'
                })
            return;
          }

          let that = this;

          this.$post('api/user/login',param).then(res=>{
             this.toggleVerify();
             if(res.state != 0) {
                this.$message({
                    message:res.message,
                    type:'warning'
                })
             }
             else{
                 setCookie('token',res.data.token,3600);
                 setCookie('refreshToken',res.data.refreshToken,3600*24);
                 setCookie('username',res.data.userName);
                 setCookie('readonly',res.data.readonly);
                  if(that.$route.query.redirect){
                    if(that.$route.query.redirect.indexOf("view?") != -1){
                      let test = '#'+that.$route.query.redirect
                       window.open(test, '_blank'); 
                    }else{
                      that.$router.push({'path':that.$route.query.redirect});
                    }
                    
                  }else{
                      that.$router.push({'path':'/'});
                  }
             }
          })
      },
      changeType () {
        this.pwdType = this.pwdType === 'password' ? 'type' : 'password';
        this.src =
          this.pwdType === 'password'
            ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAMAAABPqWaPAAAAwFBMVEUSi/cAAAA4n/kSjfcakPcolvfn8/7R6f7u9/7i8P4fkfg2n/gZkPcTjPkVjfgim/wTi/cSifYSjPcTjfgTjfj///8zjdk6ofgSivcbkvcSi/gSjPgUjPgTjfcUjfgTjPUdkPv0+v/8/v/w+f8Sivf///8Si/cRi/cSjPgTjPgTjfcTjPj///8YkPoWivgajfYgkPD///8bkfc8ofj5/f8Sivcakvj///8Si/grmPsUjPYbkvj4//8Tjvb///8bkfb/mfgJAAAAPnRSTlOAAPKG44b69fHi2vr2eTkN2tmLbGkNBeTYxKF+WFAzKBHr49PIxpSEb2VfSTsxIx0I+PLc19LQuKx8c0tIGw3kU54AAADeSURBVCjPZdHnrsIwDAVg+3LZpEA3dLD33rt9/7ciqR2pEudPIn2SlRMDyqxvDv5EiXFOJo67ieZC2NE2J5ujN0xGD+DY0liandQbJNUi6KxcEknX9K+Sp6XLYhT+icxCjkACAFG51h5PiUIlMQBRSZHPZCDsAmCqZzQmCXZgA6XbIPJn/HiItbSYWAzAkG6mz0SPXyDg3iK6tzOiXqKf/cGc510kUeWgR037T+CJJleOUYkiHqgrjxwtuA/zNJBLUULpWZpqqTc8rEnYIkuIxeojl3J6o5KfNDsvdXwBlrAYHNt6Kh8AAAAASUVORK5CYII='
            : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAASCAMAAACZ8IWSAAAAY1BMVEUSi/cAAAASifcTjPkTjfgajvYUjfgSi/cSjPcRjPcSjPgVi/czjdkTjPgSjfcTjfgVi/cSjfgSivcSivcSivcSi/gTi/YSivcTjPgTjPgTjfcTjPgWkPYgkPASjPkSjPMUifV0GXiLAAAAIXRSTlOAANl6ahExlIqFbiUFdWBaPDjSycespZ1lVE9JHAgqKhobG1qjAAAAm0lEQVQY03WRWRbCIAwAUwioLAVcu6r3P6WtJEq1nS/CPEIWqAinWyMldpYv2CQPBNrSqBoKevcxWsKC2pFJQOwPhZpMpPB6FOK0y+cwG03iIt6QihUMnElkzhQPgHS6CYL+QtAbJkEVVrM1UwUjrlQg1Vy1Mv9V29yp8r+dap4Ov2Lid6JjW9zL+2ILD2QRFG+BsZ3xsumfHL8A2V8Fj3TEBx8AAAAASUVORK5CYII='; // 用64位编码
    },
  }
};
</script>
<style lang="less">
.background-login{
  position: relative;
  // background: url("../../assets/images/fa.png") no-repeat;
  height: 100%;
  width: 50%;
  overflow: hidden;
  background-size: 100%;
}
.el-input {
        width:300px;
}    
.img{
    height: auto;
    width: 60%;
    opacity: 0.6;
}
.login{
    background: none no-repeat scroll 0 0 rgba(0,0,0,0.6);
    padding: 22px 41px 33px;
    position: absolute;
    top: 22%;
    right: 10%;
    width: 550px;
    h2 {
        color:white
    }
    a{
        color: white;
    }
    .eyes{
          top: 17px;
          position: absolute;
          height: 18px;
          width: 25px;
          right: 130px;
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
  
  .vertifyCode img{
    height: 40px;
    cursor: pointer;
    position: absolute;
    background-color: white;
    width: 100px;
  }

</style>