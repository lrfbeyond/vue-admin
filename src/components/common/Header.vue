<template>
    <div class="header">
        <div class="logo">
          HW网站内容管理系统<sup>{{version}}</sup>
        </div>
        <div class="user-info">
          <span><i class="iconfont icon-shouye"></i> <a href="http://www.helloweba.net/" target="_blank">网站首页</a></span>
          <span @click="dialogInfoVisible = true" class="header-info"><i class="iconfont icon-help"></i> 帮助</span>
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <i class="iconfont icon-wo"></i> {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="editpass">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">安全退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-dialog title="修改密码" :visible.sync="dialogEditpassFormVisible">
          <el-form ref="editpassForm" :model="editpassForm" :rules="rules" :label-width="formLabelWidth" @submit.prevent="submitForm('editpassForm')">
            <el-form-item label="旧密码" prop="oldpass">
              <el-input v-model="editpassForm.oldpass" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input v-model="editpassForm.password" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="password_confirm">
              <el-input v-model="editpassForm.password_confirm" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <div class="dialog-footer">
                <el-button @click="dialogEditpassFormVisible = false">取 消</el-button>
                <el-button type="primary" native-type="submit" @click.prevent="submitForm('editpassForm')">{{loading ? '提交中' : '确 定'}}</el-button>
            </div>
          </el-form>
          
        </el-dialog>

        <el-dialog title="系统信息" :visible.sync="dialogInfoVisible" width="40%">
          <el-form label-width="150px" class="sysinfo">
            <el-form-item label="系统名称">
              <span>HW网站内容管理系统</span>
            </el-form-item>
            <el-form-item label="当前版本">
              <span>博客版 {{version}}</span>
            </el-form-item>
            <el-form-item label="最后更新时间">
              <span>20180504</span>
            </el-form-item>
            <el-form-item label="作者">
              <span>月光光</span>
            </el-form-item>
            <el-form-item label="技术支持QQ">
              <span>13966913</span>
            </el-form-item>
            <el-form-item label="Email">
              <span>lrfbeyond@163.com</span>
            </el-form-item>
            <el-form-item label="网站">
              <span><a href="https://www.helloweba.net" target="_blank">www.helloweba.net</a></span>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>

<script>

export default {
  data () {
    return {
        loading: false,
        version: 'v2.0.2',
        formLabelWidth: '120px',
        dialogEditpassFormVisible: false,
        dialogInfoVisible: false,
        editpassForm: {
            oldpass: '',
            password: '',
            password_confirm: ''
        },
        rules: {
            oldpass: [
              {required: true, message: '请输入原密码', trigger: 'change'}
            ],
            password: [
              {required: true, message: '请输入新密码', trigger: 'change'}
            ],
            password_confirm: [
              {required: true, message: '请输入确认密码', trigger: 'change'}
            ]
          }
    }
  },
  computed: {
    username () {
      let username = sessionStorage.getItem('hw_username')
      //console.log(username);
      let uname = this.name
      if (username !== '') {
        uname = username
      }
      return uname
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'logout') {
        sessionStorage.removeItem('token')
        this.$router.push('/login')
      } else if(command === 'editpass') {
        this.dialogEditpassFormVisible = true;
      }
    },
    submitForm (formName) {
      // const self = this
      if (this.editpassForm.renewpass !== this.editpassForm.newpass) {
        this.$message.error('两次新密码输入不一致');
        return false;
      }

      this.$refs[formName].validate((valid) => {
        //console.log(valid);
        if (valid) {
          this.loading = true
          var formData = this.editpassForm
          // var params = new URLSearchParams();
          // params.append('oldpass', this.editpassForm.oldpass)
          // params.append('newpass', this.editpassForm.newpass)
          this.$axios.post('/admin/login/editpass', formData)
          .then((res) => {
            if (res.data.result === 'success') {
              this.loading = false
              this.$message({
                message: '修改成功！请重新登录',
                type: 'success'
              })
              this.$router.push('/login')
            } else {
              this.loading = false
              this.$message.error(res.data.msg)
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
    }
  }
}
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
        background: #242f42;
    }
    .header .logo{
        float: left;
        width:280px;
        padding-left: 60px;
        background: url(../../assets/logo.png) no-repeat 10px 16px;
    }
    .header .logo sup{
      margin-left: 10px;
      color: #999;
      font-size: 14px;
    }
    .header-info{
      margin-left: 10px;
      cursor: pointer;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 14px;
        color: #fff;
    }
    .user-info a{
      color: #f9f9f9;
      position: relative;
        display: inline-block;
        vertical-align: middle;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 20px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
    .dialog-footer{
        margin-top: 40px;
        text-align: right;
    }
    .sysinfo .el-form-item{
      margin-bottom: 0
    }
    .el-dialog{
      line-height: 32px;
    }
    .el-dialog__header{
        padding: 10px 20px 10px;
        height: 32px;
        line-height: 32px;
    }
</style>
