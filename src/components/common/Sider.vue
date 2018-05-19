<template>
    <div class="sidebar">
      <div class="switchBtn">
          <p v-if="$store.state.isCollapse" @click="$store.commit('switch_menu')"><i class="iconfont icon-zhankaicaidan"></i></p>
          <p v-else  @click="$store.commit('switch_menu')"><i class="iconfont icon-shouqicaidan"></i></p>
        </div>

      <el-menu :default-active="onRoutes" class="el-menu-vertical" them="dark" unique-opened router :collapse="menuShow">
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
      <div class="copyright" v-show="!menuShow">Powered By Helloweba</div>
    </div>

</template>

<script>
import bus from '../bus';

export default {
  data () {
    return {
      isCollapse: true,
      items: [
        {
          icon: 'icon-all',
          index: '/main',
          title: '控制台'
        },
        {
          icon: 'icon-form',
          index: '/article',
          title: '文章',
          subs: [
            {
              index: '/article',
              title: '文章列表'
            },
            {
              index: '/article/add',
              title: '新增文章'
            },
            {
              index: '/catelog',
              title: '文章分类'
            }
          ]
        },
        {
          icon: 'icon-comments',
          index: '/comment',
          title: '评论'
        },
        {
          icon: 'icon-account',
          index: '/member',
          title: '会员'
        },
        {
          icon: 'icon-moban',
          index: '/logs',
          title: '权限',
          subs: [
            {
              index: '/admin',
              title: '管理员'
            },
            {
              index: '/group',
              title: '用户组'
            },
            {
              index: '/logs',
              title: '操作日志'
            }
          ]
        },
        {
          icon: 'icon-shezhi',
          index: '/setting',
          title: '设置'
        }
      ]
    }
  },
  computed: {
    menuShow() {
        return this.$store.state.isCollapse;
    },
    onRoutes () {
      let path = this.$route.path
      let pathArr = path.split('/')
      let routeName = pathArr[1]

      let routeId = this.$route.params.id
      bus.$emit('loadInfo', routeId);

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
  
  .switchBtn{
    width: 100%;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    background: #DBE1EC;
    p{
      color: #999;
      i.icon-shouqicaidan{
        padding-left: 90px;
      }
      i.icon-zhankaicaidan{
        padding-left: 20px;
      }
    }
  }

  ul {
    height: 100%;
  }
  .el-menu{
    background: #eef1f6;
    .iconfont{
      font-size: 18px;
    }
  }

  
}
.copyright{
  position: absolute;
  bottom: 0;
  left: 20px;
  z-index: 1001;
  height: 28px;
  line-height: 28px;
  color: #999;
  font-size: 12px;
}
.iconfont{margin-right: 10px;}
.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
.el-menu--collapse{
  width: 50px;
}
</style>