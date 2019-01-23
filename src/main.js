// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/common.less';
import locale from 'element-ui/lib/locale/lang/en';

import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

window.eventHub = new Vue();

Vue.prototype.GLOBAL_DATA = {
  theViewPort:{},
  activeViewState:{}
};


function stringToSnapMode(name) {
  switch (name) {
      case "Keypoint": return 2 /* NearestKeypoint */;
      case "Nearest": return 1 /* Nearest */;
      case "Center": return 8 /* Center */;
      case "Origin": return 16 /* Origin */;
      case "Intersection": return 64 /* Intersection */;
      default: return 2 /* NearestKeypoint */;
  }
}
class SVTAccuSnap extends frontend_1.AccuSnap {
  getActiveSnapModes() {
      const select = document.getElementById("snapModeList"); // 这个是工具栏第7个，杠铃下面有个钢琴那个，不知道什么意思，回头看,感觉是一个新增的工具才这么处理了
      const snapMode = stringToSnapMode(select.value);
      const snaps = [];
      snaps.push(snapMode);
      return snaps;
  }
}

class MeasurePointsTool extends frontend_1.PrimitiveTool {
  constructor() {
      super(...arguments);
      this.points = [];
  }
  requireWriteableTarget() { return false; }
  onPostInstall() { super.onPostInstall(); frontend_1.IModelApp.accuSnap.enableSnap(true); }
  onRestartTool() {
      this.exitTool();
  }
}

MeasurePointsTool.toolId = "Measure.Points";

class SVTIModelApp extends frontend_1.IModelApp {
  onStartup() {
  const svtToolNamespace = frontend_1.IModelApp.i18n.registerNamespace("SVTTools");
  MeasurePointsTool.register(svtToolNamespace);
}
}

SVTIModelApp.startup();