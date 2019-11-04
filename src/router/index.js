import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Users from '../components/user/Users.vue'

// import Welcome from '../components/Welcome.vue'
import Welcome from '@/components/Welcome.vue'
import Rights from '@/components/power/Rights.vue'
import Roles from '@/components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles }
    ]
  }
]
//本质就是改写了element内部的push方法
//对错误进行了捕获
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes
})

//a路由向b路由跳转之前会执行
//导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  // from 非标从哪个路径跳转而来
  // next 是一个函数 代表放行
  if (to.path == '/login') return next()
  //获取token
  const toToken = window.sessionStorage.getItem('token')
  if (!toToken) return next('/login')
  next()
})

export default router
