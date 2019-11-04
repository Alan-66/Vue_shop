// 入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
//配置默认路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截器 配置Authorization 获得token
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  function(error) {
    console.log(error)
  }
)
Vue.prototype.$http = axios
//axios请求拦截器

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

//拦截器和导航守卫的区别
//导航守卫是为了防止非法登录 如果没有登录就不能访问后台页面 （通过token判断有没有登录
//拦截器是为了复用代码 把每一个ajax都要设置的头信息提取到拦截器当中（通过token拿数据发向服务器）
