<template>
  <div>
    <div class="welcome">欢迎管理员：{{ username }}。</div>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>最近操作</span>
          </div>
          <div class="text item">
            <template v-for="item in optLog">
            <p><span>{{item.create_time}}</span>{{item.content}}</p>
            </template>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>资讯概览</span>
          </div>
          <div class="text item">
            <div id="chartPie" style="width:100%; height:240px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>资讯统计</span>
          </div>
          <div class="text item">
            <div id="chartBar" style="width:100%; height:240px;"></div>
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
          name: '资讯统计',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data: []
      }
  ]
}

const barOption = {
  tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
  },
  legend: {
      data:['业内资讯','公司动态']
  },
  grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
  },
  color: ['#d48265', '#91c7ae'],
  xAxis : [
      {
          type : 'category',
          data : []
      }
  ],
  yAxis : [
      {
          type : 'value'
      }
  ],
  series : [
      
      {
          name:'业内资讯',
          type:'bar',
          stack: '广告',
          data:[]
      },
      {
          name:'公司动态',
          type:'bar',
          stack: '广告',
          data:[]
      }
  ]
}

export default {
  data () {
    return {
      url: '/admin/index',
      optLog: [],
      chartPie: null,
      chartBar: null
    }
  },
  created () {
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

      this.$axios.get('/admin/index/getPieData'
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
    drawBarChart () {
      this.chartBar = echarts.init(document.getElementById('chartBar'));
      this.chartBar.setOption(barOption);
      this.$axios.get('/admin/index/getBarData'
      ).then((res) => {
        this.chartBar.hideLoading();
        this.chartBar.setOption({
          xAxis: [{
            data: res.data.date
          }],
          series: [{
            data: res.data.data[0]
          },{
            data: res.data.data[1]
          }]
        });
      }).catch((error) => {
        console.log(error)
        this.$message.error('请求数据没有响应！')
      });
    }
  },
  mounted: function () {
    this.drawPieChart();
    this.drawBarChart();
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