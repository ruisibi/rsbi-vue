// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap3/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import {globalMixins,globalPlugin} from "./common/globalMixins.js"
import {store} from "./store/index.js";

Vue.use(ElementUI);
Vue.use(globalPlugin);
Vue.mixin(globalMixins);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
