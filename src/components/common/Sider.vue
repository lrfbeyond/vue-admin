<template>
    <div class="sidebar">
      <el-menu :default-active="onRoutes" class="" them="dark" unique-opened router>
        <template v-for="item in items">
          <template v-if="item.subs">
            <el-submenu :index="item.index">
              <template slot="title">
                <i class="iconfont" :class="item.icon"></i> {{ item.title }}
              </template>
              <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index">
              <i class="iconfont" :class="item.icon"></i> {{ item.title }}
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          icon: 'icon-fenlei',
          index: '/main',
          title: '控制台'
        },
        {
          icon: 'icon-yanchurili',
          index: '/article',
          title: '文章',
          subs: [
            {
              index: '/article',
              title: '文章列表',
            },
            {
              index: '/article/add',
              title: '新增文章',
            },
            {
              index: '/catelog',
              title: '文章分类',
            },
            {
              index: '/catelog/add',
              title: '新增分类',
            }
          ]
        },
        {
          icon: 'icon-wodedingdan',
          index: '/comment',
          title: '评论',
          subs: [
            {
              index: '/comment',
              title: '评论列表',
            },
            {
              index: '/comment/reply',
              title: '最新回复'
            }
          ]
        },
        {
          icon: 'icon-circle',
          index: '/member',
          title: '会员'
        },
        {
          icon: 'icon-shezhi',
          index: '/log',
          title: '日志'
        }
      ]
    }
  },
  computed: {
    onRoutes () {
      let path = this.$route.path
      let pathArr = path.split('/')
      let routeName = pathArr[1]
      return '/' + routeName
      // return this.$route.path.replace('/', '')
    }
  }
}
</script>

<style scoped lang="less">
.sidebar {
  display: block;
  position: absolute;
  width: 200px;
  left: 0;
  top: 70px;
  bottom: 0;
  

  ul {
    height: 100%;
  }

  .el-menu{
    background: #eef1f6;
  }
}
</style>