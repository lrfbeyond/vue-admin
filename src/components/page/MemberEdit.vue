<template>
    <div id="hw-article-add">
      <div class="page-boxtitle">
        <strong class="title">编辑会员</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><router-link :to="{ path: '/member' }"><i class="iconfont icon-account"></i> 会员</router-link></el-breadcrumb-item>
          <el-breadcrumb-item>编辑会员</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" @submit.prevent="submit()">
          <el-form-item label="头像" prop="photo">
            <!-- <el-input v-model="addForm.photo"></el-input> -->
            <img :src="addForm.photo" alt="" width="80" height="80">
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                {{addForm.username}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="来源" prop="login_oauth">
                <span v-if="addForm.login_oauth === 0">本站</span>
                <span v-else-if="addForm.login_oauth === 1">QQ</span>
                <span v-else-if="addForm.login_oauth === 2">微信</span>
                <span v-else-if="addForm.login_oauth === 3">微博</span>
                <span v-else-if="addForm.login_oauth === 4">Github</span>
                <span v-else>本站</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="addForm.nickname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="addForm.sex" placeholder="请选择">
                  <el-option
                    v-for="item in sexOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row>
            <el-col :span="12">
              <el-form-item label="Email" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="addForm.status" placeholder="请选择">
                  <el-option
                    v-for="item in statusOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row>
            <el-col :span="12">
              <el-form-item label="积分" prop="jifen">
                <el-input v-model="addForm.jifen"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="级别" prop="level">
                <el-select v-model="addForm.level" placeholder="请选择">
                  <el-option
                    v-for="item in levelOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册IP" prop="regip">
                {{addForm.regip}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="注册时间" prop="created_at">
                {{addForm.created_at}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更新时间" prop="updated_at">
                {{addForm.updated_at}}
              </el-form-item>
            </el-col>
          </el-row>
          
          
          <el-form-item style="margin-top:60px">
            <el-button type="primary" native-type="submit" @click.prevent="submit('addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      url: '/api/member',
      sexOpt: [{
        value: 0,
        label: '未知'
      }, {
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }],
      levelOpt: [{
        value: 0,
        label: '普通会员'
      },
      {
        value: 1,
        label: 'VIP'
      }],
      statusOpt: [{
        value: 0,
        label: '正常'
      },
      {
        value: 1,
        label: '禁言'
      },{
        value: 2,
        label: '禁用'
      }],
      addForm: {
        id: '',
        username: '',
        nickname: '',
        email: '',
        sex: 0,
        level: 1,
        jifen: '',
        regip: '',
        created_at: '',
        updated_at: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { max: 30, message: '不能超过30个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        email: [
          { required: true, message: 'Email不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getMemberInfo()
  },
  methods: {
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var formData = this.addForm
          this.$axios.post(this.url + '/update', formData)
          .then((res) => {
            console.log(res);
            if (res.data.result === 'success' && res.status === 200) {
              this.$message({
                message: '修改成功！',
                type: 'success'
              })
              setTimeout(this.$router.push('/member'), 2000);
              
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getMemberInfo () {
      let memberId = this.$route.params.id
      if (memberId) {
        this.$axios.get(this.url + '/' + memberId)
        .then((res) => {
          if (res.data.result === 'failed') {
            this.$message.error(res.data.message)
          } else {
            this.addForm = res.data.row;
          }
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求数据没有响应！')
        })
      } else {
        this.addForm.id = null
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>