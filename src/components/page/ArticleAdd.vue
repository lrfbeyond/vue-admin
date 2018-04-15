<template>
    <div id="hw-article-add">
      <div class="page-boxtitle">
        <strong class="title" v-if="addForm.id">编辑文章</strong>
        <strong class="title" v-else>新增文章</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">文章</el-breadcrumb-item>
          <el-breadcrumb-item v-if="addForm.id">编辑文章</el-breadcrumb-item>
          <el-breadcrumb-item v-else>新增文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" @submit.prevent="submit()">
          <el-form-item label="标题" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="所属分类" prop="cid">
            <el-select v-model="addForm.cid" placeholder="请选择文章分类">
              <template v-for="item in cates">
                <el-option :key="item.id" :label="item.title" :value="item.id"></el-option>
              </template>
            </el-select>
          </el-form-item>
          
          <el-form-item label="缩略图" prop="pic">
            <el-upload
              class="avatar-uploader"
              action="/api/article/upload"
              :headers="upheaders"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="picUrl" :src="picUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span style="color:#999; margin-left:10px;">支持jpg,png,gif格式图片，500KB以内，最佳尺寸：280x180像素。</span>
          </el-form-item>
          <el-form-item label="关键字" prop="keywords">
            <el-select v-model="addForm.keywords" multiple placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in tags"
                :key="item.ename"
                :label="item.tagname"
                :value="item.ename">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简介概述" prop="abstracts">
            <el-input v-model="addForm.intro" type="textarea" placeholder="内容概述，不填则会自动取内容前100字，如果是链接，则需要手动填写"></el-input>
          </el-form-item>

          <el-form-item label="文章内容" prop="content">
            <quill-editor ref="myTextEditor" v-model="addForm.content" :options="editorOption" style="line-height:25px"></quill-editor>
            <br/><br/>
          </el-form-item>
          
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否推荐" prop="ishot">
                <el-switch
                  v-model="addForm.ishot"
                  active-color="#13ce66"
                  inactive-color="#e0e0e0">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否原创" prop="isorig">
                <el-switch
                  v-model="addForm.isorig"
                  active-color="#13ce66"
                  inactive-color="#e0e0e0">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="作者" prop="author">
                <el-input v-model="addForm.author" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="来源" prop="source">
                <el-input v-model="addForm.source" placeholder="helloweba.net"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="发布时间" prop="created_at">
                <el-date-picker
                  v-model="addForm.created_at"
                  type="datetime"
                  placeholder="addForm.nowtime">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- <el-form-item label="文件名" prop="html_name">
                <el-input v-model="addForm.html_name" placeholder="用于生成html页面名称"></el-input>
              </el-form-item> -->
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
      url: '/api/article',
      cates: [],
      tags: [],
      picUrl: '',
      fileList: [],
      upheaders: {
        'X-token': sessionStorage.getItem('token')
      },
      addForm: {
        id: '',
        title: '',
        cid: '',
        keywords: [],
        abstracts: '',
        pic: '',
        ishot: false,
        isorig: false,
        author: sessionStorage.getItem('hw_username'),
        source: '',
        created_at: (new Date()).getFullYear()+'-'+((new Date()).getMonth()+1)+'-'+(new Date()).getDate()+' '+(new Date()).getHours()+':'+(new Date()).getMinutes()+':'+(new Date()).getSeconds(),
      },
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 1, // 1M
            action: '/api/article/upload',
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
          // toolbar: [
          //   [{'size': ['small', false, 'large']}],
          //   ['bold', 'italic', 'code'],
          //   // [{'header': 2}],
          //   // ['blockquote', 'code-block'],
          //   [{'header': [1, 2, 3, 4, 5, 6, false]}],
          //   [{'color': []}, {'background': []}], // dropdown with defaults from theme
          //   [{'list': 'ordered'}, {'list': 'bullet'}],
          //   ['link', 'image']
          // ]
        }
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
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
    this.getTags()
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
      this.$axios.get(this.url + '/getCate'
      ).then((res) => {
        this.cates = res.data
      }).catch((error) => {
        this.$message.error('请求数据没有响应！')
      })
    },
    getTags () {
      this.$axios.get(this.url + '/getTags'
      ).then((res) => {
        this.tags = res.data
      }).catch((error) => {
        this.$message.error('请求数据没有响应！')
      })
    },
    getArticleInfo () {
      let articleId = this.$route.params.id
      if (articleId) {
        this.$axios.get(this.url + '/' + articleId)
        .then((res) => {
          if (res.data.result === 'failed') {
            this.$message.error(res.data.message)
          } else {
            this.addForm = res.data.row;
            this.picUrl = '/attachments/' +　res.data.row.pic
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