 <template>
    <div id="hw-article">
      <div class="page-boxtitle">
        <strong class="title">会员列表</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">会员</el-breadcrumb-item>
          <el-breadcrumb-item>会员列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="query-box">
          <el-date-picker
            v-model="selectDate"
            type="date"
            @change="selectedDate"
            value-format="yyyy-MM-dd"
            placeholder="选择日期" style="width:150px">
          </el-date-picker>
          <el-input placeholder="输入标题关键字" suffix-icon="el-icon-search" v-model="selectWord" @keyup.enter.native="searchRecord" style="width: 200px; margin-left:10px"></el-input>
      </div>

      <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange"  v-loading="loading">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column prop="id" label="ID" width="60" sortable>
        </el-table-column>
        <el-table-column prop="username" label="用户名" sortable>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="150" >
        </el-table-column>
        <el-table-column prop="stat" label="状态" width="150" sortable>
        </el-table-column>
        <el-table-column prop="from" label="来源" width="150">
        </el-table-column>
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间" width="240" sortable>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <i class="iconfont icon-edit row-opt" title="编辑" @click="handleEdit(scope.$index, scope.row)"></i>
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
    </div>
 </template>

<script>
  export default {
    data () {
      return {
        url: '/api/member',
        loading: true,
        selectDate: '',
        selectWord: '',
        isSearch: false,
        multipleSelection: [],
        delList: [],
        tableData: [],
        currentPage: 1,
        total: 0
      }
    },
    created () {
      this.reload()
    },
    computed: {
      //
    },
    methods: {
      reload () {
        this.searchRecord()
      },
      selectCateOpt (target) {
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
          if (res.status == 200) {
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
        this.$router.push('/member/' + row.id)
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
i.row-opt{
  margin-right: 10px;
  cursor: pointer;
}
i.red{
  color: #f60;
}

</style>