<template>
    <div>
        <div class="page-boxtitle">
            <strong class="title">系统设置</strong>
        </div>

        <el-form :model="addForm" ref="addForm" label-width="150px"  @submit.prevent="submit()">
          <el-form-item label="允许评论" prop="comment_enable">
            <el-switch
              v-model="addForm.comment_enable"
              active-color="#13ce66">
            </el-switch>
          </el-form-item>
          <el-form-item label="评论需要审核" prop="chk_comment">
            <el-switch
              v-model="addForm.chk_comment"
              active-color="#13ce66">
            </el-switch>
          </el-form-item>
          <el-form-item label="允许会员注册" prop="register_enable">
            <el-switch
              v-model="addForm.register_enable"
              active-color="#13ce66">
            </el-switch>
          </el-form-item>
          <el-row>
            <el-col :span="16">
              <el-form-item label="违禁词语" prop="badword">
              <el-input v-model="addForm.badword" type="textarea" placeholder="不允许在评论中、注册用户名中使用的词语， 多个词语用|隔开。"></el-input>
          </el-form-item>
            </el-col>
          </el-row>
          

          <el-form-item label="邮件服务" prop="email_enable">
            <el-switch
              v-model="addForm.email_enable"
              active-color="#13ce66">
            </el-switch>
          </el-form-item>

          <el-row>
            <el-col :span="8">
              <el-form-item label="邮件服务器" prop="email_server">
                <el-input v-model="addForm.email_server"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="端口" prop="email_port">
                <el-input v-model="addForm.email_port"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户名" prop="email_user">
                <el-input v-model="addForm.email_user"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="密码" prop="email_pass">
                <el-input type="password" v-model="addForm.email_pass"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item style="margin-top:60px">
            <el-button type="primary" native-type="submit" @click="submit('addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      url: '/api/setting',
      addForm: {
        comment_enable: true,
        chk_comment: true,
        register_enable: true,
        badword: '',
        email_enable: true,
        email_server: '',
        email_port: '',
        email_user: '',
        email_pass: ''
      }
   }
  },
  created () {
    this.getSetting()
  },
  methods: {
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var formData = this.addForm
          this.$axios.post(this.url + '/setOk', formData)
          .then((res) => {
            if (res.data.result === 'success' && res.status === 200) {
              this.$message({
                message: '设置成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            this.$message.error('出错了')
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getSetting () {
      this.$axios.get(this.url)
      .then((res) => {
        if (res.data.result === 'failed') {
          this.$message.error(res.data.msg)
        } else {
          this.addForm = res.data.row;
        }
      }).catch((error) => {
        console.log(error)
        this.$message.error('请求数据没有响应！')
      })
    }
  }
}
</script>