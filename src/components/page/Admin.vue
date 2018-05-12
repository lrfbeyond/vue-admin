 <template>
    <div id="hw-article">
      <div class="page-boxtitle">
        <strong class="title">管理员列表</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/admin' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="query-box">
          <el-button type="primary" plain icon="el-icon-plus" @click="dialogAdminVisible = true">新增</el-button>
          &nbsp; 
          <el-date-picker
            v-model="selectDate"
            type="date"
            @change="selectedDate"
            value-format="yyyy-MM-dd"
            placeholder="选择日期" style="width:150px">
          </el-date-picker>
          <el-input placeholder="输入关键字" suffix-icon="el-icon-search" v-model="selectWord" @keyup.enter.native="searchRecord" style="width: 200px; margin-left:10px"></el-input>
      </div>

      <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange"  v-loading="loading">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column prop="id" label="ID" width="60" sortable>
        </el-table-column>
        <el-table-column prop="admin_name" label="管理员账号">
        </el-table-column>
        <el-table-column prop="realname" label="姓名">
        </el-table-column>
        <el-table-column prop="role" label="用户组">
        </el-table-column>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" sortable>
        </el-table-column>
        <el-table-column prop="login_counts" label="登录次数" width="100" sortable>
        </el-table-column>
        <el-table-column prop="updated_at" label="最后登录时间" width="200" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.login_counts === 0">-</p>
            <p v-else>{{ scope.row.updated_at }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <i class="iconfont icon-edit row-opt" title="编辑" @click="handleEdit(scope.$index, scope.row)"></i>
            <i class="iconfont icon-zhongzhimima1 row-opt" title="重置密码" @click="handleReset(scope.$index, scope.row)"></i>
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

      <el-dialog :title="dialogTitle" :visible.sync="dialogAdminVisible">
          <el-form ref="addForm" :model="addForm" :rules="rules" :label-width="formLabelWidth" @submit.prevent="submitForm('addForm')">
            <el-form-item label="管理员帐号" prop="admin_name">
              <el-input v-model="addForm.admin_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" v-show="isAdd">
              <el-input v-model="addForm.password" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password_confirm" v-show="isAdd">
              <el-input v-model="addForm.password_confirm" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员姓名" prop="realname">
              <el-input v-model="addForm.realname" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属用户组" prop="role_id" >
              <el-select v-model="addForm.role_id" placeholder="请选择用户组">
                  <el-option v-for="item in groups" :key="item.id" :label="item.title"  :value="item.id"></el-option>
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
        url: '/api/admin',
        
        groups: [],
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
        dialogTitle: '新增管理员',
        dialogAdminVisible: false,
        isAdd: true,
        addForm: {
          admin_name: '',
          password: '',
          password_confirm: '',
          realname: '',
          role_id: ''
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
                this.dialogAdminVisible = false;
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
            this.tableData = res.data.list;
            this.total = res.data.total;
            this.groups = res.data.rolelist;
          } else {
            this.$message.error(res.data.message)
          }
          
        }).catch((error) => {
          console.log(error)
          this.loading = false;
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
        this.dialogAdminVisible = true;
        this.dialogTitle = '编辑管理员';
        if (row.id) {
          this.$axios.get(this.url + '/' + row.id)
          .then((res) => {
            if (res.data.result === 'failed') {
              this.$message.error(res.data.message)
            } else {
              this.addForm = res.data.row;
              this.isAdd = false;
              this.addForm.password = 'hide';
              this.addForm.password_confirm = 'hide';
            }
          }).catch((error) => {
            console.log(error)
            this.$message.error('请求数据没有响应！')
          })
        } else {
          this.addForm.id = null
        }
      },
      handleReset (index, row) {
        this.$confirm('您确定要重置密码吗？密码将会被重置为666666', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(this.url + '/resetPass', {
            id: row.id
          }).then((res) => {
            if (res.data.result === 'failed') {
              this.$message.error(res.data.msg)
            } else {
              this.$message({
                message: '密码已重置为666666',
                type: 'success'
              })
              this.reload()
            }
            this.multipleSelection = []
          }).catch((error) => {
            console.log(error)
            this.$message.error('重置密码没有响应！')
          })
        });
      },
      handleDelete (index, row) {
        this.$confirm('您确定要删除该数据吗？', '操作提示', {
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
              this.reload()
            }
            this.multipleSelection = []
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