 <template>
    <div id="hw-article">
      <div class="page-boxtitle">
        <strong class="title">操作日志</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">日志</el-breadcrumb-item>
          <el-breadcrumb-item>操作日志</el-breadcrumb-item>
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
          <el-input placeholder="输入关键字" suffix-icon="el-icon-search" v-model="selectWord" @keyup.enter.native="searchRecord" style="width: 200px; margin-left:10px"></el-input>
      </div>

      <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange"  v-loading="loading">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column prop="id" label="ID" width="60" sortable>
        </el-table-column>
        <el-table-column prop="created_at" label="时间" width="180" sortable>
        </el-table-column>
        <el-table-column prop="username" label="操作者" width="180">
        </el-table-column>
        <el-table-column prop="event" label="日志内容">
        </el-table-column>
        </el-table-column>
        <el-table-column prop="logip" label="IP" width="180">
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
        url: '/api/logs',
        loading: true,
        selectDate: '',
        opters: [],
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
      searchRecord () {
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

</style>