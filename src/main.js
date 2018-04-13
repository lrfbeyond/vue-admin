// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import './assets/css/iconfont.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
// axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:9999'
//http://localhost:9999
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$axios = axios

axios.interceptors.request.use(config => {
  let token = sessionStorage.getItem('token')
  if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers = {
      'X-token': token
    }
  }
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(response => {
  if (response.data.result === 'failed' && response.data.code === -1) {
    //this.$message.error('请重新登录！')
    router.push('/login')
  }
  return response
}, err => {
  return Promise.reject(err)
})

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     let token = sessionStorage.getItem('token')
//     if (!token) {
//       next({
//         path: 'login',
//         query: {
//           redirect: to.fullPath
//         }
//       })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
