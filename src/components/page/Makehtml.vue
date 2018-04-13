 <template>
    <div id="hw-makehtml">
      <div class="page-boxtitle">
        <strong class="title">生成静态</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>生成静态</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      
      <el-row>
        <!-- <el-tooltip class="item" effect="dark" content="生成静态首页" placement="top">
          <el-button plain>生成首页</el-button>
        </el-tooltip> -->
        <el-button plain @click="createIndex()">生成首页</el-button>
      </el-row>

      <el-row>
        <el-button type="primary" plain @click="createProPage()">生成所有产品页</el-button>
      </el-row>
      <el-row>
        <el-button type="success" plain @click="createNewsList(3)">生成业内资讯列表页</el-button>
        <el-button type="danger" plain @click="createNewsList(4)">生成公司动态列表页</el-button>
        <el-button type="info" plain @click="createNewsPage()">生成所有资讯内容页</el-button>
      </el-row>
      <el-row>
        <el-button type="warning" plain @click="createSinglePage()">生成所有单页内容</el-button>
      </el-row>

      <el-row>
        <p class="status" v-show="msg">{{ msg }}</p>
      </el-row>

    </div>
 </template>

<script>
  export default {
    data () {
      return {
        url: '/admin/html',
        curPage: 1,
        num: 0,
        msg: ''
      }
    },
    methods: {
      createIndex () {
        this.$axios.post(this.url + '/createIndex')
        .then((res) => {
          this.msg = '正在生成...';
          if (res.data.result === 'failed') {
            this.$message.error(res.data.msg)
          } else {
            this.$message({
              message: '生成成功！',
              type: 'success'
            });
            this.msg = '已成功生成静态首页。';
          }
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求没有响应！')
        })
      },
      createProPage () {
        this.$axios.post(this.url + '/createProPage')
        .then((res) => {
          if (res.data.result === 'failed') {
            this.$message.error(res.data.msg)
          } else {
            this.$message({
              message: '生成成功！',
              type: 'success'
            });
            this.msg = res.data.msg;
          }
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求没有响应！')
        })
      },
      createNewsList (cid) {
        this.$axios.post(this.url + '/createNewsList', {
          cid: cid,
          page: this.curPage,
        })
        .then((res) => {
          if (res.data.result === 'failed') {
            this.$message.error(res.data.msg)
          } else {
            if (res.data.page) {
              this.curPage = res.data.page;
              setTimeout(this.createNewsList(cid), 20000);
            } else {
              this.$message({
                message: '生成成功！',
                type: 'success'
              });
            }
            this.msg = res.data.msg;
          }
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求没有响应！')
        })
      },
      createNewsPage () {
        this.$axios.post(this.url + '/createNewsPage', {
          page: this.curPage,
          num: this.num
        }).then((res) => {
          if (res.data.result === 'failed') {
            this.$message.error(res.data.msg)
          } else {
            if (res.data.page) {
              console.log(res.data.page)
              this.curPage = res.data.page;
              this.num = res.data.num;
              //this.createNewsPage();
              setTimeout(this.createNewsPage(), 2000);
            } else {
              this.$message({
                message: '生成成功！',
                type: 'success'
              });
            }
            this.msg = res.data.msg;
          }
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求没有响应！')
        })
      },
      createSinglePage () {
        this.$axios.post(this.url + '/createSinglePage')
        .then((res) => {
          if (res.data.result === 'failed') {
            this.$message.error(res.data.msg)
          } else {
            this.$message({
              message: '生成成功！',
              type: 'success'
            });
            this.msg = res.data.msg;
          }
        }).catch((error) => {
          console.log(error)
          this.$message.error('请求没有响应！')
        })
      },
    }
  }
</script>

<style lang="less" scoped>

.status{
  padding: 10px;
  margin: 20px 0;
  border:1px solid #d9d9d9;
  background: #f0f0f0;
}
.el-row{
  margin-top: 20px;
}
</style>