<template>
    <div id="hw-comment-add">
      <div class="page-boxtitle">
        <strong class="title">回复评论</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">评论</el-breadcrumb-item>
          <el-breadcrumb-item>回复评论</el-breadcrumb-item>
        </el-breadcrumb>
      </div>


        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" @submit.prevent="submit()">
          <el-form-item label="文章">
            {{addForm.article_title}}
          </el-form-item>
          <el-form-item label="用户名">
            {{addForm.author_name}}
          </el-form-item>
          <el-form-item label="IP" prop="ip">
            {{addForm.ip}}
          </el-form-item>
          <el-form-item label="评论内容" prop="message">
            <el-input v-model="addForm.message" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="评论时间">
            {{addForm.created_at}}
          </el-form-item>
          <el-form-item label="回复内容" prop="reply">
            <el-input v-model="addForm.reply" type="textarea" :rows="3"></el-input>
          </el-form-item>

          <el-form-item label="回复时间" v-if="addForm.is_reply">
            {{addForm.updated_at}}
          </el-form-item>
          
          <el-form-item style="margin-top:60px">
            <el-button type="primary" native-type="submit" @click.prevent="submit('addForm')">提交</el-button>
            <el-button @click="goBack()">返回</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      url: '/api/comment',
      addForm: {
        id: '',
        username: '',
        article_title: '',
        ip: '',
        message: '',
        created_at: '',
        reply: '',
        is_reply: 0
      },
      rules: {
        reply: [
          { required: true, message: '请输入回复内容', trigger: 'blur' },
          { max: 200, message: '不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    console.log(this.url);
    this.getInfo()
  },
  methods: {
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var formData = this.addForm
          var mydata = {
            'id': formData.id,
            'aid': formData.article_id,
            'message': formData.message,
            'reply': formData.reply
          }
          this.$axios.post(this.url + '/reply', mydata)
          .then((res) => {
            if (res.data.result === 'success') {
              this.$message({
                message: '回复成功！',
                type: 'success'
              })
              this.$router.push('/comment')
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
    goBack () {
      this.$router.go(-1)
    },
    getInfo () {
      let uid = this.$route.params.id
      if (uid) {
        this.$axios.get(this.url + '/' + uid
        ).then((res) => {
          if (res.data.result === 'failed') {
            this.$message.error(res.data.message)
          } else {
            this.addForm = res.data.row
          }
        }).catch((error) => {
          //console.log(error)
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
.block{
  margin-bottom: 20px;
}
</style>