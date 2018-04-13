<template>
    <div id="hw-article-add">
      <div class="page-boxtitle">
        <strong class="title" v-if="addForm.id">编辑产品</strong>
        <strong class="title" v-else>新增产品</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">产品</el-breadcrumb-item>
          <el-breadcrumb-item v-if="addForm.id">编辑产品</el-breadcrumb-item>
          <el-breadcrumb-item v-else>新增产品</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" @submit.prevent="submit()">
          <el-form-item label="产品名称" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="关键字" prop="keywords">
            <el-input v-model="addForm.keywords" placeholder="多个关键字请用英文逗号','隔开"></el-input>
          </el-form-item>
          <el-form-item label="简介概述" prop="intro">
            <el-input v-model="addForm.intro" type="textarea" placeholder="内容概述，不填则会自动取内容前100字"></el-input>
          </el-form-item>
          
          <el-form-item label="缩略图" prop="pic">
            <el-upload
              class="avatar-uploader"
              action="/admin/article/upload/type/1"
              :headers="upheaders"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="picUrl" :src="picUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span style="color:#999; margin-left:10px;">支持jpg,png,gif格式图片，1MB以内，最佳尺寸：450x250像素。</span>
          </el-form-item>
          
          <el-form-item label="产品内容" prop="content">
            <quill-editor ref="myTextEditor" v-model="addForm.content" :options="editorOption"></quill-editor>
          </el-form-item>
          <br/><br/><br/>
          <el-row>
            <el-col :span="12">
              <el-form-item label="编辑" prop="author">
                <el-input v-model="addForm.author" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="来源" prop="source">
                <el-input v-model="addForm.source" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row>
            <el-col :span="12">
              <el-form-item label="发布时间" prop="create_time">
                <el-date-picker
                  v-model="addForm.create_time"
                  type="datetime"
                  placeholder="addForm.nowtime">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件名" prop="html_name">
                <el-input v-model="addForm.html_name" placeholder="用于生成html页面名称,请以.html为后缀"></el-input>
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

import {quillEditor, Quill} from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'

Quill.register('modules/ImageExtend', ImageExtend)

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      url: '/admin/article',
      cates: [],
      picUrl: '',
      fileList: [],
      upheaders: {
        'X-token': sessionStorage.getItem('token')
      },
      addForm: {
        id: '',
        title: '',
        cid: 1,
        keywords: '',
        intro: '',
        pic: '',
        author: sessionStorage.getItem('hw_username'),
        source: '',
        create_time: (new Date()).getFullYear()+'-'+((new Date()).getMonth()+1)+'-'+(new Date()).getDate()+' '+(new Date()).getHours()+':'+(new Date()).getMinutes()+':'+(new Date()).getSeconds(),
      },
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            action: '/admin/article/upload',
            headers: (xhr) => {
              xhr.setRequestHeader('X-token', sessionStorage.getItem('token'))
            },
            response: (res) => {
              return '/attachments/' + res.savename
            }
          },
          toolbar: {
            //container: container,
            container: [
              [{'size': ['small', false, 'large']}],
              ['bold', 'italic', 'code', 'blockquote'],
              [{ 'align': [] }],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'color': []}, {'background': []}], // dropdown with defaults from theme
              [{'list': 'ordered'}, {'list': 'bullet'}],
              ['link', 'image']
            ],
            handlers: {
              'image': function () {
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        }
      },
      rules: {
        title: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { max: 100, message: '不能超过100个字符', trigger: 'blur' }
        ],
        cid: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getArticleInfo()
    this.getCate()
  },
  methods: {
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var formData = this.addForm
          let msg = '新增成功！'
          if (formData.id) {
            msg = '修改成功！'
          }
          this.$axios.post(this.url + '/update', formData)
          .then((res) => {
            console.log(res);
            if (res.data.result === 'success') {
              this.$message({
                message: msg,
                type: 'success'
              })
              setTimeout(this.$router.push('/article'), 2000);
              
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getCate () {
      let self = this
      self.$axios.get(self.url + '/getCate?pid=2'
      ).then((res) => {
        self.cates = res.data
      }).catch((error) => {
        console.log(error)
        this.$message.error('请求数据没有响应！')
      })
    },
    
    getArticleInfo () {
      let articleId = this.$route.params.id
      if (articleId) {
        let self = this
        self.$axios.get(self.url + '/edit', {
          params: {
            id: articleId
          }
        }).then((res) => {
          if (res.data.result === 'failed') {
            this.$message.error(res.data.message)
          } else {
            this.addForm = res.data.row;
            if (res.data.row.pic) {
              this.picUrl = '/attachments/' +　res.data.row.pic
            }
          }
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求数据没有响应！')
        })
      } else {
        this.addForm.id = null
      }
    },

    uploadSuccess(response, file) {
      if (response.result == 'success') {
        this.addForm.pic = response.savename;
        this.picUrl = URL.createObjectURL(file.raw);
      } else {
        this.$message.warning(`上传失败`);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('只能上传图片!');
      }
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!');
      }
      return isJPG && isLt1M;
    }
  }
}
</script>

<style lang="less" scoped>

.quill-editor {
  height: 320px;
}

.avatar-uploader {
  border:1px dashed #d9d9d9;
  border-radius: 6px;
  width: 200px;
  height: 120px;
  display: inline-block;
  .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
} 
.avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 120px;
    display: block;
  }
</style>