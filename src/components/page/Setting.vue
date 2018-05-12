<template>
    <div>
        <div class="page-boxtitle">
            <strong class="title">系统设置</strong>
        </div>

        <el-form :model="addForm" ref="addForm" label-width="150px"  @submit.prevent="submit()">
          <el-form-item label="允许评论" prop="commentEnable">
            <el-switch
              v-model="addForm.commentEnable"
              active-color="#13ce66">
            </el-switch>
          </el-form-item>
          <el-form-item label="评论需要审核" prop="needCheck">
            <el-switch
              v-model="addForm.needCheck"
              active-color="#13ce66">
            </el-switch>
          </el-form-item>
          <el-form-item label="允许会员注册" prop="regEnable">
            <el-switch
              v-model="addForm.regEnable"
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
          

          <el-form-item label="邮件服务" prop="mailerEnable">
            <el-switch
              v-model="addForm.mailerEnable"
              active-color="#13ce66">
            </el-switch>
          </el-form-item>

          <el-row>
            <el-col :span="8">
              <el-form-item label="邮件服务器" prop="mailserver">
                <el-input v-model="addForm.mailserver" :disabled="!addForm.mailerEnable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="端口" prop="email_port">
                <el-input v-model="addForm.mailport" :disabled="!addForm.mailerEnable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户名" prop="mailuser">
                <el-input v-model="addForm.mailuser" :disabled="!addForm.mailerEnable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="密码" prop="mailpass">
                <el-input type="password" v-model="addForm.mailpass" :disabled="!addForm.mailerEnable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item style="margin-top:60px">
            <el-button type="primary" native-type="submit" @click="submit('addForm')">{{loading ? '提交中' : '提交'}}</el-button>
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
      loading: false,
      addForm: {
        commentEnable: true,
        needCheck: true,
        regEnable: true,
        badword: '',
        mailerEnable: true,
        mailserver: '',
        mailport: '',
        mailuser: '',
        mailpass: ''
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
          this.loading = true
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
              this.loading = false
            }

          }).catch((err) => {
            //this.$message.error('出错了')
            console.log(err)
            this.loading = false
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
        if (res.status === 200) {
          this.addForm = res.data;
        } else {
          this.$message.error('请求失败')
        }
      }).catch((error) => {
        console.log(error)
        //this.$message.error('请求数据没有响应！')
      })
    }
  }
}
</script>