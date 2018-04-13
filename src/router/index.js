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
          path: '/product',
          component: resolve => require(['@/components/page/Product'], resolve)
        },
        {
          name: 'productAdd',
          path: '/product/add',
          component: resolve => require(['@/components/page/ProductAdd'], resolve)
        },
        {
          path: '/product/:id',
          component: resolve => require(['@/components/page/ProductAdd'], resolve)
        },
        {
          path: '/pages',
          component: resolve => require(['@/components/page/Pages'], resolve)
        },
        {
          name: 'pageAdd',
          path: '/pages/add',
          component: resolve => require(['@/components/page/PageAdd'], resolve)
        },
        {
          path: '/pages/:id',
          component: resolve => require(['@/components/page/PageAdd'], resolve)
        },
        {
          path: '/logs',
          component: resolve => require(['@/components/page/Logs'], resolve)
        },
        {
          path: '/mkhtml',
          component: resolve => require(['@/components/page/Makehtml'], resolve)
        },
      ]
    }
  ]
})
