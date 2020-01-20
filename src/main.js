// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import router from './router/index.js'
import routerMobile from './router/index-mobile.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/common.less';
import locale from 'element-ui/lib/locale/lang/en';
import './polyfills';
var r;
var ua = navigator.userAgent.toLowerCase();
if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
	r = routerMobile;
}else {
	r = router;
}
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small', zIndex: 3000, locale });
import {
  post,
  get,
  patch,
  put,
  del
} from './utils/request'

Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;
Vue.prototype.$del = del;
Vue.config.performance = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: r,
  components: { App },
  template: '<App/>'
})

window.eventHub = new Vue();


