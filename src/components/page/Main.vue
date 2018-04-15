<template>
  <div>
    <!-- <div class="welcome">欢迎管理员：{{ username }}。</div> -->
    
    <el-row :gutter="20">
      <el-col :span="8"><div class="bg-div bg-blue">文章总数<br/><span>{{total.totalArticles}}</span></div></el-col>
      <el-col :span="8"><div class="bg-div bg-green">评论总数<br/><span>{{total.totalComments}}</span></div></el-col>
      <el-col :span="8"><div class="bg-div bg-orange">会员总数<br/><span>{{total.totalMembers}}</span></div></el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>最近操作</span>
          </div>
          <div class="text item">
            <template v-for="item in optLog">
            <p><span>{{item.created_at}}</span>{{item.event}}</p>
            </template>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>文章概览</span>
          </div>
          <div class="text item">
            <div id="chartPie" style="width:100%; height:240px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>整站统计</span>
          </div>
          <div class="text item">
            <div id="chartLine" style="width:100%; height:240px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import echarts from 'echarts'

const pieOption = {
  tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c}条 ({d}%)"
  },
  series : [
      {
          name: '文章统计',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data: []
      }
  ]
}

const lineOption = {
    // title: {
    //     text: '整站统计'
    // },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['文章','会员','评论']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
   
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'文章',
            type:'line',
            stack: '总量',
            data:[]
        },
        {
            name:'会员',
            type:'line',
            stack: '总量',
            data:[]
        },
        {
            name:'评论',
            type:'line',
            stack: '总量',
            data:[]
        }
    ]
}

export default {
  data () {
    return {
      url: '/api/home',
      total: {
        totalArticles: 0,
        totalComments: 0,
        totalMembers: 0
      },
      optLog: [],
      chartPie: null,
      chartBar: null
    }
  },
  created () {
    this.getTotals()
    this.getOptLog()
  },
  computed: {
    username () {
      let username = sessionStorage.getItem('hw_username')
      let uname = this.name
      if (username !== '') {
        uname = username
      }
      return uname
    }
  },
  methods: {
    getTotals () {
      this.$axios.get(this.url + '/getTotals'
      ).then((res) => {
        this.total = res.data
      }).catch((error) => {
        //console.log(error)
        this.$message.error('请求数据没有响应！')
      })
    },
    getOptLog () {
      this.$axios.get(this.url + '/getOptLog'
      ).then((res) => {
        if (res.data.result == 'success') {
          this.optLog = res.data.list
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch((error) => {
        //console.log(error)
        this.$message.error('请求数据没有响应！')
      })
    },
    
    drawPieChart () {
      this.chartPie = echarts.init(document.getElementById('chartPie'));
      this.chartPie.setOption(pieOption);

      this.$axios.get(this.url + '/getPieData'
      ).then((res) => {
        this.chartPie.hideLoading();
        this.chartPie.setOption({
          series: [{
              data: res.data.data
          }]
        });
      }).catch((error) => {
        console.log(error)
        this.$message.error('请求数据没有响应！')
      });
    },
    drawLineChart () {
      this.chartLine = echarts.init(document.getElementById('chartLine'));
      this.chartLine.setOption(lineOption);
      this.$axios.get(this.url + '/getLineData'
      ).then((res) => {
        this.chartLine.hideLoading();
        this.chartLine.setOption({
          xAxis: {
              data: res.data.date
          },
          series: [
              {
                  data: res.data.dataArticle
              },
              {
                  data: res.data.dataMember
              },
              {
                  data: res.data.dataComment
              }
          ]
        });
      }).catch((error) => {
        console.log(error)
        this.$message.error('请求数据没有响应！')
      });
    }
  },
  mounted: function () {
    this.drawPieChart();
    this.drawLineChart();
  },
  updated: function () {
    //this.getPieData();
    //this.drawPieChart();
      // this.drawLineChart()
      // //this.getChartData();
  }
}
</script>

<style lang="less" scoped>
.bg-div {
  padding: 10px 10px 10px 30px;
  font-size: 14px;
  color: #fff;
  span {
    font-size: 22px;
    font-weight: bold;
  }
}
.bg-blue{
  background: #20A0FF;
}
.bg-green {
  background: #13CE66;
}
.bg-orange {
  background: #F7BA2A;
}
.box-card{
  height: 360px;
  overflow: hidden;
  margin-top: 20px;
}
.welcome{
  padding: 10px 0;
}
.text p{
  padding: 2px 0;
  width: 100%;
  display: inline-block;
  overflow: hidden;
  span {
    color: #999;
    margin-right: 10px;
  }
}
</style>