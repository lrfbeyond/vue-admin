 <template>
    <div id="hw-article">
      <div class="page-boxtitle">
        <strong class="title">用户组列表</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/admin' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>用户组列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="query-box">
          <el-button type="primary" plain icon="el-icon-plus" @click="dialogAdminVisible = true">新增</el-button>
          &nbsp;
          <el-input placeholder="输入关键字" suffix-icon="el-icon-search" v-model="selectWord" @keyup.enter.native="searchRecord" style="width: 200px; margin-left:10px"></el-input>
      </div>

      <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange"  v-loading="loading">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column prop="id" label="ID" width="60" sortable>
        </el-table-column>
        <el-table-column prop="title" label="用户组">
        </el-table-column>
        <el-table-column prop="intro" label="说明">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <i class="iconfont icon-edit row-opt" title="编辑权限" @click="handleEdit(scope.$index, scope.row)"></i>
            <i class="iconfont icon-delete row-opt" title="删除" @click="handleDelete(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-row>
          <el-col :span="6">
            <el-button size="small" @click="toggleSelection()">取消选择</el-button>
            <el-button type="warning" icon="delete" size="small" @click="delAll">删除所选</el-button>
          </el-col>
          <el-col :span="18" style="text-align:right">
            <el-pagination
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next"
              :page-size="10"
              :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

      <el-dialog title="新增用户组" :visible.sync="dialogAdminVisible">
          <el-form ref="addForm" :model="addForm" :rules="rules" :label-width="formLabelWidth" @submit.prevent="submitForm('addForm')">
            <el-form-item label="管理员帐号" prop="admin_name">
              <el-input v-model="addForm.admin_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password_confirm">
              <el-input v-model="addForm.password_confirm" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员姓名" prop="realname">
              <el-input v-model="addForm.realname" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属用户组" prop="role_id" >
              <el-select v-model="addForm.role_id" placeholder="请选择用户组">
                  <el-option v-for="item in roles" :key="item.id" :label="item.title"  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="确认密码" prop="password_confirm">
              <el-input v-model="addForm.password_confirm" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员姓名" prop="realname">
              <el-input v-model="addForm.realname" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属用户组" prop="role_id" >
              <el-select v-model="addForm.role_id" placeholder="请选择用户组">
                  <el-option v-for="item in roles" :key="item.id" :label="item.title"  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="确认密码" prop="password_confirm">
              <el-input v-model="addForm.password_confirm" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员姓名" prop="realname">
              <el-input v-model="addForm.realname" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属用户组" prop="role_id" >
              <el-select v-model="addForm.role_id" placeholder="请选择用户组">
                  <el-option v-for="item in roles" :key="item.id" :label="item.title"  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <div class="dialog-footer">
                <el-button @click="dialogAdminVisible = false">取 消</el-button>
                <el-button type="primary" native-type="submit" @click.prevent="submitForm('addForm')">{{loading ? '提交中' : '确 定'}}</el-button>
            </div>
          </el-form>
          
        </el-dialog>

    </div>
 </template>

<script>
  export default {
    data () {
      return {
        url: '/api/role',
        
        roles: [],
        selectDate: '',
        selectWord: '',
        isSearch: false,
        multipleSelection: [],
        delList: [],
        tableData: [],
        currentPage: 1,
        total: 0,
        loading: false,
        formLabelWidth: '120px',
        dialogAdminVisible: false,
        addForm: {
          admin_name: ''
        },
        rules: {
          admin_name: [
            {required: true, message: '请输入管理员帐号名', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入新密码', trigger: 'change'}
          ],
          password_confirm: [
            {required: true, message: '请输入确认密码', trigger: 'change'}
          ],
          role_id: [
            {required: true, message: '请选择用户组', trigger: 'change'}
          ]
        }
      }
    },
    created () {
      this.reload()
    },
    computed: {
      //
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var formData = this.addForm
            let msg = '新增成功！'
            if (formData.id) {
              msg = '修改成功！'
            }
            this.$axios.post(this.url + '/update', formData)
            .then((res) => {
              //console.log(res);
              if (res.data.result === 'success' && res.status === 200) {
                this.$message({
                  message: msg,
                  type: 'success'
                })
                this.reload();
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
      reload () {
        this.searchRecord()
      },
      searchRecord () {
        let self = this
        this.$axios.get(this.url, {
          params: {
            page: this.currentPage,
            date: this.selectDate,
            keys: this.selectWord
          }
        }).then((res) => {
          if (res.status === 200) {
            this.loading = false;
            this.tableData = res.data.list
            this.total = res.data.total
          } else {
            this.$message.error(res.data.message)
          }
          
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求数据没有响应！')
        })
      },
      
      handleCurrentChange (val) {
        this.currentPage = val
        this.searchRecord()
      },
      delAll () {
        const self = this
        const length = self.multipleSelection.length
        self.delList = self.delList.concat(self.multipleSelection)
        let idsArr = []
        for (let i = 0; i < length; i++) {
          idsArr.push(self.multipleSelection[i].id)
        }

        this.$confirm('您确定要删除该数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$axios.post(self.url + '/delete', {
            id: idsArr.join()
          }).then((res) => {
            if (res.data.result === 'failed') {
              this.$message.error(res.data.msg)
            } else {
              self.$message({
                message: '成功删除！',
                type: 'success'
              })
              this.reload()
            }
            self.multipleSelection = []
          }).catch((error) => {
            console.log(error)
            this.$message.error('请求数据没有响应！')
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleEdit (index, row) {
        this.$router.push(this.url + '/' + row.id)
      },
      handleDelete (index, row) {
        const self = this
        let articleId = row.id
        this.$confirm('您确定要删除该数据吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$axios.post(self.url + '/delete', {
            id: articleId
          }).then((res) => {
            if (res.data.result === 'failed') {
              this.$message.error(res.data.msg)
            } else {
              self.$message({
                message: '成功删除！',
                type: 'success'
              })
              this.reload()
            }
            self.multipleSelection = []
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

        
      },
      selectedDate () {
        this.searchRecord()
      }
    }
  }
</script>

<style lang="less" scoped>


.pagination{
  margin: 20px 0; 
}
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
i.row-opt{
  margin-right: 10px;
  cursor: pointer;
}
i.red{
  color: #f60;
}

.el-dialog__header{
  padding: 10px;
}
.dialog-footer{
      margin-top: 40px;
      text-align: right;
  }
</style>