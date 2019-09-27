import Vue from 'vue'
import Router from 'vue-router'
const Layout = () => import('@/pages/layout/layout');
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
          component: resolve => require(['@/pages/project/project'], resolve)
        },
        {
          path: '/version',
          name: 'version',
          meta: {
            requireAuth: true,  
          },
          component: resolve => require(['@/pages/version/version'], resolve)
        }
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/login/login'], resolve)
    },
    {
      path: '/register',
      name: 'register',
      component: resolve => require(['@/pages/register/register'], resolve)
    },
    {
      path: '/view',
      name: 'view',
      meta: {
        requireAuth: true,  
      },
      component: resolve => require(['@/pages/view/view'], resolve)
    },
    {
      path: '/difference',
      name: 'difference',
      meta: {
        requireAuth: true,  
      },
      component: resolve => require(['@/pages/difference/difference'], resolve)
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