// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/common.less';


Vue.config.productionTip = false
// Vue.use(ElementUI)
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

import {
  post,
  get,
  patch,
  put
} from './utils/request'

Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
