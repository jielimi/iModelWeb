// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/common.less';
import locale from 'element-ui/lib/locale/lang/en';

// import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"

import {
  AccuSnap,
  IModelApp,
  MessageBoxIconType,
  MessageBoxType,
  MessageBoxValue,
  NotificationManager,
  NotifyMessageDetails,
  SnapMode,
  ToolTipOptions,
} from "@bentley/imodeljs-frontend";
import { DrawingAidTestTool } from "./DrawingAidTestTool";

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

class DisplayTestAppAccuSnap extends AccuSnap {
  constructor() {
    super()
    this._activeSnaps =  [SnapMode.NearestKeypoint];
  }
  keypointDivisor() { return 2; }
  getActiveSnapModes() { return this._activeSnaps; }
  setActiveSnapModes(snaps) {
    this._activeSnaps.length = snaps.length;
    for (let i = 0; i < snaps.length; i++)
      this._activeSnaps[i] = snaps[i];
  }
}


class SVTIModelApp extends IModelApp {
  onStartup() {
    IModelApp.accuSnap = new DisplayTestAppAccuSnap();
    // IModelApp.notifications = new Notifications();
    const svtToolNamespace = IModelApp.i18n.registerNamespace("SVTTools");
    DrawingAidTestTool.register(svtToolNamespace);
  }

  setActiveSnapModes(snaps) {
    IModelApp.accuSnap.setActiveSnapModes(snaps);
  }

  setActiveSnapMode(snap) { this.setActiveSnapModes([snap]); }

}



SVTIModelApp.startup();