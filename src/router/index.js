import Vue from 'vue'
import Router from 'vue-router'
const Layout = () => import('@/pages/layout/layout');


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/project',//设置默认指向的路径
      component: Layout,
      children: [
        {
          path: '/project',
          name: 'project',
          component: resolve => require(['@/pages/project/project'], resolve)
        },
        {
          path: '/version',
          name: 'version',
          component: resolve => require(['@/pages/version/version'], resolve)
        }
      ]
    },
    // {
    //   path: '/',
    //   name: 'project',
    //   component: resolve => require(['@/pages/project/project'], resolve)
    // },
    {
      path: '/pages/version/:projectId',
      name: 'version',
      component: resolve => require(['@/pages/version/version'], resolve)
    }
  ]
})
