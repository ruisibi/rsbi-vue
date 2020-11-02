import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login'
import Main from '@/view/Main'
import Welcome from '@/view/Welcome'
import Menu from '@/view/frame/Menu'
import Role from '@/view/frame/Role'
import RoleMenu from '@/view/frame/RoleMenu'
import User from '@/view/frame/User'
import UserMenu from '@/view/frame/UserMenu'
import Model from '@/view/model/Index'
import Portal from '@/view/portal/Index'
import ReportDesign from '@/view/bireport/ReportDesign'

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
        },
        {
          path:'/frame/RoleMenu',
          name:'roleMenu',
          component:RoleMenu
        },
        {
          path:'/frame/UserMenu',
          name:'userMenu',
          component:UserMenu
        },
        {
          path:'/model/Index',
          name:'model',
          component:Model
        },
        {
          path:'/portal/Index',
          name:'portal',
          component:Portal
        }
        ,
        {
          path:'/bireport/ReportDesign',
          name:'bireport',
          component:ReportDesign
        }
      ]
    }
  ]
})
