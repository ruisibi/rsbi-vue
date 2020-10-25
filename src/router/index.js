import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login'
import Main from '@/view/Main'
import Welcome from '@/view/Welcome'
import Menu from '@/view/frame/Menu'
import Role from '@/view/frame/Role'
import User from '@/view/frame/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/Welcome',
          name: 'welcome',
          component: Welcome
        },
        {
          path:'/frame/Menu',
          name:'menu',
          component:Menu
        },
        {
          path:'/frame/User',
          name:'user',
          component:User
        },
        {
          path:'/frame/Role',
          name:'role',
          component:Role
        }
      ]
    }
  ]
})
