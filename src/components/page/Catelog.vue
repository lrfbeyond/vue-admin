 <template>
    <div id="hw-article">
      <div class="page-boxtitle">
        <strong class="title">文章分类</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/article' }">文章</el-breadcrumb-item>
          <el-breadcrumb-item>文章分类</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-button type="primary" plain icon="el-icon-plus" @click="dialogCateVisible = true">新增分类</el-button>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">分类名称</el-col>
        <el-col :span="4">排序</el-col>
        <el-col :span="4">操作</el-col>
      </el-row>

      <el-row :gutter="20" v-for="item in cates" class="bgshow">
        <el-col :span="12" v-html="item.label"></el-col>
        <el-col :span="4">{{item.sort}}</el-col>
        <el-col :span="4">
            <i class="iconfont icon-edit row-opt" title="编辑" @click="handleEdit(item)"></i> 
            <i class="iconfont icon-delete row-opt" title="删除" @click="handleDelete(item)"></i>
        </el-col>
      </el-row>

      <el-dialog :title="dialogTitle" :visible.sync="dialogCateVisible">
        <el-form :model="cateForm" ref="cateForm" :rules="rules" :label-width="formLabelWidth" @submit.prevent="submitForm('cateForm')">
          <el-form-item label="分类名称" prop="title">
            <el-input v-model="cateForm.title" auto-complete="off" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="上级分类" prop="pid" >
            <el-select v-model="cateForm.pid" placeholder="请选择上级分类">
                <el-option v-for="item in cates" :label="item.title"  :value="item.id" v-html="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCateVisible = false">取 消</el-button>
          <el-button type="primary" native-type="submit" @click.prevent="submitForm('cateForm')">{{loading ? '提交中' : '确 定'}}</el-button>
        </div>
      </el-dialog>

    </div>
 </template>

<script>
  export default {
    data() {
      return {
        url: '/api/catelog',
        dialogCateVisible: false,
        dialogTitle: '新增分类',
        cateForm: {
          title: '',
          pid: null,
          label: ''
        },
        cates: [],
        data: [],
        loading: false,
        formLabelWidth: '120px',
        rules: {
          title: [
            {required: true, message: '请输入分类名称', trigger: 'change'}
          ],
          pid: [
            {required: true, message: '请选择上级分类', trigger: 'change'}
          ]
        }
      }
    },

    created () {
      this.getCate()
      this.getCateTree()
    },

    methods: {
      getCate () {
        this.$axios.get(this.url
        ).then((res) => {
          this.cates = res.data
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求数据没有响应！')
        })
      },
      getCateTree () {
        this.$axios.get(this.url + '/getCateTree'
        ).then((res) => {
          this.data = res.data
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求数据没有响应！')
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          //console.log(valid);
          if (valid) {
            this.loading = true
            var formData = this.cateForm
            let msg = '新增成功！'
            if (formData.id) {
              msg = '修改成功！'
            }
            this.$axios.post('/update', formData)
            .then((res) => {
              if (res.data.result === 'success') {
                this.loading = false
                this.$message({
                  message: msg,
                  type: 'success'
                })
                this.getCate();
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
      },
      handleEdit (row) {
        this.dialogCateVisible = true;
        this.dialogTitle = '修改分类';
        if (row.id) {
          this.$axios.get(this.url + '/' + row.id)
          .then((res) => {
            if (res.data.result === 'failed') {
              this.$message.error(res.data.message)
            } else {
              this.cateForm = res.data.row;
            }
          }).catch((error) => {
            console.log(error)
            this.$message.error('请求数据没有响应！')
          })
        } else {
          this.cateForm.id = null
        }
      },

      handleDelete (row) {
        this.$confirm('您确定要删除该分类吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(this.url + '/delete', {
            id: row.id
          }).then((res) => {
            if (res.data.result === 'failed') {
              this.$message.error(res.data.msg)
            } else {
              this.$message({
                message: '成功删除！',
                type: 'success'
              })
              this.getCate()
            }
          }).catch((error) => {
            console.log(error)
            this.$message.error('请求数据没有响应！')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      }
    }
  }
</script>

<style lang="less" scoped>
.el-row{
  width: 100%; 
  line-height: 30px;
  color: #606266;
}

.bgshow:hover{
  background: #f5f7fa;
}

.el-col{
  line-height: 32px;
}
.row-opt{
  cursor: pointer;
  margin-right: 10px;
}
</style>