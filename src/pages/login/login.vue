<template>
<div class="box">
  <div class="background-login">
        <img class="img" id="img" src="../../assets/images/fa.png"/>
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
                <el-input  v-model.number="loginForm.identityCode" autocomplete="off" placeholder="Vertify Code"></el-input>
              </div>
            </el-form-item>

            <el-form-item >
              <div>
                <img @load="verifyLoadState=true"  @click="toggleVerify()" :src="img_src" alt="">
              </div>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="login">Login</el-button>
            </el-form-item>
            <!-- <el-form-item>
                <router-link :to="{ path: 'register'}">Register</router-link>
            </el-form-item> -->
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
    position: absolute;
    top: 2rem;
    left: 0;
}
.el-input {
    width:300px;
}    
.img{
    height: auto;
    width: 30%;
}
.box{
  width: 100%;
  height: 100%;
}
.box:before{
  content:'';
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}
.login{
    vertical-align: middle;
    height: 50%;
    display: inline-block;
    h2 {
      text-shadow: 0 1px 4px rgba(0,0,0,.2);
       
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
  .vertifyCode img{
    height: 40px;
    cursor: pointer;
    position: absolute;
    background-color: white;
    width: 100px;
  }

</style>