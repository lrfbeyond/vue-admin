import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/components/page/Login'
// import Main from '@/components/page/Main'
// import Article from '@/components/page/Article'
// import ArticleAdd from '@/components/page/ArticleAdd'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/components/page/Login'], resolve)
    },
    {
      path: '/main',
      component: resolve => require(['@/components/common/Home'], resolve),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/',
          component: resolve => require(['@/components/page/Main'], resolve)
        },
        {
          path: '/article',
          component: resolve => require(['@/components/page/Article'], resolve)
        },
        {
          name: 'articleAdd',
          path: '/article/add',
          component: resolve => require(['@/components/page/ArticleAdd'], resolve)
        },
        {
          path: '/article/:id',
          component: resolve => require(['@/components/page/ArticleAdd'], resolve)
        },
        {
          path: '/catelog',
          component: resolve => require(['@/components/page/Catelog'], resolve)
        },
        {
          name: 'comment',
          path: '/comment',
          component: resolve => require(['@/components/page/Comment'], resolve)
        },
        {
          path: '/comment/reply',
          component: resolve => require(['@/components/page/CommentReply'], resolve)
        },
        {
          path: '/member',
          component: resolve => require(['@/components/page/Member'], resolve)
        },
        {
          path: '/logs',
          component: resolve => require(['@/components/page/Logs'], resolve)
        }
      ]
    }
  ]
})
