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
import PortalIndex from '@/view/portal/PortalIndex'
import PortalCustomiz from '@/view/portal/PortalCustomiz'
import PortalView from '@/view/portal/PortalView'
import ReportDesign from '@/view/bireport/ReportDesign'
import BireportPrint from '@/view/bireport/Print'
import PortalPrint from '@/view/portal/Print'
import PortalPushView from '@/view/portal/PortalPushView'
import PortalShareView from '@/view/portal/PortalShareView'
import NotFind from '@/view/NoFind'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path:'*',
      component:NotFind
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
          name:'portalIndex',
          component:PortalIndex
        },
        {
          path:'/portal/View',
          name:'portalView',
          component:PortalView
        },
        {
          path:"/portal/Customiz",
          name:"PortalCustomiz",
          component:PortalCustomiz
        }
        ,
        {
          path:'/bireport/ReportDesign',
          name:'bireport',
          component:ReportDesign
        },
        {
          path:'/portal/PushView',
          name:'portalPushView',
          component:PortalPushView
        }
      ]
    },
    {
      path: '/bireport/Print',
      name: 'bireportPrint',
      component: BireportPrint
    },
    {
      path:"/portal/Print",
      name:"portalPrint",
      component:PortalPrint
    },
    {
      path:"/portal/ShareView",
      name:"portalShareView",
      component:PortalShareView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.path != "/"){
    // if(!checkIsLogin()){
    //   next("/")
    //   return;
    // }
  }
  next();
})

export default router;
