 <template>
    <div id="hw-article">
      <div class="page-boxtitle">
        <strong class="title">文章列表</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">文章</el-breadcrumb-item>
          <el-breadcrumb-item>文章列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="query-box">
          <el-select v-model="selectCate" placeholder="文章分类" class="handle-select" @change="selectCateOpt">
            <template v-for="item in cates">
              <el-option :key="item.id" :label="item.title" :value="item.id"></el-option>
            </template>
          </el-select>
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
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="cate" label="类别" width="180">
        </el-table-column>
        <el-table-column prop="hits" label="点击" width="100" sortable>
        </el-table-column>
        <el-table-column prop="downs" label="下载" width="100" sortable>
        </el-table-column>
        <el-table-column prop="mark" label="收藏" width="100" sortable>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="created_at" label="发布时间" width="180" sortable>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <i class="iconfont icon-changyonggoupiaorenbianji row-opt" title="编辑" @click="handleEdit(scope.$index, scope.row)"></i>
            <i class="iconfont icon-changyonggoupiaorenshanchu row-opt" title="删除" @click="handleDelete(scope.$index, scope.row)"></i>
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
        url: '/api/article',
        loading: true,
        selectCate: '',
        selectDate: '',
        cates: [],
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
      this.getCate()
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
            cate: this.selectCate,
            date: this.selectDate,
            keys: this.selectWord
          }
        }).then((res) => {
          if (res.data.result === 'failed') {
            this.$message.error(res.data.message)
          } else {
            this.loading = false;
            this.tableData = res.data.list
            this.total = res.data.total
          }
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求数据没有响应！')
        })
      },
      getCate () {
        let self = this
        self.$axios.get(self.url + '/getCate'
        ).then((res) => {
          self.cates = res.data
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
        this.$router.push('/article/' + row.id)
      },
      handleDelete (index, row) {
        let articleId = row.id
        this.$confirm('您确定要删除该数据吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(this.url + '/delete', {
            id: articleId
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
    width: 150px;
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

</style>