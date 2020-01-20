import Vue from 'vue'
import Router from 'vue-router'
const Layout = () => import('@/pages/mobile/layout/layout');
import { getCookie } from '@/utils/cookies';


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/project',//设置默认指向的路径
      component: Layout,
      children: [
        {
          path: '/project',
          name: 'project',
          meta: {
            requireAuth: true,  
          },
          component: resolve => require(['@/pages/mobile/project/project'], resolve)
        },
        {
          path: '/version',
          name: 'version',
          meta: {
            requireAuth: true,  
          },
          component: resolve => require(['@/pages/mobile/version/version'], resolve)
        }
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/mobile/login/login'], resolve)
    },
    {
      path: '/view',
      name: 'view',
      meta: {
        requireAuth: true,  
      },
      component: resolve => require(['@/pages/mobile/view/view'], resolve)
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  
      if (getCookie("token")) {  
          next();
      }
      else {
          next({
              path: '/login',
              query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
  }
  else {
      next();
  }
})


export default router