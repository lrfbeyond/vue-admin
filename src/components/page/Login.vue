<template>
    <div class="login-wrap">
        <div class="hw-login">
            <div class="hw-title">HW网站管理系统</div>
            <el-form ref="loginForm" :model="loginForm" :rules="rules" @submit.prevent="submitForm('loginForm')">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="loginForm.code" type="text" placeholder="请输入验证码" style="width:140px"></el-input>
                    <img :src="codeImg" alt="点击刷新" title="点击刷新" class="code-img" @click="refreshCode()">
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" native-type="submit"  @click.prevent="submitForm('loginForm')">{{loading ? '登录中' : '登录'}}</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
// import { mapActions } from 'vuex'
// import { STORAGE_KEY } from '../../utils/storage' 496081

export default {
  data () {
    return {
      loading: false,
      codeImg: '',
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'change'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'change'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      console.log(formName)
      // const self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          var formData = this.loginForm
          // var params = new URLSearchParams();
          // params.append('username', this.loginForm.username)
          // params.append('password', this.loginForm.password)
          axios.post('/api/auth', formData)
          .then((res) => {
            if (res.data.result === 'success') {
              this.loading = false
              this.$message({
                message: '登录成功！',
                type: 'success'
              })
              sessionStorage.setItem('hw_username', res.data.uname)
              sessionStorage.setItem('token', res.data.token)
              this.$router.push('/main')
            } else {
              this.loading = false
              this.$message.error(res.data.msg)
              this.refreshCode();
            }
          }).catch((err) => {
            this.loading = false
            this.$message.error('出错了')
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          // return false
        }
      })
    },
    refreshCode () {
      this.codeImg = '/api/auth/captcha'+ '?'+ Math.random()*1000;
    }
  },
  mounted: function() {
    this.refreshCode();
  }
}
</script>

<style scoped>

.login-wrap{
    position: fixed;
    width: 100%;
    height: 100%;
    background: #1F2D3D url(../../assets/bg.jpg);
}
.hw-title{
    font-weight: bold;
    font-size: 1.4rem;
    height: 2.5rem;
    text-align: center;
}
.hw-login{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 260px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px; 
    background: #fff;
    box-shadow: 3px 3px 2px #888;
}
.code-img{
  vertical-align: middle;
  cursor: pointer;
}
.el-button{
  width: 100%
}
</style>